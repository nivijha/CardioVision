## Phase 1 — High Level Project Understanding

### 1. What problem does this system solve?
It automates coronary artery stenosis detection and segmentation from angiography images using YOLOv8. The app detects stenotic regions, estimates occlusion severity, and overlays segmentation/heatmap visualizations.

### 2. What is the business use case?
A research-grade diagnostic companion for cardiology teams, enabling faster second opinions and exploratory analysis of angiography images without manual annotation. It’s designed for academic evaluation and prototype deployment, not clinical use.

### 3. Who are the users?
- Medical researchers
- Cardiovascular imaging analysts
- Data scientists evaluating YOLO-based segmentation
- Students or academics demonstrating AI-assisted diagnostics

### 4. What are the main workflows?
- Landing page discovery
- Upload an angiography image
- Run inference through backend
- View detection, stenosis severity, segmentation mask, heatmap
- Ask the integrated AI assistant about results
- Review model performance metrics and methodology

### 5. What happens from the moment a user lands on the application?
- Browser loads `frontend/index.html`
- Vite serves React app via `src/main.jsx`
- User is routed by `react-router-dom` inside `src/App.jsx`
- `Layout` adds navbar/footer
- If user chooses `/predict`, Predict.jsx lets them drag-and-drop an image
- Upload triggers `axios.post('http://localhost:8000/predict')`
- Backend runs inference and returns JSON
- Frontend renders results and overlays

### 6. End-to-end request lifecycle
1. User selects image in Predict.jsx
2. `axios.post` sends multipart file to `FastAPI` endpoint `/predict`
3. Backend validates `model_name` and loads image with PIL
4. `run_segmentation_inference()` executes YOLOv8 inference
5. Model outputs boxes/masks; backend computes stenosis severity and heatmap
6. Backend returns JSON with `detections`, `mask_b64`, `heatmap_b64`
7. Frontend displays metrics and overlay visualization
8. If user interacts with chat, frontend sends `/api/health-chat`
9. Backend forwards request to Google Gemini via `google.generativeai`

### 7. Overall architecture diagram (textual)
Browser (React/Vite)
→ `src/App.jsx`, `src/pages/*`
→ Axios HTTP requests
→ Backend FastAPI (`backend/main.py`)
→ Model loader/cache (`get_model()`)
→ YOLOv8 segmentation inference
→ Inference post-processing (`estimate_diameter_reduction()`, `classify_severity()`)
→ JSON response
→ Frontend render + overlay SVG

Plus:
Backend → Gemini API when `/api/health-chat` is called

### 8. Major modules and responsibilities
- main.py
  - Main server, API endpoints, model loading, inference, health/chat routes
- models.py
  - Pydantic response model definitions
- `stenosis-detection/backend/models/*`
  - YOLOv8 weight files
- src
  - React SPA
- `frontend/src/pages/Predict.jsx`
  - Core upload + inference page
- `frontend/src/utils/api.js`
  - Axios client
- `frontend/src/pages/ModelComparison.jsx`
  - Model metrics view
- `frontend/src/components/Layout.jsx`
  - App shell + motion animations

### 9. Technology stack and why each technology is used
- FastAPI: rapid backend API development
- Uvicorn: ASGI server to run FastAPI
- Ultralytics YOLOv8: state-of-the-art segmentation/detection
- PyTorch: model runtime
- Pillow + numpy: image I/O and processing
- React + Vite: fast frontend development and SPA routing
- Tailwind CSS: utility-first styling
- Axios: HTTP client
- React Router DOM: client-side routes
- Google Gemini via `google-generativeai`: chat assistant integration

---

## Phase 2 — Folder Structure Analysis

### / (repo root)
Purpose: documentation and project entry
- README.md: project overview and run instructions
- BEFORE_AFTER_EXAMPLES.md, CLEANUP_REPORT.md, etc.: likely audit/cleanup records
Why it exists: top-level project metadata and docs

### /stenosis-detection/backend
Purpose: AI inference service
Responsibility:
- API endpoints
- model loading and caching
- image validation
- YOLOv8 inference
- result serialization
Dependencies:
- requirements.txt
- Pytorch / Ultralytics
- YOLO model weights
Why it exists: provide decoupled inference API for frontend

