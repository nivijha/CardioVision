"""Health and availability endpoint."""

import os

from fastapi import APIRouter

from app.config import MODEL_CONFIG

router = APIRouter()


@router.get("/api/health")
async def health_check():
    statuses = {name: os.path.exists(path) for name, path in MODEL_CONFIG.items()}
    return {"status": "healthy", "models_available": statuses}
