# CardioVision — Modal Inference Deployment

This document describes migrating the YOLOv8s-seg inference workload from
Render Free to Modal, while keeping the React frontend on Vercel and the main
FastAPI backend on Render Free.

## Architecture

```
Vercel (frontend)
   |
   | POST https://cardiovision-bt72.onrender.com/api/predict
   v
Render Free (FastAPI backend)
   |  (authenticated server-to-server)
   | POST https://<modal-app>.modal.run/predict   (Authorization: Bearer <token>)
   v
Modal (CPU serverless, YOLOv8s-seg model loaded once per container)
```

- Frontend: unchanged, calls Render only.
- Render: unchanged public endpoint; no PyTorch/YOLO loaded locally; proxies inference to Modal.
- Modal: loads `YOLOv8s-seg-best.pt` once per container, runs CPU inference, returns the same JSON contract.

## Prerequisites

1. A Modal account: sign up at https://modal.com (free tier / Starter plan).
2. Install the Modal CLI:
   ```bash
   pip install modal
   ```
3. Authenticate (run interactively, opens a browser):
   ```bash
   modal token new
   ```
   Confirm authentication:
   ```bash
   modal token whoami
   ```

## Files

| File | Purpose |
|------|---------|
| `stenosis-detection/backend/modal_inference.py` | Modal-deployed FastAPI inference service (new) |
| `stenosis-detection/backend/modal_requirements.txt` | Dependency reference for local dev (new) |
| `stenosis-detection/backend/DEPLOYMENT_MODAL.md` | This document (new) |

Modified (Render side): `app/routers/predict.py`, `main.py`, `app/config.py`, `app/routers/health.py`, `app/routers/models.py`, `requirements.txt`, `render.yaml`, `.env.example`.

No trained model weights are modified or recommitted. `YOLOv8s-seg-best.pt` is already Git-tracked and packaged into the Modal image via `.add_local_file`.

## Step 1 — Deploy the Modal inference service (independently)

From `stenosis-detection/backend/`:

```bash
# Create the shared-secret token that Render will use to call Modal.
# Pick a strong random value; never commit it.
modal secret create cardio-vision-modal-token MODAL_INFERENCE_TOKEN=<your-shared-secret>

# Deploy the Modal app.
modal deploy modal_inference.py
```

`modal deploy` prints the deployed web endpoint, e.g.:

```
https://cardio-vision-inference-<hash>.modal.run
```

Record it as `MODAL_INFERENCE_URL`.

### Verify Modal directly (synthetic image only)

```bash
cd stenosis-detection/backend
python - <<'EOF'
import io, json, base64
from PIL import Image
import httpx

MODAL_URL = "https://<your-modal-endpoint>.modal.run/predict"
TOKEN = "<your-shared-secret>"

img = Image.new("RGB", (128, 128), (128, 128, 128))
buf = io.BytesIO(); img.save(buf, format="PNG"); buf.seek(0)

files = {"file": ("test.png", buf.getvalue(), "image/png")}
headers = {"Authorization": f"Bearer {TOKEN}"}

with httpx.Client(timeout=120.0) as client:
    r = client.post(MODAL_URL, files=files, params={"model_name": "YOLOv8s-seg"}, headers=headers)
    print("status:", r.status_code)
    print(json.dumps(r.json(), indent=2)[:2000])
EOF
```

Expected: HTTP 200 with `stenosis`, `confidence`, `mask_b64`, `heatmap_b64`, `detections`, `model_used`, `processing_time`.

### Modal cold-start measurement

The first request after scale-to-zero triggers container build + model load. Time it separately:

```python
import time
t0 = time.time()
r = client.post(...)   # first request
cold_start_s = time.time() - t0
print(f"Cold start: {cold_start_s:.1f}s")
```

Subsequent warm requests are much faster (model already loaded).

## Step 2 — Configure Render environment variables

In the Render dashboard (or `render.yaml`), set for the `cardiovision-backend` service:

| Variable | Value | Notes |
|----------|-------|-------|
| `INFERENCE_PROVIDER` | `modal` | Routes /api/predict to Modal |
| `MODAL_INFERENCE_URL` | `https://<your-modal-endpoint>.modal.run` | No trailing slash |
| `MODAL_INFERENCE_TOKEN` | `<same shared secret>` | `sync: false` (never exposed in repo) |
| `TORCH_NUM_THREADS` | `2` | Kept for compatibility (no longer loads torch locally) |
| `MAX_IMAGE_SIDE` | `640` | Unchanged |
| `YOLO_IMGSZ` | `640` | Unchanged |
| `MAX_UPLOAD_BYTES` | `8388608` | 8 MB cap |
| `MAX_CONCURRENT_INFERENCE` | `1` | Unchanged (Render no longer infers locally) |
| `CORS_ALLOWED_ORIGINS` | `https://cardio-vision-murex.vercel.app` | Unchanged |
| `GEMINI_API_KEY` | `<existing>` | `sync: false`, chat still works |

