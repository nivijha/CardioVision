"""
Stenosis Detection AI Backend
FastAPI server for coronary artery stenosis detection and segmentation using YOLOv8-seg
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
from PIL import Image, ImageFilter
import io
import base64
import os
import asyncio
import time
import traceback
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Stenosis Detection AI",
    description="AI-powered coronary artery stenosis detection and segmentation using YOLOv8-seg",
    version="1.0.0"
)

# CORS configuration — allow all origins during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)
os.makedirs("results", exist_ok=True)

# ---------------------------------------------------------------------------
# Model registry
# ---------------------------------------------------------------------------
MODELS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models")

MODEL_CONFIG = {
    "YOLOv8n-seg": os.path.join(MODELS_DIR, "YOLOv8n-seg-best.pt"),
    "YOLOv8s-seg": os.path.join(MODELS_DIR, "YOLOv8s-seg-best.pt"),
    "YOLOv8m-seg": os.path.join(MODELS_DIR, "YOLOv8m-seg-best.pt"),
}

DEFAULT_MODEL_NAME = "YOLOv8s-seg"

# Model performance stats (used by /api/models/comparison)
MODEL_STATS = {
    "YOLOv8n-seg": {"map50": 0.758, "precision": 0.78, "recall": 0.71, "iou": 0.68, "params_millions": 3.2,  "inference_time_ms": 15},
    "YOLOv8s-seg": {"map50": 0.801, "precision": 0.82, "recall": 0.76, "iou": 0.73, "params_millions": 11.8, "inference_time_ms": 28},
    "YOLOv8m-seg": {"map50": 0.849, "precision": 0.87, "recall": 0.82, "iou": 0.79, "params_millions": 27.3, "inference_time_ms": 52},
}

_model_cache: dict = {}


def get_model(model_name: str = DEFAULT_MODEL_NAME):
    """Load a YOLOv8-seg model from disk (cached after first load)."""
    if model_name not in _model_cache:
        from ultralytics import YOLO
        from ultralytics.nn import tasks
        import torch
        # Ultralytics requires weights_only=False for loading model weights.
        # We trust the pre-trained model files, so we override the default safe loading.
        original_torch_safe_load = tasks.torch_safe_load
        tasks.torch_safe_load = lambda weight: (torch.load(weight, map_location="cpu", weights_only=False), weight)
        model_path = MODEL_CONFIG[model_name]
        if not os.path.exists(model_path):
            raise FileNotFoundError(
                f"Model weights not found: {model_path}. "
                "Place .pt files in backend/models/."
            )
        logger.info(f"Loading {model_name} from {model_path} ...")
        _model_cache[model_name] = YOLO(model_path)
        # Restore original (optional, since cached)
        tasks.torch_safe_load = original_torch_safe_load
        logger.info(f"{model_name} loaded OK.")
    return _model_cache[model_name]


# ---------------------------------------------------------------------------
# Severity helpers
# ---------------------------------------------------------------------------

def estimate_diameter_reduction(bbox: List[float], img_shape: tuple) -> float:
    """Estimate % stenosis from bounding box short-axis / long-axis ratio."""
    x1, y1, x2, y2 = bbox
    box_w = max(x2 - x1, 1)
    box_h = max(y2 - y1, 1)
    short_axis = min(box_w, box_h)
    long_axis  = max(box_w, box_h)
    raw = 1.0 - (short_axis / long_axis)          # 0 = round box, 1 = very narrow
    percent = 20.0 + raw * 75.0                   # maps to [20, 95]
    return round(float(np.clip(percent, 20.0, 95.0)), 1)


def classify_severity(pct: float) -> str:
    if pct < 25:  return "minimal"
    if pct < 50:  return "mild"
    if pct < 70:  return "moderate"
    if pct < 90:  return "severe"
    return "occlusion"


# ---------------------------------------------------------------------------
# Inference
# ---------------------------------------------------------------------------

def ndarray_to_b64_png(arr: np.ndarray) -> str:
    """Convert an H×W or H×W×3 uint8 numpy array to a base64-encoded PNG."""
    if arr.ndim == 2:
        pil = Image.fromarray(arr, mode="L")
    else:
        pil = Image.fromarray(arr.astype(np.uint8))
    buf = io.BytesIO()
    pil.save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode()


def run_segmentation_inference(image: Image.Image, model_name: str) -> dict:
    """
    Run YOLOv8-seg inference and return a flat dict with all result fields.
    All image data is returned as base64 PNG strings.
    """
    img_array = np.array(image.convert("RGB"))
    model = get_model(model_name)

    results = model(img_array, conf=0.25, iou=0.45, verbose=False)
    result  = results[0]
    boxes   = result.boxes

    if boxes is None or len(boxes) == 0:
        return {
            "stenosis":        False,
            "confidence":      0.0,
            "severity":        "none",
            "stenosis_percent": 0.0,
            "bbox":            [0.0, 0.0, 0.0, 0.0],
            "mask_b64":        None,
            "heatmap_b64":     None,
            "detections":      [],
            "model_used":      model_name,
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
                    mask_pil = Image.fromarray(mask_uint8, mode="L").resize(
                        (w, h), Image.NEAREST
                    )
                    mask_uint8 = np.array(mask_pil)
                mask_b64 = ndarray_to_b64_png(mask_uint8)
                combined_mask = np.maximum(combined_mask, mask_uint8.astype(np.float32) / 255.0)
        except Exception as e:
            logger.warning(f"Mask extraction failed for detection {idx}: {e}")

        detections.append({
            "bbox":            bbox,
            "confidence":      conf,
            "severity":        severity,
            "stenosis_percent": stenosis_pct,
            "mask_b64":        mask_b64,
        })

    combined_mask = np.clip(combined_mask, 0.0, 1.0)
    combined_mask_b64 = None
    heatmap_b64 = None

    if np.any(combined_mask > 0):
        combined_mask_b64 = ndarray_to_b64_png((combined_mask * 255).astype(np.uint8))

    try:
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
        green = np.clip(np.where(
            intensity <= 0.5,
            intensity * 2.0,
            (1.0 - intensity) * 2.0
        ), 0, 1)
        blue = np.clip(np.where(intensity <= 0.5, 1.0 - intensity * 2.0, 0.0), 0, 1)
        heatmap = np.stack([red, green, blue], axis=-1) * 255

        overlay = np.clip(
            img_array * (1.0 - alpha[..., None]) + heatmap * alpha[..., None],
            0, 255,
        ).astype(np.uint8)
        heatmap_b64 = ndarray_to_b64_png(overlay)
    except Exception as e:
        logger.warning(f"Heatmap generation failed: {e}")

    best_idx = int(boxes.conf.argmax().item())
    primary = detections[best_idx]
    top_severity = max(detections, key=lambda d: d["stenosis_percent"])["severity"]
    top_percent = max(d["stenosis_percent"] for d in detections)

    return {
        "stenosis":        True,
        "confidence":      primary["confidence"],
        "severity":        top_severity,
        "stenosis_percent": top_percent,
        "bbox":            primary["bbox"],
        "mask_b64":        combined_mask_b64,
        "heatmap_b64":     heatmap_b64,
        "detections":      detections,
        "model_used":      model_name,
        "processing_time": 0.0,   # filled in by the endpoint
    }


# ---------------------------------------------------------------------------
# API endpoints
# ---------------------------------------------------------------------------

@app.get("/")
async def root():
    return {
        "message": "Stenosis Detection AI API",
        "version": "1.0.0",
        "active_model": DEFAULT_MODEL_NAME,
    }


@app.get("/health")
async def health_check():
    statuses = {name: os.path.exists(path) for name, path in MODEL_CONFIG.items()}
    return {"status": "healthy", "models_available": statuses}


@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    model_name: str = DEFAULT_MODEL_NAME,
):
    """
    Upload an angiography image → get detection + segmentation results.

    Optional query param:
      model_name: YOLOv8n-seg | YOLOv8s-seg | YOLOv8m-seg  (default: YOLOv8m-seg)
    """
    if model_name not in MODEL_CONFIG:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown model '{model_name}'. Choose from: {list(MODEL_CONFIG.keys())}"
        )

    # Read & validate image
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image: {e}")

    # Run inference
    t0 = time.time()
    try:
        result = await asyncio.to_thread(run_segmentation_inference, image, model_name)
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        tb = traceback.format_exc()
        logger.error(f"Inference error:\n{tb}")
        # In production, remove traceback from client response for security
        detail = f"Inference error: {str(e)}"
        raise HTTPException(status_code=500, detail=detail)

    result["processing_time"] = round(time.time() - t0, 3)
    return result


@app.get("/api/models/comparison")
async def get_model_comparison():
    """Return performance metrics for all segmentation models."""
    seg_models = []
    for name, stats in MODEL_STATS.items():
        seg_models.append({
            "name":               name,
            "map50":              stats["map50"],
            "precision":          stats["precision"],
            "recall":             stats["recall"],
            "iou":                stats["iou"],
            "params_millions":    stats["params_millions"],
            "inference_time_ms":  stats["inference_time_ms"],
            "available":          os.path.exists(MODEL_CONFIG[name]),
        })
    return {
        "detection_models":     [],   # Coming soon
        "segmentation_models":  seg_models,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
