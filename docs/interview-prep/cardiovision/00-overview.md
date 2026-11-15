# CardioVision — Repository Overview

> Inspected repository: `nivijha/CardioVision`, default branch `main`. This is a map of committed source, not a claim about uncommitted local changes or current production state.

## 1. Purpose and actual system shape

CardioVision is a React single-page application backed by FastAPI. A user uploads a coronary angiography image; the browser sends it to `POST /api/predict`. The Render FastAPI app is configured to forward the multipart image to a Modal-hosted inference service. Modal runs YOLOv8 segmentation and returns detections, masks, a heatmap overlay, a geometric stenosis estimate, and severity labels. A separate Gemini-powered endpoint accepts chat history and current severity context.

**Clinical boundary:** the repository explicitly calls this an academic/research project and says it is not for direct clinical inference (`README.md`, `frontend/src/pages/About.jsx`, `backend/DEPLOYMENT_MODAL.md`). The percentage calculation is a bounding-box aspect-ratio heuristic, not a validated measurement of coronary lumen diameter (`backend/app/services/stenosis.py::estimate_diameter_reduction`).

## 2. High-level architecture

```text
Browser — React 18 / React Router / Vite SPA
  Predict.jsx / Results.jsx / Research.jsx / Home.jsx / About.jsx
       | Axios REST (multipart upload for prediction)
       v
Vercel static frontend
       | HTTPS /api/*
       v
Render FastAPI backend (backend/main.py)
  CORS; GET /; GET /api/health; POST /api/predict;
  GET /api/models/comparison; POST /api/health-chat
       | authenticated HTTPX multipart POST when INFERENCE_PROVIDER=modal
       v
Modal ASGI inference (backend/modal_inference.py)
  bearer token -> model allow-list -> bounded upload -> cached YOLOv8s-seg
  -> boxes/masks -> geometric estimate/severity -> heatmap -> JSON
       |
       v
Frontend renders numeric outputs and Base64 overlays

Chat is separate:
Predict.jsx -> POST /api/health-chat -> FastAPI chat router
  -> google-generativeai SDK -> Gemini model -> response.text
```

The legacy local YOLO path remains in `backend/app/services/yolo.py` and is selected only when `INFERENCE_PROVIDER != "modal"`. `render.yaml` currently sets `INFERENCE_PROVIDER=modal`.

**Not found in tracked code:** database/ORM, Redis, OAuth/JWT/user login, persistent report store, object storage, and background task queue. Prediction results are returned in the response and held in React state.

## 3. Tech stack and dependencies

### Backend runtime (`backend/requirements.txt`)

| Dependency | Declared version | Purpose in code |
|---|---:|---|
| fastapi | 0.115.0 | ASGI app, routers, uploads and HTTP errors (`main.py`, `app/routers/*`) |
| uvicorn[standard] | 0.30.1 | Runs FastAPI (`main.py`, Render config, Docker CMD) |
| python-multipart | 0.0.9 | Parses multipart image uploads (`predict.py`) |
| httpx | 0.28.1 | Async Render-to-Modal proxy (`predict.py::_forward_to_modal`); used with API tests |
| pillow | 10.4.0 | Image open/convert/resize and mask/overlay PNG encoding (`predict.py`, `services/yolo.py`) |
| numpy | 1.26.4 | Image/mask arrays, combination and heatmap calculations (`services/yolo.py`) |
| psutil | >=5.9.0 | Best-effort RSS memory telemetry (`services/yolo.py::log_memory`) |
| aiofiles | 24.1.0 | Declared, but direct use was **NOT FOUND / UNCLEAR** in inspected imports/flows |
| pydantic | 2.8.2 | Schema declarations (`app/schemas.py`) |
| google-generativeai | unpinned | Gemini SDK in `app/routers/chat.py::health_chat` |
| python-dotenv | unpinned | Loads `.env` in `app/config.py` |

