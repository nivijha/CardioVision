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

from app.config import DEFAULT_MODEL_NAME, TORCH_NUM_THREADS, build_cors_origins
from app.routers import chat, health, models, predict

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

os.makedirs("uploads", exist_ok=True)
os.makedirs("results", exist_ok=True)


@asynccontextmanager
async def lifespan(_: FastAPI):
    """Configure torch threads and preload the default model on boot."""
    os.environ.setdefault("OMP_NUM_THREADS", str(TORCH_NUM_THREADS))
    os.environ.setdefault("MKL_NUM_THREADS", str(TORCH_NUM_THREADS))
    try:
        import torch

        torch.set_num_threads(TORCH_NUM_THREADS)
        torch.set_num_interop_threads(TORCH_NUM_THREADS)
        logger.info(f"Configured torch to use {TORCH_NUM_THREADS} thread(s)")
    except Exception as exc:
        logger.warning(f"Unable to configure torch threads: {exc}")

    from app.services.yolo import get_model, log_memory

    log_memory("startup before model load")
    try:
        get_model(DEFAULT_MODEL_NAME)
        log_memory("startup after model load")
    except Exception as exc:
        logger.error(f"Model preload failed: {exc}")
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
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
