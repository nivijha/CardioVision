"""
CardioVision - FastAPI application factory.

Stenosis Detection AI: coronary artery stenosis detection and segmentation
using YOLOv8-seg. Routers/services/schemas live in the app/ package.
"""

import logging
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import DEFAULT_MODEL_NAME, INFERENCE_PROVIDER, build_cors_origins
from app.routers import chat, health, models, predict

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

os.makedirs("uploads", exist_ok=True)
os.makedirs("results", exist_ok=True)


@asynccontextmanager
async def lifespan(_: FastAPI):
    """Application lifespan.

    With INFERENCE_PROVIDER=modal the YOLO model is loaded on Modal, not
    here, so Render no longer initialises PyTorch or loads weights at boot.
    """
    logger.info("Application startup complete (inference_provider=%s)", INFERENCE_PROVIDER)
    yield


app = FastAPI(
    title="Stenosis Detection AI",
    description="AI-powered coronary artery stenosis detection and segmentation using YOLOv8-seg",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=build_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(predict.router)
app.include_router(models.router)
app.include_router(chat.router)


@app.get("/")
async def root():
    return {
        "message": "Stenosis Detection AI API",
        "version": "1.0.0",
        "active_model": DEFAULT_MODEL_NAME,
        "inference_provider": INFERENCE_PROVIDER,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
