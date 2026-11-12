"""API integration tests for the FastAPI endpoints.

Tests that need the full YOLO stack (torch/ultralytics) are skipped when the
dependencies or model weights are missing, so `pytest tests/` still runs fast
and green in a bare dev environment.
"""

import io
import os
import threading
import time

import numpy as np
import pytest
from PIL import Image

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


class FakeScalar:
    def __init__(self, value):
        self._v = float(value)

    def item(self):
        return self._v


class FakeList:
    def __init__(self, values):
        self._v = [float(v) for v in values]

    def tolist(self):
        return self._v


class FakeBox:
    def __init__(self, xyxy, conf):
        self.xyxy = [FakeList(xyxy)]
        self.conf = [FakeScalar(conf)]


class FakeBoxes:
    def __init__(self, boxes):
        self._boxes = boxes
        self.conf = np.array([b.conf[0]._v for b in boxes], dtype=np.float32)

    def __len__(self):
        return len(self._boxes)

    def __bool__(self):
        return len(self._boxes) > 0

    def __iter__(self):
        return iter(self._boxes)


class FakeResult:
    def __init__(self, boxes, masks=None):
        self.boxes = boxes
        self.masks = masks


class FakeModel:
    def __call__(self, img_array, conf, iou, device, verbose, imgsz):
        return [FakeResult(FakeBoxes([FakeBox([10.0, 10.0, 50.0, 50.0], 0.9)]), None)]


@pytest.mark.skipif(not HAS_FASTAPI, reason="FastAPI stack not installed")
def test_concurrent_predictions_are_serialized(monkeypatch):
    """Concurrent inference calls must serialize under the semaphore and never
    overwrite each other's results."""
    import app.services.yolo as yolo_module

    max_concurrent = 0
    current = 0
    lock = threading.Lock()

    class CountingModel(FakeModel):
        def __call__(self, img_array, conf, iou, device, verbose, imgsz):
            nonlocal max_concurrent, current
            with lock:
                current += 1
                max_concurrent = max(max_concurrent, current)
            time.sleep(0.05)
            with lock:
                current -= 1
            return super().__call__(img_array, conf, iou, device, verbose, imgsz)

    monkeypatch.setattr(
        yolo_module, "get_model", lambda model_name: CountingModel()
    )

    image = Image.new("RGB", (128, 128), (128, 128, 128))
    results = []
    errors = []

    def worker(_idx):
        try:
            results.append(yolo_module.run_segmentation_inference(image, "YOLOv8s-seg"))
        except Exception as exc:  # noqa: BLE001
            errors.append(exc)

    threads = [threading.Thread(target=worker, args=(i,)) for i in range(5)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()

    assert not errors, errors
    assert len(results) == 5
    assert max_concurrent == 1, f"expected serialized inference, got max_concurrent={max_concurrent}"
    for result in results:
        assert result["stenosis"] is True
        assert result["model_used"] == "YOLOv8s-seg"
        assert len(result["detections"]) == 1
