"""Model benchmark comparison endpoint."""

from fastapi import APIRouter

from app.config import (
    INFERENCE_PROVIDER,
    MODAL_INFERENCE_TOKEN,
    MODAL_INFERENCE_URL,
    MODEL_STATS,
)

router = APIRouter()


@router.get("/api/models/comparison")
async def get_model_comparison():
    """Return performance metrics for all segmentation models.

    Model availability is reported based on whether the configured inference
    provider can serve the model, not on local weight-file presence (the
    weights live on Modal when INFERENCE_PROVIDER=modal).
    """
    modal_ready = INFERENCE_PROVIDER == "modal" and bool(
        MODAL_INFERENCE_URL and MODAL_INFERENCE_TOKEN
    )
    seg_models = []
    for name, stats in MODEL_STATS.items():
        # Only YOLOv8s-seg weights are packaged on Modal today.
        available = modal_ready and name == "YOLOv8s-seg"
        seg_models.append({
            "name": name,
            "map50": stats["map50"],
            "precision": stats["precision"],
            "recall": stats["recall"],
            "iou": stats["iou"],
            "params_millions": stats["params_millions"],
            "inference_time_ms": stats["inference_time_ms"],
            "available": available,
        })
    return {
        "detection_models": [],  # Coming soon
        "segmentation_models": seg_models,
    }
