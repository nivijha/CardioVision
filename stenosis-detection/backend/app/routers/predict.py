"""Prediction endpoint: upload an angiography image, get detections.

When ``INFERENCE_PROVIDER=modal`` the image is forwarded to the
Modal-deployed YOLO inference service (authenticated server-to-server).
Otherwise the legacy local inference path is used (kept for rollback /
local development).
"""

import asyncio
import io
import logging
import time
import traceback

import httpx
from fastapi import APIRouter, File, HTTPException, UploadFile
from PIL import Image

from app.config import (
    DEFAULT_MODEL_NAME,
    INFERENCE_PROVIDER,
    MAX_UPLOAD_BYTES,
    MODAL_CONNECT_TIMEOUT,
    MODAL_INFERENCE_TOKEN,
    MODAL_INFERENCE_URL,
    MODAL_READ_TIMEOUT,
    MODEL_CONFIG,
)
from app.services.yolo import log_memory, run_segmentation_inference

logger = logging.getLogger(__name__)
router = APIRouter()


async def _forward_to_modal(contents: bytes, model_name: str) -> dict:
    """Forward an image upload to the Modal inference service.

    Returns the JSON body returned by Modal (already in the StenosisResult
    contract). Raises HTTPException on transport/auth/provider errors.
    """
    if not MODAL_INFERENCE_URL:
        raise HTTPException(
            status_code=503,
            detail="Inference provider URL is not configured.",
        )
    if not MODAL_INFERENCE_TOKEN:
        raise HTTPException(
            status_code=503,
            detail="Inference provider authentication is not configured.",
        )

    headers = {"Authorization": f"Bearer {MODAL_INFERENCE_TOKEN}"}
    files = {"file": ("image.png", contents, "image/png")}

    timeout = httpx.Timeout(
        connect=MODAL_CONNECT_TIMEOUT,
        read=MODAL_READ_TIMEOUT,
        write=MODAL_READ_TIMEOUT,
        pool=MODAL_CONNECT_TIMEOUT,
    )

    try:
        async with httpx.AsyncClient(timeout=timeout, follow_redirects=True) as client:
            resp = await client.post(
                f"{MODAL_INFERENCE_URL}/predict",
                files=files,
                params={"model_name": model_name},
                headers=headers,
            )
    except httpx.ConnectError as exc:
        logger.error("Modal connection error: %s", exc)
        raise HTTPException(
            status_code=503,
            detail="Inference service is unreachable. Please retry.",
        )
    except httpx.TimeoutException as exc:
        logger.error("Modal timeout: %s", exc)
        raise HTTPException(
            status_code=503,
            detail="Inference service timed out. Please retry.",
        )
    except httpx.HTTPError as exc:
        logger.error("Modal HTTP error: %s", exc)
        raise HTTPException(
            status_code=503,
            detail="Inference service returned an error.",
        )

    if resp.status_code == 401:
        logger.error("Modal rejected authentication token")
        raise HTTPException(
            status_code=503,
            detail="Inference service authentication failed.",
        )
    if resp.status_code == 413:
        raise HTTPException(
            status_code=413,
            detail=resp.json().get("detail", "Image too large."),
        )
    if resp.status_code == 400:
        raise HTTPException(
            status_code=400,
            detail=resp.json().get("detail", "Invalid image."),
        )
    if resp.status_code >= 500:
        logger.error("Modal upstream error: %s %s", resp.status_code, resp.text[:500])
        raise HTTPException(
            status_code=503,
            detail="Inference service is temporarily unavailable. Please retry.",
        )

    try:
        return resp.json()
    except ValueError:
        logger.error("Modal returned non-JSON: %s", resp.text[:500])
        raise HTTPException(
            status_code=503,
            detail="Inference service returned an invalid response.",
        )


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
        # Bounded read: cap at MAX_UPLOAD_BYTES + 1 so we never buffer an
        # unbounded upload before checking its size.
        contents = await file.read(MAX_UPLOAD_BYTES + 1)
        if len(contents) > MAX_UPLOAD_BYTES:
            raise HTTPException(
                status_code=413,
                detail=f"Image too large. Maximum size is {MAX_UPLOAD_BYTES // (1024 * 1024)} MB.",
            )
        image = Image.open(io.BytesIO(contents)).convert("RGB")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image: {e}")

    # --- Modal inference path -------------------------------------------
    if INFERENCE_PROVIDER == "modal":
        try:
            result = await _forward_to_modal(contents, model_name)
        except HTTPException:
            raise
        except Exception as exc:
            logger.error("Modal inference error:\n%s", traceback.format_exc())
            raise HTTPException(
                status_code=503,
                detail=f"Inference error: {str(exc)}",
            )
        # Modal already includes processing_time; preserve it.
        result.setdefault("processing_time", round(time.time() - 0, 3))
        log_memory("after modal inference request")
        return result

    # --- Legacy local inference path (rollback / local dev) -------------
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
