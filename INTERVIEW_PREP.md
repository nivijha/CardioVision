# CardioVision Interview Preparation Guide

## 1. Project Summary

### Elevator Pitch (30 seconds)
CardioVision is a prototype AI diagnostic pipeline that detects and segments coronary artery stenosis from angiography images. It pairs a React/Vite frontend with a FastAPI backend and YOLOv8 segmentation models to deliver severity estimates, segmentation overlays, and an optional AI chat assistant.

### Recruiter Explanation (1 minute)
This project is a research-focused cardiovascular imaging prototype. The frontend is a React single-page application built with Vite and Tailwind CSS. The backend is a Python FastAPI service that accepts angiography images, runs YOLOv8 segmentation inference, computes stenosis severity from detected contours, and returns visualization-ready JSON. The app also includes a secondary AI assistant endpoint using Google Gemini.

### Technical Explanation (3 minutes)
The system consists of two layers:
- **Client:** React app in `stenosis-detection/frontend` with routes for home, prediction, results, research, and about.
- **Server:** FastAPI service in `stenosis-detection/backend/main.py` with endpoints `/predict`, `/health`, `/api/models/comparison`, and `/api/health-chat`.

The main inference flow uses `get_model()` to lazy-load and cache a selected YOLOv8 segmentation model from `backend/models/`. `run_segmentation_inference()` runs the model, extracts bounding boxes and masks, generates a combined mask and heatmap overlay, computes stenosis percentage from the bounding box aspect ratio, and buckets severity with `classify_severity()`.

The React UI uses `axios` to post multipart image data to `/predict`, then renders returned base64 mask and heatmap images along with detection metrics. The chat assistant uses `/api/health-chat` to forward user intent to Gemini with a scoped system prompt.

### Deep Technical Explanation (5 minutes)
This repository is a stateless prototype without persistence or auth. The backend is implemented as a single FastAPI module in `backend/main.py`.

Key backend components:
- `MODEL_CONFIG` defines available YOLOv8 weights.
- `get_model(model_name)` lazy-loads and caches models in `_model_cache` using Ultralytics YOLO and a temporary monkey-patch of `tasks.torch_safe_load` for weight loading.
- `run_segmentation_inference(image, model_name)` converts PIL images to RGB NumPy arrays, executes model inference with `conf=0.25` and `iou=0.45`, and processes `result.boxes` and `result.masks`.
- `estimate_diameter_reduction(bbox, img_shape)` approximates stenosis percent from bounding box short/long axis ratio and clamps it to [20, 95].
- `classify_severity(pct)` returns severity labels: `minimal`, `mild`, `moderate`, `severe`, `occlusion`.
- The `/predict` endpoint reads uploaded image bytes, validates the model name, and dispatches inference through `asyncio.to_thread` to avoid blocking the event loop.

Frontend details:
- `src/App.jsx` defines nested routing with `Layout.jsx`.
- `Predict.jsx` manages file upload, abortable requests, rendering of model outputs, and chat interaction.
- `api.js` centralizes backend calls, while `modelConstants.js` holds fallback model metric data.
- `ModelComparison.jsx` fetches `/api/models/comparison` and renders performance charts with `recharts`.

System design tradeoffs:
- Choosing a monolithic backend simplified model deployment and rapid prototyping.
- Omitting auth and DB reduced complexity but left the app insecure and non-production ready.
- CORS is permissive for development; it should be restricted for deployment.
- The first-request model load is heavy; caching avoids repeated loads but the app still requires sufficient CPU resources.

---

## 2. Folder Structure Analysis

### `/`
- Purpose: repo root with documentation.
- Contains `README.md` and cleanup artifacts.
- Interaction: no code dependency.

### `stenosis-detection/backend`
- Purpose: inference API service.
- Contains `main.py`, `models.py`, `requirements.txt`, weight files, and directories `uploads/` and `results/`.
- Responsibilities: handle HTTP requests, run YOLO inference, return JSON.
- Why it exists: to decouple AI inference from the UI.

### `stenosis-detection/backend/main.py`
- Purpose: FastAPI application entrypoint.
- Responsibilities: API definition, model loading, inference pipeline, Gemini chat integration.
- Dependencies: FastAPI, Uvicorn, PIL, NumPy, Ultralytics YOLO, Google Gemini, Python dotenv.
- Interaction: receives requests from frontend and communicates to model weights and external Gemini.

### `stenosis-detection/backend/models.py`
- Purpose: data schema definitions.
- Responsibilities: `DetectionItem`, `StenosisResult`, `HealthCheckResponse`, `ModelMetrics`, `ComparisonResponse` Pydantic models.
- Why it exists: type definitions and structure for response validation (though not fully leveraged by endpoint decorators).

