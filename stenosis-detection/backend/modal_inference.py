"""Modal-deployed YOLOv8s-seg inference service for CardioVision.

This module runs ONLY on Modal. The Render backend forwards authenticated
multipart image uploads here; this service performs YOLO inference and
returns the same JSON contract the existing Render /api/predict endpoint
has always returned.

Design notes:
- The YOLO model is loaded ONCE per active container (lazy, on first request)
  and cached in a module-level dict for the container's lifetime -- not
  reloaded per request.
- CPU inference by default (gpu=None). GPU is opt-in via MODAL_GPU env var
  for future benchmarking; never allocated by default.
- Scale-to-zero: min_containers=0, max_containers=1 to start.
- Authentication: Render sends ``Authorization: Bearer <MODAL_INFERENCE_TOKEN>``.
  The token is injected via a Modal Secret, never committed to Git.
- Reuses the shared stenosis algorithm from app.services.stenosis and the
  image-preprocessing / mask-encoding / heatmap helpers from app.services.yolo
  so there is a single source of truth for those calculations.
- Never logs uploaded image contents or patient-identifiable information.
"""

import base64
import gc
import io
import logging
import os
import time
import traceback

import modal

logger = logging.getLogger("modal.inference")
logging.basicConfig(level=logging.INFO)

app = modal.App("cardio-vision-inference")

# ---------------------------------------------------------------------------
# Modal image: mirrors Render's ML stack but CPU-only torch wheels.
# ---------------------------------------------------------------------------
MODAL_IMAGE = (
    modal.Image.debian_slim()
    # libgomp1 required by PyTorch/NumPy OpenMP; libgl1 + glib/x libs required
    # by matplotlib/opencv on a headless container.
    .apt_install(
        "libgomp1", "libgl1", "libglib2.0-0", "libsm6", "libxext6",
        "libxrender1", "libfontconfig1", "libice6",
    )
    # CPU-only PyTorch FIRST (matches Render requirements.txt strategy).
    # Installing torch from the CPU index before ultralytics prevents
    # ultralytics from resolving torch>=1.8.0 to a CUDA wheel.
    .run_commands(
        "pip install --extra-index-url https://download.pytorch.org/whl/cpu "
        "torch>=2.0.0 torchvision>=0.15.0"
    )
    .pip_install(
        "fastapi==0.115.0",
        "python-multipart==0.0.9",
        "pillow==10.4.0",
        "numpy==1.26.4",
        "psutil>=5.9.0",
        "python-dotenv",
        "ultralytics==8.2.50",
        "opencv-python-headless>=4.10.0",
    )
    # Pack the already Git-tracked trained weights into the image.
    # No recommit necessary; weights stay at backend/models/YOLOv8s-seg-best.pt.
    .add_local_file(
        "models/YOLOv8s-seg-best.pt", "/root/models/YOLOv8s-seg-best.pt"
    )
    # Share the inference-core Python modules so the stenosis algorithm and
    # preprocessing/heatmap helpers live in exactly one place.
    .add_local_python_source("app")
)

# Inference knobs (mirror Render config defaults).
MAX_IMAGE_SIDE = int(os.getenv("MAX_IMAGE_SIDE", "640"))
YOLO_IMGSZ = int(os.getenv("YOLO_IMGSZ", "640"))
MAX_UPLOAD_BYTES = int(os.getenv("MAX_UPLOAD_BYTES", str(8 * 1024 * 1024)))

# Only the weights we package on Modal are served here.
AVAILABLE_MODELS = {"YOLOv8s-seg": "/root/models/YOLOv8s-seg-best.pt"}

# Shared-secret auth token injected via Modal Secret (never hardcoded).
EXPECTED_TOKEN = os.getenv("MODAL_INFERENCE_TOKEN", "")

CONF_THRESHOLD = 0.25
IOU_THRESHOLD = 0.45
DEVICE = "cpu"

# Model loaded once per container, cached for the container's lifetime.
_MODEL_CACHE: dict = {}


def _log_memory(stage: str) -> None:
    try:
        import psutil

        process = psutil.Process(os.getpid())
        rss_mb = process.memory_info().rss / (1024 * 1024)
        logger.info(f"[memory] {stage}: {rss_mb:.1f} MB RSS")
    except Exception as exc:  # pragma: no cover - best-effort telemetry
        logger.warning(f"Unable to log memory for {stage}: {exc}")


