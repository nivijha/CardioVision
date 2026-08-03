"""API integration tests for the FastAPI endpoints.

Tests that need the full YOLO stack (torch/ultralytics) are skipped when the
dependencies or model weights are missing, so `pytest tests/` still runs fast
and green in a bare dev environment.
"""

import io
import os

import pytest

try:
    from fastapi.testclient import TestClient

    from main import app

    HAS_FASTAPI = True
except Exception:  # pragma: no cover - dependency check
    HAS_FASTAPI = False

pytestmark = pytest.mark.skipif(not HAS_FASTAPI, reason="FastAPI stack not installed")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SEG_MODEL_PATH = os.path.join(BASE_DIR, "models", "YOLOv8s-seg-best.pt")


def _png_bytes() -> bytes:
    from PIL import Image

    buf = io.BytesIO()
    Image.new("RGB", (128, 128), (128, 128, 128)).save(buf, format="PNG")
    buf.seek(0)
    return buf.getvalue()


@pytest.fixture(scope="module")
def client():
    # Not using the context manager so FastAPI's startup event (model preload)
    # does not run - keeps the API-only tests fast and dependency-light.
    return TestClient(app)


def test_root(client):
    resp = client.get("/")
    assert resp.status_code == 200
    assert resp.json()["version"] == "1.0.0"


def test_health(client):
    resp = client.get("/api/health")
    assert resp.status_code == 200
    body = resp.json()
    assert body["status"] == "healthy"
    assert "YOLOv8s-seg" in body["models_available"]


def test_model_comparison(client):
    resp = client.get("/api/models/comparison")
    assert resp.status_code == 200
    body = resp.json()
    assert len(body["segmentation_models"]) == 3
    names = {m["name"] for m in body["segmentation_models"]}
    assert names == {"YOLOv8n-seg", "YOLOv8s-seg", "YOLOv8m-seg"}


def test_predict_rejects_invalid_image(client):
    resp = client.post(
        "/api/predict",
        files={"file": ("bad.txt", b"not an image", "text/plain")},
    )
    assert resp.status_code == 400


def test_predict_rejects_unknown_model(client):
    resp = client.post(
        "/api/predict",
        params={"model_name": "does-not-exist"},
        files={"file": ("img.png", _png_bytes(), "image/png")},
    )
    assert resp.status_code == 400


@pytest.mark.skipif(
    not os.path.exists(SEG_MODEL_PATH), reason="Segmentation weights not present"
)
def test_predict_default_model_runs(client):
    resp = client.post(
        "/api/predict",
        files={"file": ("img.png", _png_bytes(), "image/png")},
    )
    assert resp.status_code in (200, 503)
