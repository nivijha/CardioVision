"""Central configuration for the CardioVision backend.

Environment variables are read once here so the rest of the app can import
plain values instead of calling os.getenv everywhere.
"""

import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

BACKEND_DIR = Path(__file__).resolve().parent.parent
MODELS_DIR = os.path.join(str(BACKEND_DIR), "models")

DEFAULT_MODEL_NAME = os.getenv("DEFAULT_MODEL", "YOLOv8s-seg")
MAX_IMAGE_SIDE = int(os.getenv("MAX_IMAGE_SIDE", "1024"))
TORCH_NUM_THREADS = int(os.getenv("TORCH_NUM_THREADS", "2"))

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

# Models served by the app. Only the weights that are committed will be marked
# available by /api/health.
MODEL_CONFIG = {
    "YOLOv8n-seg": os.path.join(MODELS_DIR, "YOLOv8n-seg-best.pt"),
    "YOLOv8s-seg": os.path.join(MODELS_DIR, "YOLOv8s-seg-best.pt"),
    "YOLOv8m-seg": os.path.join(MODELS_DIR, "YOLOv8m-seg-best.pt"),
}

# Performance stats served by /api/models/comparison. These are the values used
# across the site; keep provenance tracked in METRICS.md.
MODEL_STATS = {
    "YOLOv8n-seg": {"map50": 0.758, "precision": 0.78, "recall": 0.71, "iou": 0.68, "params_millions": 3.2, "inference_time_ms": 15},
    "YOLOv8s-seg": {"map50": 0.801, "precision": 0.82, "recall": 0.76, "iou": 0.73, "params_millions": 11.8, "inference_time_ms": 28},
    "YOLOv8m-seg": {"map50": 0.849, "precision": 0.87, "recall": 0.82, "iou": 0.79, "params_millions": 27.3, "inference_time_ms": 52},
}

DEFAULT_CORS_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://cardio-vision-murex.vercel.app",
]


def build_cors_origins() -> list[str]:
    """Default origins plus any set via CORS_ALLOWED_ORIGINS (comma-separated)."""
    origins = DEFAULT_CORS_ORIGINS.copy()
    extra = os.getenv("CORS_ALLOWED_ORIGINS", "")
    if extra:
        origins.extend(o.strip() for o in extra.split(",") if o.strip())
    return list(dict.fromkeys(origins))