### `stenosis-detection/frontend`
- Purpose: web application UI.
- Responsibilities: routing, user input, data visualization, API calls.
- Dependencies: React, React Router, Axios, Tailwind, Framer Motion, Recharts.
- Why it exists: provide user-facing interface for the inference service.

### `stenosis-detection/frontend/src`
- Purpose: source files for SPA.
- Responsibilities: pages, components, utilities.

### `stenosis-detection/frontend/src/pages`
- Purpose: route screens.
- Responsibilities: each page reflects a user-facing feature.
- Interaction: routed by `App.jsx` and rendered inside `Layout.jsx`.

### `stenosis-detection/frontend/src/components`
- Purpose: reusable layout/UI components.
- Responsibilities: page shell, navbar, footer, section headers.
- Interaction: used by pages to maintain consistent UI.

### `stenosis-detection/frontend/src/utils`
- Purpose: shared utility modules.
- Responsibilities: API request wrappers (`api.js`) and static model metrics (`modelConstants.js`).
- Interaction: consumed by pages like `Predict.jsx` and `ModelComparison.jsx`.

---

## 3. API Documentation

### Endpoint Summary Table

| Method | Route | Purpose | Auth Required | DB Tables Used |
|---|---|---|---|---|
| GET | `/` | Root/info endpoint | No | None |
| GET | `/health` | Model availability health check | No | None |
| POST | `/predict` | Run image inference | No | None |
| GET | `/api/models/comparison` | Static model performance data | No | None |
| POST | `/api/health-chat` | Gemini-based assistant | No | None |

### `/` GET
- Purpose: returned API metadata and active model.
- Request Flow: `root()` returns static dict.
- Validation: none.
- Authentication: none.
- Response: JSON with `message`, `version`, `active_model`.
- Error Handling: none.
- Middleware: `CORSMiddleware` only.
- Security: none.

### `/health` GET
- Purpose: confirm weight file availability.
- Request Flow: `health_check()` checks `MODEL_CONFIG` file existence.
- Validation: none.
- Authentication: none.
- Response: `status` and `models_available` map.
- Security: reveals model presence, low risk.

### `/predict` POST
- Purpose: accept uploaded image, run inference, return detection/segmentation.
- Route: `/predict`
- Method: POST
- Purpose: core inference endpoint.
- Request Flow:
  1. FastAPI parses multipart upload.
  2. Validates `model_name` query param.
  3. Reads image bytes and loads with PIL.
  4. Calls `asyncio.to_thread(run_segmentation_inference, image, model_name)`.
  5. Appends `processing_time` and returns result.
- Validation:
  - `model_name` must exist in `MODEL_CONFIG`.
  - Uploaded file must be a valid image.
- Authentication: none.
- Authorization: none.
- Controller: `predict(...)` in `backend/main.py`.
- Service Layer: `run_segmentation_inference()` and `get_model()`.
- Database Calls: none.
- Response: JSON object containing detection metrics, masks, heatmap, bounding box, severity, model_used, and processing_time.
- Error Handling:
  - `HTTPException(400)` if invalid model or image.
  - `HTTPException(503)` if model weights are missing.
  - `HTTPException(500)` if any inference exception occurs.
- Middleware Chain:
  - CORS -> FastAPI routing -> `predict()` -> response.
- Security Concerns:
  - no input size limit, file upload endpoint is public, risk of DoS.
  - no auth or throttling.
- Example Request: multipart/form-data file upload with query `model_name=YOLOv8s-seg`.
- Example Response: JSON with `stenosis`, `confidence`, `severity`, `mask_b64`, `heatmap_b64`, `detections`, `processing_time`.
- Edge Cases: image with no detections, missing masks, model file absent, backend OOM.
- Potential Improvements: rate limiting, size limits, auth, model selection UI, request logging.

### `/api/models/comparison` GET
- Purpose: provide performance metrics for segmentation models.
- Request Flow: `get_model_comparison()` builds list from `MODEL_STATS`.
- Validation: none.
- Authentication: none.
- Response: `detection_models: []`, `segmentation_models: [ ... ]`.
- Error Handling: none.
- Security: no concerns.
- Interview note: detection metrics are stubbed as empty.

### `/api/health-chat` POST
- Purpose: AI assistant supporting explanation of results.
- Request Flow:
  1. Parse `ChatRequest`.
  2. Validate Gemini API key.
  3. Build a scoped system prompt with diagnosis context.
  4. Create `GenerativeModel` and `start_chat()`.
  5. Send last user message and return assistant reply.
- Validation:
  - `messages` array must not be empty.
- Authentication: none.
- Authorization: none.
- Response: `{