### /stenosis-detection/backend/models
Purpose: store model weights
Responsibility:
- `YOLOv8n-seg-best.pt`
- `YOLOv8s-seg-best.pt`
Why it exists: production weights used by the backend

### models.py
Purpose: Pydantic response models
Responsibility:
- `DetectionItem`
- `StenosisResult`
- `HealthCheckResponse`
- `ModelMetrics`
- `ComparisonResponse`
Why it exists: define backend schema and validation; unused by endpoints due to direct return of dicts, but available for typed response models

### /stenosis-detection/frontend
Purpose: UI layer
Responsibility:
- React components, pages, routing
- HTTP integration with backend
- visual presentation of model outputs
Dependencies:
- package.json
Why it exists: consumer-facing interface for the AI service

### /stenosis-detection/frontend/src
Purpose: app source code
Responsibility:
- pages, shared components, utils
Why it exists: SPA implementation

### /stenosis-detection/frontend/src/pages
Purpose: route-specific UI flows
Responsibility:
- Home.jsx: marketing landing
- Predict.jsx: image upload + inference
- Results.jsx: metric tables
- ModelComparison.jsx: comparative charts
- Research.jsx: methodology docs
- About.jsx: metadata and stack

### /stenosis-detection/frontend/src/components
Purpose: reusable UI building blocks
Responsibility:
- Layout shell (Layout.jsx)
- Navbar/Footer
- SectionHeader styling
Why it exists: design consistency and reuse

### /stenosis-detection/frontend/src/utils
Purpose: shared logic
Responsibility:
- api.js: HTTP client
- modelConstants.js: fallback model stats
Why it exists: abstract API endpoints and model metadata

---

## Phase 3 — API Documentation

### API Endpoints

| Method | Route | Purpose | Auth Required | DB Tables Used |
|---|---|---|---|---|
| GET | `/` | API root status | No | None |
| GET | `/health` | Model availability health check | No | None |
| POST | `/predict` | Image inference for stenosis detection | No | None |
| GET | `/api/models/comparison` | Return static model metrics | No | None |
| POST | `/api/health-chat` | AI assistant query via Gemini | No | None |

### Endpoint: GET `/`
- Purpose: basic API health/version/info
- Request Flow: direct function return
- Validation: none
- Auth: none
- Controller: `root()`
- Service/Data: no DB, returns `DEFAULT_MODEL_NAME`
- Response:
  ```json
  { "message": "Stenosis Detection AI API", "version": "1.0.0", "active_model": "YOLOv8s-seg" }
  ```
- Errors: none
- Middleware: CORS only
- Security: none
- Interview note: simple liveness endpoint

### Endpoint: GET `/health`
- Purpose: confirm model files exist
- Request Flow: checks each `MODEL_CONFIG` path
- Validation: none
- Auth: none
- Controller: `health_check()`
- Response: `{ "status": "healthy", "models_available": { ... } }`
- Errors: none
- Security: reveals file availability, low risk

### Endpoint: POST `/predict`
- Purpose: run segmentation inference on uploaded image
- Request Flow:
  - `FastAPI` receives multipart `file`
  - `model_name` query param defaults to `YOLOv8s-seg`
  - file read and opened with Pillow
  - inference executed in `asyncio.to_thread`
  - processing time computed
- Validation:
  - `model_name` must be in `MODEL_CONFIG`
  - file must be a valid image
- Controller: `predict(...)`
- Service:
  - `run_segmentation_inference(image, model_name)`
  - `get_model(model_name)` loads/caches model
  - `estimate_diameter_reduction()`
  - `classify_severity()`
  - `ndarray_to_b64_png()`
- Database: none
- Response: JSON containing detection list, severity, bounding box, masks, heatmap, processing time
- Error Handling:
  - 400 invalid image or model name
  - 503 model file missing
  - 500 inference crash
- Middleware Chain:
  - CORS
  - FastAPI request parser
  - endpoint handler
- Security: no authentication, open upload endpoint — risk if exposed publicly. No rate limiting or validation beyond image decoding.

### Endpoint: GET `/api/models/comparison`
- Purpose: return static performance metrics
- Request Flow: builds `seg_models` from `MODEL_STATS`
- Validation: none
- Controller: `get_model_comparison()`
- Response:
  - `detection_models: []`
  - `segmentation_models: [ ... ]`
