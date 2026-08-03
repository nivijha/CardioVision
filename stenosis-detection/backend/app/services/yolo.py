"""YOLOv8-seg inference service.

Owns the model cache and the end-to-end inference pipeline: preprocessing,
forward pass, mask/heatmap generation, and stenosis estimation.
"""

import base64
import io
import logging
import os

import numpy as np
from PIL import Image, ImageFilter

from app.config import MAX_IMAGE_SIDE, MODEL_CONFIG
from app.services.stenosis import classify_severity, estimate_diameter_reduction

logger = logging.getLogger(__name__)

# Models are loaded lazily and cached for the lifetime of the process (Singleton).
_model_cache: dict = {}


def log_memory(stage: str) -> None:
    """Log current RSS so we can watch the free-tier budget (~512MB on Render)."""
    try:
        import psutil

        process = psutil.Process(os.getpid())
        rss_mb = process.memory_info().rss / (1024 * 1024)
        logger.info(f"[memory] {stage}: {rss_mb:.1f} MB RSS")
    except Exception as exc:
        logger.warning(f"Unable to log memory usage for {stage}: {exc}")


def preprocess_image_for_inference(image: Image.Image) -> Image.Image:
    """Downscale large inputs so inference stays fast and within memory budget."""
    if max(image.width, image.height) > MAX_IMAGE_SIDE:
        ratio = MAX_IMAGE_SIDE / max(image.width, image.height)
        new_size = (max(1, int(image.width * ratio)), max(1, int(image.height * ratio)))
        logger.info(
            f"Resizing input image from {image.width}x{image.height} to "
            f"{new_size[0]}x{new_size[1]} for inference"
        )
        return image.resize(new_size, Image.LANCZOS)
    return image


def ndarray_to_b64_png(arr: np.ndarray) -> str:
    """Convert an HxW or HxWx3 uint8 array to a base64-encoded PNG."""
    if arr.ndim == 2:
        pil = Image.fromarray(arr, mode="L")
    else:
        pil = Image.fromarray(arr.astype(np.uint8))
    buf = io.BytesIO()
    pil.save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode()


def get_model(model_name: str):
    """Load a YOLOv8-seg model from disk (cached after first load).

    Security note on torch.load: Ultralytics YOLO weights use pickle
    serialization, which requires ``weights_only=False``. We monkey-patch
    Ultralytics' ``torch_safe_load`` *only* because the weight files are
    trusted, version-controlled artifacts shipped with the app (never
    user-uploaded content), then restore the original loader.
    """
    if model_name not in _model_cache:
        import torch
        from ultralytics import YOLO
        from ultralytics.nn import tasks

        model_path = MODEL_CONFIG[model_name]
        if not os.path.exists(model_path):
            raise FileNotFoundError(
                f"Model weights not found: {model_path}. Place .pt files in backend/models/."
            )

        original_torch_safe_load = tasks.torch_safe_load
        tasks.torch_safe_load = lambda weight: (torch.load(weight, map_location="cpu", weights_only=False), weight)
        logger.info(f"Loading {model_name} from {model_path} ...")
        try:
            _model_cache[model_name] = YOLO(model_path)
        finally:
            tasks.torch_safe_load = original_torch_safe_load
        logger.info(f"{model_name} loaded OK.")
    return _model_cache[model_name]


def _generate_heatmap_overlay(img_array: np.ndarray, combined_mask: np.ndarray) -> str:
    """Build a green->yellow->red attention overlay base64 PNG from the mask."""
    h, w = combined_mask.shape
    mask_blur = np.array(
        Image.fromarray((combined_mask * 255).astype(np.uint8), mode="L")
        .filter(ImageFilter.GaussianBlur(radius=8))
    ).astype(np.float32) / 255.0
    mask_blur = np.clip(mask_blur, 0.0, 1.0)

    ys, xs = np.indices((h, w))
    total = np.sum(mask_blur)
    if total > 0:
        cy = np.sum(ys * mask_blur) / total
        cx = np.sum(xs * mask_blur) / total
        dist = np.sqrt((xs - cx) ** 2 + (ys - cy) ** 2)
        dist = dist / (np.max(dist[mask_blur > 0]) + 1e-8)
        dist_norm = np.clip(1.0 - dist, 0, 1)
        intensity = np.clip(mask_blur * 0.35 + dist_norm * 0.65, 0.0, 1.0)
    else:
        intensity = mask_blur

    alpha = np.clip(mask_blur * 0.9 + 0.2, 0.0, 1.0)

    red = np.clip(np.where(intensity >= 0.5, (intensity - 0.5) * 2.0, 0.0), 0, 1)
    green = np.clip(np.where(intensity <= 0.5, intensity * 2.0, (1.0 - intensity) * 2.0), 0, 1)
    blue = np.clip(np.where(intensity <= 0.5, 1.0 - intensity * 2.0, 0.0), 0, 1)
    heatmap = np.stack([red, green, blue], axis=-1) * 255

    overlay = np.clip(
        img_array * (1.0 - alpha[..., None]) + heatmap * alpha[..., None],
        0, 255,
    ).astype(np.uint8)
    return ndarray_to_b64_png(overlay)


def run_segmentation_inference(image: Image.Image, model_name: str) -> dict:
    """Run YOLOv8-seg inference and return a flat dict with all result fields."""
    image = preprocess_image_for_inference(image)
    img_array = np.array(image.convert("RGB"))
    model = get_model(model_name)

    log_memory("before forward pass")
    import torch

    with torch.inference_mode():
        results = model(img_array, conf=0.25, iou=0.45, device="cpu", verbose=False)
    log_memory("after forward pass")
    result = results[0]
    boxes = result.boxes

    if boxes is None or len(boxes) == 0:
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
            "processing_time": 0.0,
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
                mask_uint8 = (raw * 255).astype(np.uint8)
                if mh != h or mw != w:
                    mask_pil = Image.fromarray(mask_uint8, mode="L").resize((w, h), Image.NEAREST)
                    mask_uint8 = np.array(mask_pil)
                mask_b64 = ndarray_to_b64_png(mask_uint8)
                combined_mask = np.maximum(combined_mask, mask_uint8.astype(np.float32) / 255.0)
        except Exception as e:
            logger.warning(f"Mask extraction failed for detection {idx}: {e}")

        detections.append({
            "bbox": bbox,
            "confidence": conf,
            "severity": severity,
            "stenosis_percent": stenosis_pct,
            "mask_b64": mask_b64,
        })

    combined_mask = np.clip(combined_mask, 0.0, 1.0)
    combined_mask_b64 = None
    heatmap_b64 = None

    if np.any(combined_mask > 0):
        combined_mask_b64 = ndarray_to_b64_png((combined_mask * 255).astype(np.uint8))

    try:
        heatmap_b64 = _generate_heatmap_overlay(img_array, combined_mask)
    except Exception as e:
        logger.warning(f"Heatmap generation failed: {e}")

    best_idx = int(boxes.conf.argmax().item())
    primary = detections[best_idx]
    top_severity = max(detections, key=lambda d: d["stenosis_percent"])["severity"]
    top_percent = max(d["stenosis_percent"] for d in detections)

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
        "processing_time": 0.0,  # filled in by the endpoint
    }
