"""Prediction endpoint: upload an angiography image, get detections."""

import asyncio
import io
import logging
import time
import traceback

from fastapi import APIRouter, File, HTTPException, UploadFile
from PIL import Image

from app.config import DEFAULT_MODEL_NAME, MODEL_CONFIG
from app.services.yolo import log_memory, run_segmentation_inference

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/api/predict")
async def predict(
    file: UploadFile = File(...),
    model_name: str = DEFAULT_MODEL_NAME,
):
    """Upload an angiography image to get detection + segmentation results.

    Optional query param:
      model_name: YOLOv8n-seg | YOLOv8s-seg | YOLOv8m-seg (default: YOLOv8s-seg)
    """
    if model_name not in MODEL_CONFIG:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown model '{model_name}'. Choose from: {list(MODEL_CONFIG.keys())}",
        )

    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image: {e}")

    t0 = time.time()
    try:
        result = await asyncio.to_thread(run_segmentation_inference, image, model_name)
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        tb = traceback.format_exc()
        logger.error(f"Inference error:\n{tb}")
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")

    result["processing_time"] = round(time.time() - t0, 3)
    log_memory("after inference request")
    return result