- Security: no auth
- Interview note: stubbed detection metrics and available flags. Could be extended with actual dataset-backed metrics.

### Endpoint: POST `/api/health-chat`
- Purpose: conversational assistant for users
- Request Flow:
  - validates `GEMINI_API_KEY`
  - checks `messages`
  - builds scoped system prompt
  - constructs chat history
  - forwards to Gemini via `genai.GenerativeModel`
- Validation:
  - non-empty messages
  - `severity` can be any string but controls prompt
- Service:
  - `ChatMessage`, `ChatRequest` models
- Response: `{ "reply": "<assistant text>" }`
- Error Handling:
  - 503 if API key missing
  - 400 if message array empty
  - 500 if Gemini fails
- Security: depends on external Gemini API and prompt safety. No auth.

---

## Phase 4 — Authentication System

### Reality
- There is no authentication, signup, JWT, refresh tokens, session handling, password hashing, OAuth, RBAC, or permission system anywhere in the repository.

### What that means
- The app is public by design
- Any client can access `/predict`, `/health`, `/api/models/comparison`, and `/api/health-chat`
- No user isolation exists
- No identity or authorization checks exist

### Interview explanation
If asked about authentication, answer:
- “This project currently has no auth layer. It’s a prototype/research demo where security is limited to CORS middleware only. If I were to harden it, I would add access tokens, session cookies, role checks, and rate limiting around the inference API.”

---

## Phase 5 — Middleware Analysis

### Backend middleware
- `CORSMiddleware` in `backend/main.py`
  - Purpose: allow browser requests from any origin
  - Executes before endpoint handlers
  - Input: request headers
  - Output: response with CORS headers
  - Failure: none
  - Security implications: overly permissive; should be locked down in production
  - Execution order: first

### Request chain
Request
→ CORS
→ FastAPI parser / validation
→ Endpoint logic (`root`, `health_check`, `predict`, `get_model_comparison`, `health_chat`)
→ Response

### Middleware execution diagram
```
Client
→ CORS Middleware
→ FastAPI routing
→ Endpoint handler
→ JSON response
```

### Not present
- No authentication middleware
- No authorization middleware
- No rate limiting middleware
- No validation middleware beyond FastAPI pydantic parsing
- No request logging middleware beyond Python logger

---

## Phase 6 — Database Analysis

### Reality
- There is no database in this codebase.
- No tables, collections, models, foreign keys, indexes, or persistence.

### What exists instead
- Model weights in `backend/models/`
- Temporary files directories:
  - `backend/uploads/`
  - `backend/results/`
- But those directories are not used by code to persist output.

### Interview explanation
- “This project is stateless from a DB perspective. It operates in-memory and stores only model weights on disk. The next logical extension would be a metadata DB for uploads, inference history, and user sessions.”

---

## Phase 7 — Business Logic Analysis

### `get_model(model_name)`
- Purpose: load YOLOv8 model weights once and cache them
- Inputs: model name
- Outputs: loaded YOLO model
- Dependencies: `ultralytics.YOLO`, `torch`
- Behavior:
  - monkey-patches `tasks.torch_safe_load` to allow custom weight load
  - logs load
  - caches loaded model in `_model_cache`
- Edge cases:
  - missing file raises `FileNotFoundError`
- Why not in controller:
  - separates model initialization from request handling
  - avoids repeated loading cost

### `run_segmentation_inference(image, model_name)`
- Purpose: execute YOLO inference and format results
- Inputs: PIL image, model name
- Outputs: dict with detection info, masks, heatmap
- Dependencies: `numpy`, `PIL`, YOLO results object
- Business rules:
  - returns `stenosis=False` when no boxes
  - uses highest confidence detection as primary
  - generates combined mask and heatmap overlay
- Edge cases:
  - missing masks
  - empty results
  - exceptions during mask generation
- Failure scenarios:
  - inference exceptions bubble up causing 500
  - absent model weights cause 503

### `estimate_diameter_reduction(bbox, img_shape)`
- Purpose: approximate stenosis percent from bounding box aspect ratio
- Input: bounding box coordinates
- Output: percentage in range [20, 95]
- Business rules:
  - short/long axis ratio mapped to stenosis severity