Production `requirements.txt` deliberately omits torch, torchvision, Ultralytics and OpenCV; its comment says ML dependencies moved to Modal. The legacy local inference implementation dynamically imports torch and ultralytics, so local rollback requires installing them.

### Modal inference dependencies (`backend/modal_requirements.txt` and inline Modal image)

| Dependency | Declared version | Purpose |
|---|---:|---|
| modal | 1.3.5 | Modal app/image/secret/function/ASGI deployment (`modal_inference.py`) |
| fastapi | 0.115.0 | Modal internal `/health` and `/predict` |
| python-multipart | 0.0.9 | Multipart upload parsing |
| pillow | 10.4.0 | Image operations |
| numpy | 1.26.4 | Array/mask operations |
| psutil | >=5.9.0 | RSS telemetry |
| python-dotenv | unpinned | Included in declared stack; direct module use unclear |
| ultralytics | 8.2.50 | YOLO model load and inference |
| opencv-python-headless | >=4.10.0 | Installed in headless image; direct calls not evident in inference code |
| torch | >=2.0.0 | CPU tensor runtime, `inference_mode`, thread configuration |
| torchvision | >=0.15.0 | Installed with torch; no direct call evident in module |

`modal_inference.py::MODAL_IMAGE` also installs OS packages: `libgomp1`, `libgl1`, `libglib2.0-0`, `libsm6`, `libxext6`, `libxrender1`, `libfontconfig1`, `libice6`.

### Frontend dependencies (`frontend/package.json`)

| Dependency | Declared version | Purpose in code |
|---|---:|---|
| react | ^18.3.1 | Component model and state/hooks |
| react-dom | ^18.3.1 | Mounts React in `src/main.jsx` |
| react-router-dom | ^6.24.0 | BrowserRouter, routes, links, outlet, current location |
| recharts | ^2.12.7 | Charts in `pages/ModelComparison.jsx` |
| framer-motion | ^11.2.10 | Page/banner/research/metrics animations |
| axios | ^1.7.2 | REST calls in `utils/api.js` and `pages/Predict.jsx` |
| react-dropzone | ^14.2.3 | Drag/drop upload selection in `pages/Predict.jsx` |
| lucide-react | ^0.395.0 | Icons in Banner, ModelComparison and Research |

Frontend dev dependencies: `@types/react ^18.3.3`, `@types/react-dom ^18.3.0` (types); `@vitejs/plugin-react ^4.3.1` (React plugin); `autoprefixer ^10.4.19` (vendor prefixes); `postcss ^8.4.38` (CSS transform); `tailwindcss ^3.4.4` (utility CSS); `vite ^5.3.1` (dev server/build). `package-lock.json` locks resolved dependency versions.

### Platforms and integrations

- Vercel: static SPA hosting and history fallback (`frontend/vercel.json`).
- Render: FastAPI deployment (`render.yaml`).
- Docker: optional backend container (`backend/Dockerfile`).
- GitHub Actions: backend lint/tests and frontend build (`.github/workflows/ci.yml`).
- Modal: actual SDK integration, `modal==1.3.5` in `modal_requirements.txt`; `modal_inference.py` defines the deployment.
- Gemini: actual SDK integration, `google-generativeai` (unpinned) in `requirements.txt`, imported in `app/routers/chat.py`.
- No OAuth, JWT, Redis, DB, persistent file storage, queue or scheduler integration found.

## 4. Repository structure — file by file

### Root
- `README.md` — overview, feature claims, stack, local run instructions, deploy and metrics narrative.
- `render.yaml` — Render Blueprint; backend rootDir and environment configuration.
- `vercel.json` — root SPA rewrite.
- `.github/workflows/ci.yml` — CI jobs.

### `.github/workflows/`
- `ci.yml` — push to main / pull-request workflow; Python backend and Node frontend jobs.

