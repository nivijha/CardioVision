# CardioVision — Master Feature Inventory

> Derived from the recursive Git tree on default branch `main` (the tree response was not truncated) and direct inspection of route/component/model/service/config/test files. This inventory includes application build details, small UI states, QA and deployment—not only resume bullets. Feature cards have not yet been started.

## Counting method

The repository tree before adding this interview-prep directory contained 83 entries (64 files and 19 directories). The two generated prep documents add three directories and two files; the current tree therefore contains 88 entries (66 files and 22 directories). The recursive API response was not truncated. Counts below distinguish routes/components/models from files:

| Area | Count |
|---|---:|
| FastAPI route handlers | 7 total: 5 public backend handlers + 2 Modal handlers |
| Frontend route declarations | 5 paths |
| Frontend page modules | 6 (Home, Predict, Results, Research, About, ModelComparison) |
| Shared frontend components | 5 |
| Frontend utility modules | 2 |
| Pydantic schema classes | 7 |
| Backend service modules | 2 |
| Backend router modules | 4 |
| Backend test modules | 2 plus conftest |
| Training files | 3 |
| CI workflows | 1 workflow, 2 jobs |
| Primary deployment definitions | Render YAML, Dockerfile, frontend Vercel config; root/public duplicate Vercel configs also exist |
| Committed model weights | 2 `.pt` files |
| DB models/migrations/ORM | 0 found |
| Redis client/distributed cache | 0 found |
| Background jobs/task queues | 0 found |

## Feature checklist

### A. App shell and static content
1. [ ] **Frontend bootstrap and routing** — `frontend/src/main.jsx`, `frontend/src/App.jsx`, `frontend/index.html`, `frontend/vercel.json`.
2. [ ] **Shared layout and page transitions** — `frontend/src/components/Layout.jsx`.
3. [ ] **Navigation and active route state** — `frontend/src/components/Navbar.jsx`.
4. [ ] **Dismissible backend-performance notice** — `frontend/src/components/Banner.jsx` (localStorage + Framer Motion).
5. [ ] **Footer and dynamic year** — `frontend/src/components/Footer.jsx`.
6. [ ] **Reusable section heading** — `frontend/src/components/SectionHeader.jsx`.
7. [ ] **Home page content and CTA links** — `frontend/src/pages/Home.jsx`.
8. [ ] **About metadata/team/timeline/disclaimer** — `frontend/src/pages/About.jsx`.

### B. Upload and prediction UI
9. [ ] **Prediction page state and lifecycle** — `frontend/src/pages/Predict.jsx`.
10. [ ] **Drag/drop and file selection** — `Predict.jsx`; `react-dropzone` integration.
11. [ ] **Object URL preview and image dimensions** — `Predict.jsx`; `URL.createObjectURL`, image onLoad; URL revocation **NOT FOUND / UNCLEAR**.
12. [ ] **Prediction request, multipart FormData and cancellation** — `Predict.jsx::handlePredict`, `frontend/src/utils/api.js`.
13. [ ] **Loading and cold-start notice** — `Predict.jsx`; timer threshold and notice UI.
14. [ ] **Prediction error mapping** — `Predict.jsx::handlePredict`; cancel, timeout, HTTP 400/413/429/500/502/503 and generic errors.
15. [ ] **Clear/reset behavior** — `Predict.jsx::resetAll`.
16. [ ] **Prediction summary and lesion metrics** — `Predict.jsx`; detection flag, percentage, severity, bbox/multiple detection message.
17. [ ] **Mask/heatmap/overlay visualization** — `Predict.jsx`, backend `services/yolo.py` and `modal_inference.py`.
18. [ ] **Multiple detections and primary lesion selection** — backend inference functions and `Predict.jsx`; frontend chooses first `detections` item, while backend summary has separate highest-confidence and highest-percent selections.

### C. API/backend runtime
19. [ ] **FastAPI app and root endpoint** — `backend/main.py::app`, `lifespan`, `root`.
20. [ ] **CORS middleware and origins** — `main.py`, `app/config.py::build_cors_origins`.
21. [ ] **Environment config and defaults** — `app/config.py`, `.env.example`.
22. [ ] **Health endpoint** — `app/routers/health.py::health_check`.
23. [ ] **Prediction upload validation and bounded read** — `app/routers/predict.py::predict`.
24. [ ] **Authenticated Render-to-Modal proxy** — `app/routers/predict.py::_forward_to_modal`.
25. [ ] **Legacy local inference branch** — `app/routers/predict.py::predict`, `app/services/yolo.py::run_segmentation_inference`.
26. [ ] **Model comparison endpoint and availability flags** — `app/routers/models.py::get_model_comparison`, `app/config.py::MODEL_STATS`.
27. [ ] **Pydantic schema/data contract** — `app/schemas.py` (7 classes; note whether routes explicitly bind response_model).
28. [ ] **Logging, traceback and memory telemetry** — `main.py`, routers, `services/yolo.py::log_memory`, Modal `_log_memory`.