- Interview answer:
  - “This is a heuristic that uses geometry of detected lesion bounding boxes to estimate occlusion severity, because the model returns only bounding box and mask coordinates, not direct stenosis percentage.”

### `classify_severity(pct)`
- Purpose: bucket severity categories
- Ranges:
  - <25 → minimal
  - <50 → mild
  - <70 → moderate
  - <90 → severe
  - >=90 → occlusion

---

## Phase 8 — Request Flow Analysis

### User login / registration
- Not implemented

### Image prediction flow
1. User drops/upload image in Predict.jsx
2. `onDrop()` sets preview URL and calls `handlePredict(file)`
3. `handlePredict()` creates multipart `FormData`
4. Axios sends POST to `http://localhost:8000/predict?model_name=YOLOv8s-seg`
5. FastAPI receives file in `predict(...)`
6. Backend validates model and opens image
7. `run_segmentation_inference()` runs YOLO and post-processes output
8. Backend returns JSON
9. Frontend sets `result` state
10. UI renders overlays, bounding boxes, severity cards

### Model comparison flow
1. ModelComparison.jsx mounts
2. `useEffect()` calls `getModelComparison()`
3. api.js sends GET `/api/models/comparison`
4. Backend returns static metrics
5. Frontend renders charts with `recharts`

### Health chat flow
1. User opens chat in Predict.jsx
2. `handleSendMessage()` sends POST to `/api/health-chat`
3. Backend builds prompt/context and calls Gemini
4. Response text returns to frontend
5. UI appends assistant message

---

## Phase 9 — Frontend Analysis

### Routing
- `src/main.jsx` wraps `App` in `BrowserRouter`
- `src/App.jsx` defines nested routes under `Layout`
- Routes:
  - `/` → `Home`
  - `/predict` → `Predict`
  - `/results` → `Results`
  - `/research` → `Research`
  - `/about` → `About`

### State management
- Local React state only
- Predict.jsx uses `useState`, `useCallback`, `useRef`
- No Redux, no global context

### Component hierarchy
- `Layout`
  - `Navbar`
  - `Outlet`
  - `Footer`
- Key pages render content directly
- `SectionHeader` shared UI component

### API integration
- `frontend/src/utils/api.js` centralizes backend requests
- Predict.jsx also directly calls Axios for chat endpoints
- `getModelComparison()` uses `api.get('/api/models/comparison')`
- `predictStenosis()` is defined but not used in Predict page (page uses its own Axios call)

### Caching
- No client-side caching
- In-memory model cache exists backend-side only