### `stenosis-detection/`
- `.gitignore` — ignores Python/Node artifacts, env files, uploads/results contents and training data/runs.
- `METRICS.md` — provenance caveats and conflicts in displayed performance figures.

#### `stenosis-detection/backend/`
- `.dockerignore` — Docker build-context exclusions.
- `.env.example` — placeholder names for backend runtime configuration.
- `DEPLOYMENT_MODAL.md` — Modal deployment, secret setup, verification, rollback and troubleshooting.
- `Dockerfile` — backend image recipe and health check.
- `main.py` — FastAPI creation, lifespan, CORS, router mounting, root endpoint and direct Uvicorn startup.
- `modal_inference.py` — Modal image, packaged weights, model cache, inference, internal FastAPI endpoints and token authentication.
- `modal_requirements.txt` — Modal/ML dependency reference.
- `pyproject.toml` — pytest and Ruff config.
- `requirements.txt` — production backend dependencies.
- `requirements-dev.txt` — base dependencies plus pytest/httpx.

##### `backend/app/`
- `__init__.py` — Python package marker.
- `config.py` — dotenv load, env parsing/defaults, model registry/stats and CORS origins.
- `schemas.py` — seven Pydantic data models.
- `routers/__init__.py` — package marker.
- `routers/health.py` — `GET /api/health`.
- `routers/models.py` — `GET /api/models/comparison`.
- `routers/predict.py` — `POST /api/predict`, validation, Modal proxy and local fallback.
- `routers/chat.py` — `POST /api/health-chat`, Gemini prompt/history and exception handling.
- `services/__init__.py` — package marker.
- `services/stenosis.py` — bounding-box geometry estimator and severity thresholds.
- `services/yolo.py` — legacy local model loading/cache, semaphore, preprocessing, inference, masks, heatmap and memory logs.
- `models/YOLOv8s-det.pt` — committed detection weights; usage in active serving code **NOT FOUND / UNCLEAR**.
- `models/YOLOv8s-seg-best.pt` — committed segmentation weights; included in Modal image.
- `results/.gitkeep` — empty results folder placeholder; no persisted records discovered.
- `uploads/.gitkeep` — empty uploads folder placeholder; no persistent upload flow discovered.
- `tests/conftest.py` — backend path inserted into Python import path.
- `tests/test_api.py` — endpoint and concurrency tests.
- `tests/test_stenosis.py` — pure geometry/classification tests.

#### `stenosis-detection/frontend/`
- `.env.example` — Vite API URL and dev backend override names.
- `index.html` — SPA shell, favicon, title and web-font links.
- `package.json` — scripts and dependencies.
- `package-lock.json` — resolved npm dependency graph.
- `postcss.config.js` — PostCSS plugins.
- `tailwind.config.js` — Tailwind config.
- `vite.config.js` — React plugin, dev port 3000 and `/api` proxy.
- `vercel.json` — SPA history fallback.
- `public/heart-icon.png` — favicon/brand image.
- `public/vercel.json` — duplicate rewrite file under public; necessity **NOT FOUND / UNCLEAR**.
- `src/main.jsx` — React entry point, StrictMode, BrowserRouter and CSS import.
- `src/App.jsx` — route declarations and Layout wrapper.
- `src/components/Banner.jsx` — dismissible localStorage notice.
- `src/components/Footer.jsx` — footer and current year.
- `src/components/Layout.jsx` — common shell and animated outlet.
- `src/components/Navbar.jsx` — navigation and active route styling.
- `src/components/SectionHeader.jsx` — reusable heading.
- `src/pages/Home.jsx` — landing page and project overview claims.
- `src/pages/Predict.jsx` — upload, preview, prediction, result, reset and chat UI.
- `src/pages/Results.jsx` — static ARCADE/CADICA metrics tables.
- `src/pages/Research.jsx` — static research entries, search, author filter, expand/collapse.
- `src/pages/About.jsx` — timeline, team, stack and disclaimer.
- `src/pages/ModelComparison.jsx` — API-backed charts with local fallback and dataset tables; not routed in `App.jsx`.
- `src/styles/index.css` — Tailwind directives, base and scrollbar styles.
- `src/utils/api.js` — Axios client/base URL/timeout and API helpers.
- `src/utils/modelConstants.js` — metric constants and fallback payload.