def ndarray_to_b64_png(arr) -> str:
    """Convert an HxW or HxWx3 uint8 array to a base64-encoded PNG."""
    from PIL import Image

    if arr.ndim == 2:
        pil = Image.fromarray(arr, mode="L")
    else:
        pil = Image.fromarray(arr.astype("uint8"))
    buf = io.BytesIO()
    pil.save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode()


def preprocess_image_for_inference(image):
    """Downscale large inputs so inference stays fast and within memory budget."""
    from PIL import Image

    if max(image.width, image.height) > MAX_IMAGE_SIDE:
        ratio = MAX_IMAGE_SIDE / max(image.width, image.height)
        new_size = (
            max(1, int(image.width * ratio)),
            max(1, int(image.height * ratio)),
        )
        logger.info(
            "Resizing input image from %sx%s to %sx%s for inference",
            image.width,
            image.height,
            new_size[0],
            new_size[1],
        )
        return image.resize(new_size, Image.LANCZOS)
    return image


def _generate_heatmap_overlay(img_array, combined_mask):
    """Build a green->yellow->red attention overlay base64 PNG from the mask.

    Reuses the same math as the legacy Render implementation so the visual
    output is identical.
    """
    import numpy as np
    from PIL import Image, ImageFilter

    h, w = combined_mask.shape

    mask_blur = np.array(
        Image.fromarray((combined_mask * 255).astype("uint8"), mode="L")
        .filter(ImageFilter.GaussianBlur(radius=8))
    ).astype("float32") / 255.0
    mask_blur = np.clip(mask_blur, 0.0, 1.0)

    total = float(np.sum(mask_blur))
    if total > 0:
        ys = np.arange(h, dtype="float32")
        xs = np.arange(w, dtype="float32")
        col_sum = np.sum(mask_blur, axis=0)
        row_sum = np.sum(mask_blur, axis=1)
        cx = float(np.dot(xs, col_sum)) / total
        cy = float(np.dot(ys, row_sum)) / total

        yy, xx = np.meshgrid(ys, xs, indexing="ij")
        dist = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2, dtype="float32")
        max_dist = float(np.max(dist[mask_blur > 0]) + 1e-8)
        dist_norm = np.clip(1.0 - dist / max_dist, 0.0, 1.0)
        intensity = np.clip(mask_blur * 0.35 + dist_norm * 0.65, 0.0, 1.0)

        del yy, xx, dist, dist_norm, col_sum, row_sum, xs, ys
        gc.collect()
    else:
        intensity = mask_blur

    alpha = np.clip(mask_blur * 0.9 + 0.2, 0.0, 1.0)

    red = np.clip(np.where(intensity >= 0.5, (intensity - 0.5) * 2.0, 0.0), 0, 1)
    green = np.clip(np.where(intensity <= 0.5, intensity * 2.0, (1.0 - intensity) * 2.0), 0, 1)
    blue = np.clip(np.where(intensity <= 0.5, 1.0 - intensity * 2.0, 0.0), 0, 1)
    heatmap = np.stack([red, green, blue], axis=-1) * 255

    overlay = np.clip(
        img_array * (1.0 - alpha[..., None]) + heatmap * alpha[..., None],
        0,
        255,
    ).astype("uint8")
    return ndarray_to_b64_png(overlay)


def _load_model(model_name: str):
    """Load YOLOv8-seg weights once per container (cold start)."""
    import torch
    from ultralytics import YOLO
    from ultralytics.nn import tasks

    if model_name in _MODEL_CACHE:
        return _MODEL_CACHE[model_name]

    model_path = AVAILABLE_MODELS[model_name]
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model weights not found on Modal: {model_path}")

    original_torch_safe_load = tasks.torch_safe_load
    tasks.torch_safe_load = lambda weight: (
        torch.load(weight, map_location="cpu", weights_only=False),
        weight,
    )
    logger.info("Loading %s from %s (Modal cold start) ...", model_name, model_path)
    try:
        model = YOLO(model_path)
    finally:
        tasks.torch_safe_load = original_torch_safe_load
    _MODEL_CACHE[model_name] = model
    logger.info("%s loaded OK on Modal.", model_name)
    return model