Example `render.yaml` additions:

```yaml
envVars:
  - key: INFERENCE_PROVIDER
    value: "modal"
  - key: MODAL_INFERENCE_URL
    value: "https://<your-modal-endpoint>.modal.run"
  - key: MODAL_INFERENCE_TOKEN
    sync: false
  - key: TORCH_NUM_THREADS
    value: "2"
  - key: MAX_IMAGE_SIDE
    value: "640"
  - key: YOLO_IMGSZ
    value: "640"
  - key: MAX_UPLOAD_BYTES
    value: "8388608"
  - key: MAX_CONCURRENT_INFERENCE
    value: "1"
  - key: CORS_ALLOWED_ORIGINS
    value: "https://cardio-vision-murex.vercel.app"
  - key: GEMINI_API_KEY
    sync: false
```

### `.env.example` (placeholders only, never real secrets)

```ini
# Inference provider: "local" (legacy) or "modal"
INFERENCE_PROVIDER=modal

# Modal inference endpoint (set in Render dashboard, never committed)
MODAL_INFERENCE_URL=https://<your-modal-endpoint>.modal.run

# Shared secret for Render -> Modal auth (set in Render dashboard, sync: false)
MODAL_INFERENCE_TOKEN=<shared-secret>
```

The existing `backend/.env` remains untouched and gitignored (it contains the Gemini key).

## Step 3 — Modify the Render backend

Apply the code changes (see "Modified files" below), then redeploy Render:

```bash
# Render redeploys automatically on push to main, or trigger a manual deploy
# in the Render dashboard.
```

Render's `pip install -r requirements.txt` will now install without torch/ultralytics, keeping the free tier under the memory budget.

## Step 4 — Test the full flow

```bash
# Backend tests (mock Modal where weights unavailable)
cd stenosis-detection/backend
pip install -r requirements-dev.txt
python -m pytest -q
ruff check .

# Frontend build
cd ../frontend
npm ci
npm run build
```

Then exercise the live Vercel → Render → Modal path by uploading an image at
https://cardio-vision-murex.vercel.app/predict and confirming results render.

## Step 5 — Compare predictions (old local vs Modal)

Before removing the legacy local inference, compare outputs on the same
representative images. Minor floating-point differences are acceptable;
stenosis percent, severity, bounding boxes, and mask/heatmap presence must
match.

## Cost monitoring (Modal Starter plan)

- CPU default, no GPU allocated.
- `min_containers=0`: containers scale to zero; you pay only for active
  inference plus cold-start time.
- `max_containers=1`: one concurrent inference at a time (start).
- Track per month: CPU seconds, memory GiB-seconds, startup time, inference
  time, request count. View in the Modal dashboard Usage page.
- Included credits are NOT unlimited. Estimate cost from measured usage:
  `cost ≈ (cpu_seconds * cpu_rate) + (gb_seconds * memory_rate)`.
- If approaching credits, raise `max_containers` only as needed, or reduce
  image size / batch uploads.

## Rollback

The legacy local inference implementation is preserved in
`app/services/yolo.py` (not deleted). To roll back:

1. Revert `app/routers/predict.py` to call `run_segmentation_inference` locally.
2. Restore `torch`, `torchvision`, `ultralytics`, `opencv-python-headless` in
   `requirements.txt`.
3. Restore model preload in `main.py` lifespan.
4. Redeploy Render.
5. (Optional) Remove `INFERENCE_PROVIDER=modal` to fall back to local.

Do not delete `backend/models/YOLOv8s-seg-best.pt` until the Modal flow is
verified in production.

## Security & privacy

- Render → Modal is authenticated with a server-side shared secret.
- The Modal token is never exposed to the React frontend (no `VITE_` variable).
- Uploaded images are not logged or persisted on Modal beyond the request.
- Use synthetic/anonymized images for testing unless you have authorization
  for real medical imagery.
- This system is not clinically validated.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| `modal: command not found` | CLI not installed | `pip install modal` |
| `Not authenticated` | `modal token new` not run | Run `modal token new` |
| 401 from Modal | Token mismatch | Ensure Render `MODAL_INFERENCE_TOKEN` == Modal secret |
| 503 from Render / Modal | Modal cold start / down | Render returns 503; retry after warm-up |
| Image too large (413) | Upload > 8 MB | Resize/compress before upload |
| Out of memory on Modal | `memory` too low | Raise `memory` in `@app.function` (e.g. 2048 MiB) |

## Modal CLI cheat sheet

```bash
pip install modal                # install CLI
modal token new                  # authenticate (browser)
modal token whoami               # confirm identity
modal deploy modal_inference.py  # deploy the inference app
modal secret create cardio-vision-modal-token MODAL_INFERENCE_TOKEN=<secret>
modal secret list                # list secrets
modal app list                   # list deployed apps
modal app logs <app-id>          # view logs
```