#### `stenosis-detection/training/`
- `README.md` — local training and validation workflow.
- `data.yaml` — ARCADE local data path and single stenosis class mapping.
- `train.py` — CLI to load pretrained YOLOv8-seg, train, validate and write metrics JSON.

## 5. Startup flow and entry points

### Frontend
1. Vite serves `frontend/index.html` during development; Vercel serves the built SPA and applies history fallback (`frontend/vercel.json`).
2. `src/main.jsx` finds `#root`, calls `createRoot`, wraps app in `React.StrictMode` and `BrowserRouter`, and imports global CSS.
3. `src/App.jsx` registers `/`, `/predict`, `/results`, `/research`, `/about` inside `Layout`.
4. `ModelComparison.jsx` exists but is not imported or routed by `App.jsx`.
5. Vite dev server on port 3000 proxies `/api` to `BACKEND_URL` or `http://localhost:8000` (`vite.config.js`).

### Backend
1. Run from `stenosis-detection/backend`; import target is `main:app`.
2. `main.py` imports config/routers, configures Python INFO logging, creates relative `uploads/` and `results/` directories, and defines a lifespan that logs the inference provider.
3. FastAPI app is created; CORS middleware uses `build_cors_origins()` with credentials enabled and wildcard methods/headers.
4. Routers mount health, predict, models, chat.
5. `GET /` returns API name/version/default model/provider.
6. Direct run binds `0.0.0.0:8000`; Render command uses `$PORT`.

### Modal
1. `modal_inference.py` creates `modal.App("cardio-vision-inference")`.
2. `MODAL_IMAGE` installs system and CPU-ML dependencies, packages only `YOLOv8s-seg-best.pt`, and adds the `app` Python source.
3. The decorated function sets secret, CPU, 0 minimum/1 maximum containers, 2 CPU, 1024 MiB and 300 second timeout.
4. `fastapi_app()` exposes internal `GET /health` and token-protected `POST /predict`.
5. `_load_model()` lazily loads weights and caches the model in `_MODEL_CACHE` for that container's lifetime.

### Training
`training/train.py::main` parses CLI args, loads a COCO-pretrained `yolov8{size}-seg.pt`, calls `model.train()` and `model.val()`, then writes `metrics.json` under `runs/segment/<run-name>/`. The data path/class mapping is in `training/data.yaml`. Data and run outputs are gitignored.

## 6. Environment variables — names only

| Name | Source / use |
|---|---|
| `PORT` | `.env.example`, `render.yaml`; Render startup command uses `$PORT`; direct main run uses literal 8000 |
| `DEFAULT_MODEL` | `app/config.py` |
| `MAX_IMAGE_SIDE` | `app/config.py`, `modal_inference.py` |
| `YOLO_IMGSZ` | `app/config.py`, `modal_inference.py` |
| `TORCH_NUM_THREADS` | Parsed in `app/config.py`; Docker/Render config also sets it; Modal explicitly sets torch threads in code |
| `MAX_UPLOAD_BYTES` | `app/config.py`, `modal_inference.py` |
| `MAX_CONCURRENT_INFERENCE` | `app/config.py`, `services/yolo.py`; legacy local semaphore only |
| `GEMINI_API_KEY` | `app/config.py`, `render.yaml` |
| `GEMINI_MODEL` | `app/config.py` |
| `INFERENCE_PROVIDER` | `app/config.py`, `render.yaml` |
| `MODAL_INFERENCE_URL` | `app/config.py`, `render.yaml` |
| `MODAL_INFERENCE_TOKEN` | `app/config.py`, `modal_inference.py`, `render.yaml` |
| `MODAL_CONNECT_TIMEOUT` | `app/config.py` |
| `MODAL_READ_TIMEOUT` | `app/config.py` |
| `CORS_ALLOWED_ORIGINS` | `app/config.py`, `render.yaml` |
| `DATABASE_URL` | `.env.example` only; application use **NOT FOUND / UNCLEAR** |
| `STORAGE_KEY` | `.env.example` only; application use **NOT FOUND / UNCLEAR** |
| `MODAL_GPU` | Comment only; actual read/use **NOT FOUND / UNCLEAR**; Modal decorator currently `gpu=None` |
| `VITE_API_BASE_URL` | `frontend/src/utils/api.js`, frontend `.env.example` |
| `BACKEND_URL` | `frontend/vite.config.js`, frontend `.env.example` |