### D. Model inference, geometry and visualizations
29. [ ] **Modal app/image/container configuration** — `backend/modal_inference.py::app`, `MODAL_IMAGE`, decorated `fastapi_app`.
30. [ ] **Modal authentication and model allow-list** — `modal_inference.py::fastapi_app::predict`.
31. [ ] **Lazy weight loading and in-process model caches** — Modal `_load_model/get_model`; local `services/yolo.py::get_model`.
32. [ ] **Image preprocessing and confidence/IoU/device settings** — Modal `preprocess_image_for_inference/_run_inference`; local YOLO service.
33. [ ] **YOLO prediction, multiple lesions and no-detection path** — Modal `_run_inference`; local `run_segmentation_inference`.
34. [ ] **Geometric stenosis percentage** — `app/services/stenosis.py::estimate_diameter_reduction`.
35. [ ] **Severity category thresholds** — `app/services/stenosis.py::classify_severity`.
36. [ ] **Mask extraction/resizing/combination/Base64 encoding** — Modal `_run_inference/ndarray_to_b64_png`; local YOLO service.
37. [ ] **Heatmap overlay generation** — Modal `_generate_heatmap_overlay`; local equivalent.
38. [ ] **Memory and concurrency controls** — Modal thread/memory config; local semaphore/gc/psutil/image size limits.
39. [ ] **Inference response contract and processing-time semantics** — `app/schemas.py::StenosisResult`, Modal inference endpoint, Render predict proxy.

### E. Gemini assistant
40. [ ] **Prediction-context chat UI/state** — `frontend/src/pages/Predict.jsx::handleSendMessage` and chat JSX.
41. [ ] **Gemini SDK setup, prompt scope and diagnosis context** — `backend/app/routers/chat.py::health_chat`, `app/config.py`.
42. [ ] **Conversation history conversion and LLM request** — `chat.py::health_chat`.
43. [ ] **Chat input validation and provider failure mapping** — `chat.py::health_chat`, `app/schemas.py::ChatRequest/ChatMessage`.

### F. Results, comparison and research pages
44. [ ] **Static evaluation-results tables** — `frontend/src/pages/Results.jsx`, `stenosis-detection/METRICS.md`.
45. [ ] **Model comparison fetch/loading/fallback** — `frontend/src/pages/ModelComparison.jsx`, `utils/modelConstants.js`, `utils/api.js`.
46. [ ] **Model comparison charts, metric cards and dataset toggle** — `ModelComparison.jsx` (page is not registered in App routes).
47. [ ] **Research directory search and author filtering** — `frontend/src/pages/Research.jsx`.
48. [ ] **Research expand/collapse and empty state** — `Research.jsx`.

### G. Model training and artifacts
49. [ ] **Training dataset config** — `stenosis-detection/training/data.yaml`.
50. [ ] **Training CLI args and size selection** — `training/train.py::main`.
51. [ ] **YOLO fine-tuning and validation** — `training/train.py::main`.
52. [ ] **metrics.json artifact generation and provenance** — `training/train.py`, `training/README.md`, `METRICS.md`.
53. [ ] **Committed weight inventory and served-model availability** — `backend/models/`, `modal_inference.py::AVAILABLE_MODELS`, `app/config.py::MODEL_CONFIG`, `app/routers/models.py`, `METRICS.md`.

### H. Testing, CI and deployment
54. [ ] **Test bootstrap and dependency-aware skipping** — `backend/tests/conftest.py`, `test_api.py`.
55. [ ] **Geometric unit test cases** — `backend/tests/test_stenosis.py`.
56. [ ] **API integration tests** — `backend/tests/test_api.py`.
57. [ ] **Inference concurrency test** — `test_api.py::test_concurrent_predictions_are_serialized`.
58. [ ] **Pytest/Ruff configuration** — `backend/pyproject.toml`, `requirements-dev.txt`, `modal_requirements.txt`.
59. [ ] **GitHub Actions CI** — `.github/workflows/ci.yml`.
60. [ ] **Render Blueprint deployment** — `render.yaml`.
61. [ ] **Docker image and health check** — `backend/Dockerfile`, `.dockerignore`.
62. [ ] **Vercel SPA routing and frontend API base URL** — `frontend/vercel.json`, root `vercel.json`, `frontend/src/utils/api.js`, `.env.example`.
63. [ ] **Modal deploy/secret/rollback operations** — `backend/modal_inference.py`, `DEPLOYMENT_MODAL.md`, `modal_requirements.txt`, `render.yaml`.

### I. Operational and code-quality details
64. [ ] **Working-directory assumptions and upload/results directories** — `backend/main.py`, `backend/Dockerfile`, `render.yaml`.
65. [ ] **Banner localStorage persistence** — `frontend/src/components/Banner.jsx`.
66. [ ] **Axios timeout and API-base fallback** — `frontend/src/utils/api.js`.
67. [ ] **Client acceptance vs backend upload validation** — `frontend/src/pages/Predict.jsx`, `backend/app/routers/predict.py::predict`.
68. [ ] **Config/documentation drift and metric consistency audit** — `README.md`, `.env.example`, `app/config.py`, `render.yaml`, `METRICS.md`.

## Review required before feature-card batches

Please review this inventory and confirm whether to proceed with these 68 items. Scope notes:
- `ModelComparison.jsx` is included despite not being routed in `App.jsx`.
- Modal inference and legacy local YOLO are separate features because both exist.
- Static pages and small loading/error/empty/localStorage states are included.
- No DB, Redis, OAuth, browser-user JWT, persistent upload or background-job feature is invented.
- Percentage estimation will be described as the code's geometry heuristic, not clinical ground truth.
- The metrics audit will preserve the conflict documented by `METRICS.md`: results-page ARCADE segmentation values disagree with `MODEL_STATS`; 94.4% mAP@0.5 / 0.91 F1 is attributed to CADICA detection.

**Status:** 68 features inventoried; 0 feature cards written. Phase 2 review point reached.