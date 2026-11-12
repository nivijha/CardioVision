"""Health and availability endpoint."""

from fastapi import APIRouter

from app.config import INFERENCE_PROVIDER, MODAL_INFERENCE_TOKEN, MODAL_INFERENCE_URL

router = APIRouter()


@router.get("/api/health")
async def health_check():
    modal_configured = bool(MODAL_INFERENCE_URL and MODAL_INFERENCE_TOKEN)
    return {
        "status": "healthy",
        "inference_provider": INFERENCE_PROVIDER,
        "modal_configured": modal_configured,
        "models_available": {
            "YOLOv8s-seg": (INFERENCE_PROVIDER == "modal" and modal_configured)
            or INFERENCE_PROVIDER != "modal",
        },
    }