Do not put Gemini/Modal secrets in `VITE_*` variables. The Modal shared token is used server-to-server, not by browser code.

## 7. API endpoint inventory

| Method | Path | Implementation | Purpose |
|---|---|---|---|
| GET | `/` | `main.py::root` | API metadata |
| GET | `/api/health` | `app/routers/health.py::health_check` | Provider/config readiness summary |
| POST | `/api/predict` | `app/routers/predict.py::predict` | Upload and infer via Modal or local fallback |
| GET | `/api/models/comparison` | `app/routers/models.py::get_model_comparison` | Metrics and availability flags |
| POST | `/api/health-chat` | `app/routers/chat.py::health_chat` | Scoped Gemini chat |
| GET | `/health` | `modal_inference.py::fastapi_app::modal_health` | Modal health |
| POST | `/predict` | `modal_inference.py::fastapi_app::predict` | Authenticated Modal inference |

## 8. NOT FOUND / UNCLEAR and code/documentation mismatches

- No DB/ORM/Redis: no schema, migration, DB connection or Redis client in tracked source. `_model_cache` and `_MODEL_CACHE` are in-process model caches only.
- No browser-user OAuth/JWT login: Modal uses a shared bearer token only for Render-to-Modal calls.
- No persistent upload: uploaded bytes are read and forwarded; no object-store write or database record. Direct writes into `uploads/` or `results/` were not found.
- No background queue: prediction is request/response.
- No detection model API: `models.py` returns `detection_models: []`; serving config is segmentation-oriented.
- No report history API: React component state holds current response.
- `ModelComparison.jsx` is not registered in `App.jsx`, despite being a full source module.
- `estimate_diameter_reduction(bbox, img_shape)` does not use `img_shape`; actual calculation is only bbox width/height ratio.
- Modal code measures `inference_ms` and converts to seconds. Render proxy's `result.setdefault("processing_time", round(time.time() - 0, 3))` is an invalid elapsed-time fallback (time since Unix epoch); normal Modal result already contains the field.
- Metrics: `METRICS.md` calls out conflicting ARCADE segmentation numbers between `Results.jsx` and `MODEL_STATS`, missing committed run artifacts, and identifies 94.4% mAP@0.5 / 0.91 F1 as CADICA detection, not ARCADE segmentation.
- README claims 14 tests; exact runtime test count should be confirmed by running pytest, not by prose.
- UI upload accepts a list of image extensions but backend relies on Pillow decode + size, not a separate MIME allow-list.

## 9. Recommended reading order

1. `frontend/src/pages/Predict.jsx`
2. `backend/app/routers/predict.py`
3. `backend/modal_inference.py`
4. `backend/app/services/stenosis.py`
5. `backend/app/services/yolo.py` (legacy local implementation)
6. `backend/app/routers/chat.py` and chat code in Predict.jsx
7. `backend/app/config.py`, `render.yaml`, Dockerfile, CI workflow
8. `training/train.py`, `training/data.yaml`, `METRICS.md`