def get_model(model_name: str):
    """Cached model accessor (loads once per container)."""
    return _load_model(model_name)


def _run_inference(image, model_name: str) -> dict:
    """Run the full memory-intensive inference lifecycle once.

    Returns a flat dict matching the existing StenosisResult contract
    (processing_time excluded; added by the HTTP layer).
    """
    import numpy as np
    import torch
    from PIL import Image

    from app.services.stenosis import classify_severity, estimate_diameter_reduction

    _log_memory("before preprocessing")
    image = preprocess_image_for_inference(image)
    _log_memory("after preprocessing")

    img_array = np.array(image.convert("RGB"))
    model = get_model(model_name)

    _log_memory("before forward pass")
    t0 = time.time()
    with torch.inference_mode():
        results = model(
            img_array,
            conf=CONF_THRESHOLD,
            iou=IOU_THRESHOLD,
            device=DEVICE,
            verbose=False,
            imgsz=YOLO_IMGSZ,
        )
    inference_ms = (time.time() - t0) * 1000.0
    _log_memory("after forward pass")

    result = results[0]
    boxes = result.boxes

    # --- no-detection path -------------------------------------------------
    if boxes is None or len(boxes) == 0:
        del results, result, boxes, img_array
        gc.collect()
        _log_memory("before returning response")
        return {
            "stenosis": False,
            "confidence": 0.0,
            "severity": "none",
            "stenosis_percent": 0.0,
            "bbox": [0.0, 0.0, 0.0, 0.0],
            "mask_b64": None,
            "heatmap_b64": None,
            "detections": [],
            "model_used": model_name,
            "inference_ms": round(inference_ms, 3),
        }

    h, w = img_array.shape[:2]
    combined_mask = np.zeros((h, w), dtype=np.float32)
    detections = []

    for idx, box in enumerate(boxes):
        x1, y1, x2, y2 = [round(float(v), 1) for v in box.xyxy[0].tolist()]
        conf = round(float(box.conf[0].item()), 3)
        bbox = [x1, y1, x2, y2]

        stenosis_pct = estimate_diameter_reduction(bbox, img_array.shape)
        severity = classify_severity(stenosis_pct)

        mask_b64 = None
        try:
            if result.masks is not None and len(result.masks.data) > idx:
                raw = result.masks.data[idx].cpu().numpy()  # float32 [H, W]
                mh, mw = raw.shape
                mask_uint8 = (raw * 255).astype("uint8")
                del raw
                if mh != h or mw != w:
                    mask_pil = (
                        Image.fromarray(mask_uint8, mode="L")
                        .resize((w, h), Image.NEAREST)
                    )
                    mask_uint8 = np.array(mask_pil)
                mask_b64 = ndarray_to_b64_png(mask_uint8)
                combined_mask = np.maximum(
                    combined_mask, mask_uint8.astype(np.float32) / 255.0
                )
                del mask_uint8
                gc.collect()
        except Exception as exc:  # pragma: no cover - mask extraction is best-effort
            logger.warning("Mask extraction failed for detection %s: %s", idx, exc)

        detections.append(
            {
                "bbox": bbox,
                "confidence": conf,
                "severity": severity,
                "stenosis_percent": stenosis_pct,
                "mask_b64": mask_b64,
            }
        )

    _log_memory("after segmentation extraction")

    combined_mask = np.clip(combined_mask, 0.0, 1.0)
    combined_mask_b64 = None
    heatmap_b64 = None

    if np.any(combined_mask > 0):
        combined_mask_b64 = ndarray_to_b64_png(
            (combined_mask * 255).astype("uint8")
        )

    try:
        heatmap_b64 = _generate_heatmap_overlay(img_array, combined_mask)
    except Exception as exc:  # pragma: no cover - heatmap is best-effort
        logger.warning("Heatmap generation failed: %s", exc)

    _log_memory("after heatmap generation")

    # Release large raw intermediates once all encoded outputs are produced.
    del combined_mask, img_array
    gc.collect()

    best_idx = int(boxes.conf.argmax().item())
    primary = detections[best_idx]
    top_severity = max(detections, key=lambda d: d["stenosis_percent"])["severity"]
    top_percent = max(d["stenosis_percent"] for d in detections)

    _log_memory("before returning response")

    return {
        "stenosis": True,
        "confidence": primary["confidence"],
        "severity": top_severity,
        "stenosis_percent": top_percent,
        "bbox": primary["bbox"],
        "mask_b64": combined_mask_b64,
        "heatmap_b64": heatmap_b64,
        "detections": detections,
        "model_used": model_name,
        "inference_ms": round(inference_ms, 3),
    }


