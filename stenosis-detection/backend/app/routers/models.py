"""Model benchmark comparison endpoint."""

import os

from fastapi import APIRouter

from app.config import MODEL_CONFIG, MODEL_STATS

router = APIRouter()


@router.get("/api/models/comparison")
async def get_model_comparison():
    """Return performance metrics for all segmentation models."""
    seg_models = []
    for name, stats in MODEL_STATS.items():
        seg_models.append({
            "name": name,
            "map50": stats["map50"],
            "precision": stats["precision"],
            "recall": stats["recall"],
            "iou": stats["iou"],
            "params_millions": stats["params_millions"],
            "inference_time_ms": stats["inference_time_ms"],
            "available": os.path.exists(MODEL_CONFIG[name]),
        })
    return {
        "detection_models": [],  # Coming soon
        "segmentation_models": seg_models,
    }
