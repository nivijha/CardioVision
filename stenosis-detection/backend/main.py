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
import cv2
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
    "YOLOv8s-seg": os.path.join(MODELS_DIR, "YOLOv8s-seg-best.pt"),
}

DEFAULT_MODEL_NAME = "YOLOv8s-seg"

# Model performance stats (used by /api/models/comparison)
MODEL_STATS = {
    "YOLOv8s-seg": {"map50": 0.801, "precision": 0.82, "recall": 0.76, "iou": 0.73, "params_millions": 11.8, "inference_time_ms": 28},
}

_model_cache: dict = {}


def get_model(model_name: str = DEFAULT_MODEL_NAME):
    """Load a YOLOv8-seg model from disk (cached after first load)."""
    if model_name not in _model_cache:
        from ultralytics import YOLO
        from ultralytics.nn import tasks
        import torch
        # Patch torch_safe_load to use weights_only=False since we trust the model
        original_torch_safe_load = tasks.torch_safe_load
        tasks.torch_safe_load = lambda weight: (torch.load(weight, map_location="cpu", weights_only=False), weight)
        model_path = MODEL_CONFIG[model_name]
        if not os.path.exists(model_path):
            raise FileNotFoundError(
                f"Model weights not found: {model_path}. "
                "Place .pt files in backend/models/."
            )
        logger.info(f"Loading {model_name} from {model_path} ...")
        loaded_model = YOLO(model_path)
        _model_cache[model_name] = loaded_model
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
    Run YOLOv8-seg once. Generate two mapping outputs: Box isolated (Detection) and Mask isolated (Segmentation).
    """
    img_array = np.array(image.convert("RGB"))
    
    # 1. Unified Single Inference Pipeline
    model = get_model(model_name)
    results = model(img_array, conf=0.25, iou=0.45, verbose=False)
    result = results[0]
    boxes = result.boxes

    # Generate Object Detection overlay natively (Boxes only)
    try:
        det_plot_bgr = result.plot(masks=False)
    except TypeError:
        det_plot_bgr = result.plot()
    detection_b64 = ndarray_to_b64_png(det_plot_bgr[..., ::-1])

    # Generate Segmentation overlay natively (Masks only)
    try:
        seg_plot_bgr = result.plot(boxes=False)
    except TypeError:
        seg_plot_bgr = result.plot()
    segmentation_b64 = ndarray_to_b64_png(seg_plot_bgr[..., ::-1])

    if boxes is None or len(boxes) == 0:
        return {
            "stenosis": False,
            "confidence": 0.0,
            "severity": "none",
            "stenosis_percent": 0.0,
            "bbox": [0.0, 0.0, 0.0, 0.0],
            "detection_b64": detection_b64,
            "segmentation_b64": segmentation_b64,
            "detections": [],
            "model_used": "YOLOv8s-det + YOLOv8s-seg",
            "processing_time": 0.0,
        }

    detections = []
    for idx, box in enumerate(boxes):
        x1, y1, x2, y2 = [round(float(v), 1) for v in box.xyxy[0].tolist()]
        conf = round(float(box.conf[0].item()), 3)
        bbox = [x1, y1, x2, y2]
        stenosis_pct = estimate_diameter_reduction(bbox, img_array.shape)
        severity = classify_severity(stenosis_pct)

        detections.append({
            "bbox": bbox,
            "confidence": conf,
            "severity": severity,
            "stenosis_percent": stenosis_pct,
        })

    best_idx = int(boxes.conf.argmax().item())
    primary = detections[best_idx]
    top_severity: str = max(detections, key=lambda d: d["stenosis_percent"])["severity"]
    top_percent = max(d["stenosis_percent"] for d in detections)

    return {
        "stenosis": True,
        "confidence": primary["confidence"],
        "severity": top_severity,
        "stenosis_percent": top_percent,
        "bbox": primary["bbox"],
        "detection_b64": detection_b64,
        "segmentation_b64": segmentation_b64,
        "detections": detections,
        "model_used": model_name,
        "processing_time": 0.0,
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
        raise HTTPException(status_code=500, detail=f"Inference error: {e}\n\n{tb}")

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