# ---------------------------------------------------------------------------
# ASGI app: routes defined once per container; model lazy-loaded on first request.
# ---------------------------------------------------------------------------
@app.function(
    image=MODAL_IMAGE,
    secrets=[modal.Secret.from_name("cardio-vision-modal-token")],
    gpu=None,  # CPU default; opt into GPU later via MODAL_GPU env var if desired.
    min_containers=0,  # scale to zero between requests (Starter-plan friendly)
    max_containers=1,  # start with a single concurrent inference container
    cpu=2,
    memory=1024,  # MiB; headroom for YOLOv8s-seg CPU activations
    timeout=300,  # hard per-request ceiling (seconds)
    env={"MPLBACKEND": "Agg"},  # headless matplotlib backend
)
@modal.asgi_app()
def fastapi_app():
    """Serve the CardioVision inference API on Modal.

    The model is lazy-loaded on first request and cached for the container's
    lifetime, so every request handled by the same container reuses the
    cached YOLO model.
    """
    import torch

    torch.set_num_threads(2)
    torch.set_num_interop_threads(2)

    from fastapi import FastAPI, File, Header, HTTPException, UploadFile, status
    from fastapi.responses import JSONResponse
    from PIL import Image

    web_app = FastAPI(title="CardioVision Inference (Modal)")

    @web_app.get("/health")
    async def modal_health():
        return {
            "status": "healthy",
            "provider": "modal",
            "model_loaded": bool(_MODEL_CACHE),
            "available_models": list(AVAILABLE_MODELS.keys()),
        }

    @web_app.post("/predict")
    async def predict(
        file: UploadFile = File(...),
        model_name: str = "YOLOv8s-seg",
        authorization: str = Header(None),
    ):
        """Upload an angiography image and receive segmentation results.

        Mirrors the Render POST /api/predict contract:
        multipart field `file`, query param `model_name`.
        """
        # --- authentication -----------------------------------------------
        if not EXPECTED_TOKEN:
            logger.error("MODAL_INFERENCE_TOKEN not configured on Modal")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Inference service is not configured.",
            )
        if authorization is None or not authorization.startswith("Bearer "):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing or invalid authentication token.",
            )
        token = authorization.split(" ", 1)[1]
        if token != EXPECTED_TOKEN:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token.",
            )

        # --- model validation --------------------------------------------
        if model_name not in AVAILABLE_MODELS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unknown model '{model_name}'. Available: {list(AVAILABLE_MODELS.keys())}",
            )

        # --- bounded image read ------------------------------------------
        try:
            contents = await file.read(MAX_UPLOAD_BYTES + 1)
            if len(contents) > MAX_UPLOAD_BYTES:
                raise HTTPException(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    detail=f"Image too large. Maximum size is {MAX_UPLOAD_BYTES // (1024 * 1024)} MB.",
                )
            image = Image.open(io.BytesIO(contents)).convert("RGB")
        except HTTPException:
            raise
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid image: {exc}",
            )

        # --- inference ----------------------------------------------------
        try:
            get_model(model_name)  # ensure model is loaded (cold start if needed)
            result = _run_inference(image, model_name)
        except FileNotFoundError as exc:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc)
            )
        except HTTPException:
            raise
        except Exception as exc:  # pragma: no cover - inference failures
            logger.error("Inference error:\n%s", traceback.format_exc())
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Inference error: {str(exc)}",
            )

        result["processing_time"] = round(result.pop("inference_ms", 0.0) / 1000.0, 3)
        return JSONResponse(content=result)

    return web_app


if __name__ == "__main__":
    # Allows `python modal_inference.py` to print the app name locally.
    print("Modal app:", app)