### Forms / validation
- `react-dropzone` handles file input
- Accepts image/* with specific extensions
- Error messages displayed in UI for invalid image / server errors
- Chat input handles Enter key and disables while loading

### Protected routes
- None — all routes public

### Major frontend components

#### Predict.jsx
- Purpose: inference UI
- Props: none
- State:
  - `selectedFile`
  - `previewUrl`
  - `loading`
  - `result`
  - `error`
  - `chatMessages`
  - `chatInput`
  - `isChatOpen`
- API dependencies: `/predict`, `/api/health-chat`
- Interview explanation: “This page is the feature core; it handles file upload, sends inference requests, renders results, and includes a chat assistant.”

#### ModelComparison.jsx
- Purpose: present model metrics
- Props: none
- Uses fallback data if API unavailable
- Interview note: decouples static dataset metrics from runtime inference

#### Layout.jsx
- Purpose: shell and page transition animation
- Uses `framer-motion` page transitions
- Interview note: improves UX without adding business logic

---

## Phase 10 — System Design

### Current Architecture
Client
→ React SPA
→ Axios
→ FastAPI backend
→ YOLOv8 model inference
→ optional Google Gemini call

### Strengths
- Clear separation of frontend/backend
- Simple and maintainable monolith
- GPU/CPU inference support via PyTorch
- Model caching reduces repeated load time
- Good UX with drag/drop upload + visualization

### Weaknesses
- No auth, no DB, no persistence
- Single-file backend monolith
- Overly permissive CORS
- Hard-coded backend URL `http://localhost:8000`
- No real production-ready security or rate limiting

### Bottlenecks
- YOLO inference is CPU-heavy
- Single process model inference
- Chat assistant synchronous external dependency
- No queueing for concurrent uploads

### Scalability Issues
- Cannot scale horizontally easily due to in-memory model cache and no stateless deployment plan
- If many concurrent requests arrive, CPU spikes and response slows
- No caching for repeated identical predictions

### Security Risks
- Open public inference endpoint
- No auth or authorization
- No upload size limits
- No validation beyond image decoding
- Gemini integration may reveal API key if server misconfigured

### Reliability Concerns
- A single backend crash stops all inference
- No health monitoring besides `/health`
- No fallback if model file missing

### Performance Issues
- `get_model()` lazy loads model at first request, causing first-request latency
- `asyncio.to_thread()` helps with async, but long-running compute still blocks limited workers
- Heatmap generation is CPU-heavy in Python

---

## Phase 11 — Interview Preparation Section

### Tell me about this project

#### 30-second version
CardioVision is a prototype AI system that detects and segments coronary artery stenosis from angiography images using YOLOv8. It pairs a React frontend with a FastAPI backend to visualize detection results, severity estimates, and assist users with a Gemini-powered chat assistant.

#### 1-minute version
CardioVision uses a React/Vite frontend to let users upload angiography images. The backend is a FastAPI service that loads YOLOv8 segmentation models, runs inference, and computes heuristic stenosis severity from detected bounding boxes. The UI displays segmentation masks, heatmaps, and severity categories, while a secondary assistant endpoint uses Google Gemini to explain results. The app is built as a research/demo system, with no auth or persistence yet.

#### 3-minute version
The system has two main layers:
- Frontend: React SPA with routes for landing, prediction, model results, research, and about. The prediction page uses `react-dropzone` for image upload, sends multipart image payloads to backend, and renders the returned segmentation and detection overlays. It also integrates a floating chat widget that talks to `/api/health-chat`.
- Backend: FastAPI monolith in `backend/main.py`. It defines `/predict`, `/health`, `/api/models/comparison`, and `/api/health-chat`. The inference path loads a YOLOv8 model from `backend/models`, caches it in `_model_cache`, and runs segmentation. It then computes stenosis percentage by comparing bounding box short/long axis ratios and classifies severity. Model comparison data is statically defined in `MODEL_STATS`.
There is no database or authentication, so it’s a stateless demo service. The biggest technical decision was favoring a simple monolith with direct model integration for rapid prototyping.

#### 5-minute version
This project is a research-focused AI diagnostic pipeline built around YOLOv8. The frontend uses React, Tailwind, and Vite to create a polished single-page experience with specialized pages for inference, model comparison, and research context. The backend is a FastAPI service that serves as the inference engine and auxiliary AI assistant.

Important technical details:
- **Model registry**: `MODEL_CONFIG` maps model names to `.pt` files. `get_model()` lazy loads and caches models to avoid repeated expensive load operations.
- **Inference logic**: `run_segmentation_inference()` converts the image to RGB NumPy, runs `model(img, conf=0.25, iou=0.45)`, extracts boxes/masks, generates combined masks and heatmaps, and produces detection metadata.
- **Severity heuristics**: `estimate_diameter_reduction()` converts the aspect ratio of detected region to a stenosis percentage. `classify_severity()` buckets the output into minimal/mild/moderate/severe/occlusion.
- **Backend API**: `/predict` handles file uploads, `/api/models/comparison` exposes static model stats, `/api/health-chat` proxies Gemini.
- **Architectural tradeoffs**: no database or auth allowed rapid delivery, but it also means it is a demo, not a production product.
- **Potential improvements**: add auth, persistence, proper API config, rate limiting, model versioning, a queue for inference, and a metrics DB.

---

## Phase 12 — System Design Upgrade Discussion

### Growth path

#### 100 → 10,000 users
What breaks first:
- Backend concurrency and model inference latency
- First-request cold load of YOLO model
- Synchronous Gemini calls

How to scale:
- Move inference to dedicated GPU-backed service
- Deploy backend behind load balancer
- Use containerization
- Add request queue for inference tasks

Caching strategy:
- Cache model results for identical uploads if hashing files
- Cache `/api/models/comparison`

Database scaling:
- Introduce persistence for user sessions and inference logs
- Start with a relational DB or document store
- Use read replicas later

Horizontal scaling:
- Make backend stateless by removing local upload state
- Store uploaded images in object storage if needed
- Deploy multiple API instances

Load balancing:
- Place NGINX/ALB in front of backend pool
- Use health checks and sticky sessions only if necessary

Queue systems:
- Add Celery/RabbitMQ or Redis Queue
- Use async workers for inference
- Let frontend poll for results or use websocket status

Microservice opportunities:
- Separate model inference service
- Separate assistant/chat service
- Separate metrics/analytics service

CDN opportunities:
- Serve frontend bundle and static assets from CDN
- Host built React app on Vercel/Netlify
- Serve model metrics JSON via CDN if static

Monitoring strategy:
- Add Prometheus metrics for request latency, inference time, error rate
- Add logs and alerts for model load failures
- Monitor GPU/CPU utilization
- Track Gemini API failures

Observability improvements:
- Add structured logging
- Trace request through backend
- Log inference outcomes and durations
- Add Sentry/LogRocket for frontend errors

---

## Phase 13 — Code Explanation Cheatsheet

### Backend core
- `backend/main.py`
  - Single source of truth for HTTP API and inference
  - `get_model(model_name)` caches loaded YOLO
  - `run_segmentation_inference()` does model and mask work
  - `predict()` handles upload and returns structured JSON
  - `health_chat()` proxies Gemini with safe prompt

### Frontend core
- `frontend/src/pages/Predict.jsx`
  - handles upload, inference state, preview, error handling
  - renders segmentation and heatmap overlays
  - uses `axios` with abort controller to cancel stale requests
- `frontend/src/utils/api.js`
  - centralizes backend URLs
  - defines `predictStenosis()` and `getModelComparison()`
- `frontend/src/pages/ModelComparison.jsx`
  - fetches model metrics and renders charts
  - falls back to local constants when API is unavailable

### Fast facts
- No database
- No auth
- No production config
- Backend model cache is the only persistent state
- `CORS` is unrestricted
- api.js base URL is hard-coded to `localhost:8000`

---

## Phase 14 — Final Output Summary

### Architecture Documentation
- Monolithic backend with FastAPI and YOLOv8
- React/Vite SPA frontend
- Inference flows handled in `backend/main.py`
- Frontend routing and pages in `src/App.jsx` and `src/pages`

### API Documentation
- Fully documented endpoints:
  - `/`
  - `/health`
  - `/predict`
  - `/api/models/comparison`
  - `/api/health-chat`
- Includes request flow, errors, and security notes

### Authentication Documentation
- Not implemented
- Must be explicitly stated in interview
- Suggest auth additions for production

### Middleware Documentation
- Only `CORSMiddleware` exists
- No auth/validation/rate limit middleware
- Execution chain is shallow

### Database Documentation
- None
- Stateless service
- Model weights and temp folders only

### System Design Documentation
- Current architecture, strengths, weaknesses
- scaling roadmap from 100 to 1M users
- monitoring and reliability recommendations

### Interview Questions & Answers
- Use the above sections to generate targeted questions
- Focus on:
  - inference architecture
  - frontend-backend integration
  - missing auth/DB tradeoffs
  - system scaling
  - security and production readiness

### 30-Minute Revision Notes
- Remember: this is a prototype demo, not a full SaaS product
- Key files:
  - `backend/main.py`
  - `frontend/src/pages/Predict.jsx`
  - `frontend/src/utils/api.js`
  - `frontend/src/pages/ModelComparison.jsx`
- Core logic:
  - model loading and caching
  - inference pipeline
  - severity estimation
  - React upload/render pipeline
- Biggest interview hooks:
  - “Why no DB?” — because this is stateless demo
  - “Why no auth?” — prototype stage, focus on model pipeline
  - “How to scale?” — separate inference service, queue, load balancer

---

## Notes for Interview
- Be honest about what exists and what does not.
- Emphasize the architecture choices made for a prototype:
  - rapid development
  - direct model evaluation
  - clear frontend UX
- If asked about missing features, propose concrete next steps:
  - add auth, persistence, monitoring, rate limiting, and model versioning
- Keep answers grounded in actual code references:
  - `backend/main.py`
  - Predict.jsx
  - `MODEL_CONFIG`
  - `estimate_diameter_reduction()`

If you want, I can now generate a second pass that turns this into a formal interview-ready markdown document with headings, tables, and a full list of 50+ exact interview questions and answers.