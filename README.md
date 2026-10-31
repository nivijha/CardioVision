# CardioVision 🫀
**Automated Coronary Artery Stenosis Detection & Segmentation**

CardioVision is an AI-powered diagnostic companion built to rigorously localize and extract arterial blockages (stenosis) directly from routine coronary angiography imaging. Utilizing a state-of-the-art dual inference pipeline via **YOLOv8**, CardioVision computes exact physical occlusion percentages while securely mapping bounding boxes and vessel segmentation data into an elegant, academic-grade web interface.

---

## 🔬 Core Features

*   **Dual Inference Pipeline:** Simultaneously coordinates `YOLOv8s-det` logic and `YOLOv8s-seg` isolation to ensure pixel-perfect lesion detection without muddying structural boundaries.
*   **Transparent Diagnostics:** Immediately evaluates severity brackets (Minimal, Mild, Moderate, Severe, Occlusion) natively derived from maximum bounding-box short/long axis differential algorithms.
*   **Modular Backend:** FastAPI application factory split into `app/` routers, services, and schemas — testable and CI-ready.
*   **Tested & Linted:** 14 pytest unit/integration tests (including a real YOLO inference round-trip) with ruff linting enforced in GitHub Actions.
*   **Reproducible Training:** Scripts in `training/` fine-tune YOLOv8n/s/m-seg on ARCADE data and emit machine-readable `metrics.json` for provenance (see `METRICS.md`).
*   **Drop-In APIs:** Completely decoupled interface and prediction services, bridging a FastAPI Python core to the React frontend.

---

## 🛠️ Technology Stack

*   **AI/ML:** YOLOv8 (Ultralytics `det` + `seg`), PyTorch, OpenCV, NumPy, google-generativeai (Gemini)
*   **Backend:** Python 3.10+, FastAPI, Uvicorn, Pydantic, Pillow, python-dotenv
*   **Frontend:** React 18, JavaScript (ESM), Vite 5, Tailwind CSS, Framer Motion, React Router DOM, Axios, Recharts, React Dropzone, Lucide React
*   **Testing/QA:** Pytest, HTTPX, Ruff, GitHub Actions CI/CD
*   **AI Assistant:** Google Gemini (`gemini-2.5-flash`, env-configurable), scope-limited via system instructions
*   **Deployment:** Vercel (React SPA) + Render (FastAPI/PyTorch CPU), Docker, GitHub Actions CI/CD

---

## 📁 Project Structure

```
CardioVision/
├── stenosis-detection/
│   ├── backend/
│   │   ├── main.py               # FastAPI app factory + lifespan
│   │   ├── app/
│   │   │   ├── config.py         # env-driven settings, CORS, model registry
│   │   │   ├── schemas.py        # Pydantic request/response models
│   │   │   ├── services/
│   │   │   │   ├── yolo.py       # model cache, inference, heatmap generation
│   │   │   │   └── stenosis.py   # pure stenosis % + severity functions
│   │   │   └── routers/
│   │   │       ├── health.py     # GET /api/health
│   │   │       ├── predict.py    # POST /api/predict
│   │   │       ├── models.py     # GET /api/models/comparison
│   │   │       └── chat.py       # POST /api/health-chat
│   │   ├── models/               # YOLOv8 .pt weight files
│   │   ├── tests/                # pytest suite (unit + integration)
│   │   ├── Dockerfile
│   │   └── requirements*.txt
│   ├── frontend/                 # Vite + React SPA
│   └── training/                 # reproducible YOLOv8 fine-tuning scripts
├── render.yaml                   # declarative Render deploy (backend)
├── .github/workflows/ci.yml      # lint + test + build on push/PR
└── METRICS.md                    # provenance for every performance number
```

---

## 🚀 Running the Project Locally

### 1. Backend (FastAPI / YOLOv8)
Ensure you have Python 3.10+ installed on your machine.
```bash
# Navigate to the backend directory
cd stenosis-detection/backend

# Install the Python dependencies
pip install -r requirements.txt

# Boot the FastAPI server architecture
python main.py
```
*The server will boot and listen for inferences at `http://localhost:8000`*

### 2. Frontend (Vite / React)
Ensure you have Node.js 18+ installed on your machine.
```bash
# Navigate to the frontend directory
cd stenosis-detection/frontend

# Install node module allocations
npm install

# Boot the frontend local development engine
npm run dev
```
*The UI will broadcast natively at `http://localhost:5173`. In dev, `/api/*` calls are proxied to the backend by `vite.config.js`.*

---

## 🧪 Tests

```bash
cd stenosis-detection/backend
pip install -r requirements-dev.txt
python -m pytest -q        # 14 tests (unit + integration)
ruff check .               # lint
```

The stenosis algorithm tests are dependency-free; API tests skip automatically when the ML stack/weights are unavailable.

---

## 🐳 Docker & Deployment

```bash
# Build the backend image
cd stenosis-detection/backend
docker build -t cardiovision-backend .
docker run -p 8000:8000 cardiovision-backend
```

Deployment is fully declarative:

*   **Backend → Render:** import `render.yaml` (Blueprint) or point Render at the repo. Set `GEMINI_API_KEY` in the dashboard. Free tier cold-starts ~30-60s — the frontend surfaces a cold-start notice while the model loads.
*   **Frontend → Vercel:** Framework Preset `Vite`, Root Directory `stenosis-detection/frontend`, Build `npm run build`, Output `dist`. Set the env var `VITE_API_BASE_URL` to the Render backend URL, otherwise the SPA falls back to it in code.
*   **CI/CD:** `.github/workflows/ci.yml` runs ruff + pytest (backend) and `npm run build` (frontend) on every push/PR.

---

## 🧠 Training & Metrics Provenance

Reproducible fine-tuning lives in `training/`:

```bash
cd stenosis-detection/training
python train.py --model s --data data.yaml --epochs 150 --batch 16
```

Every performance number shown on the site or quoted externally is mapped to its source — including the ARCADE vs CADICA attribution of the 94.4% mAP@0.5 / 0.91 F1 headline (detection on CADICA, not segmentation on ARCADE) — in [`METRICS.md`](METRICS.md). Read it before quoting metrics in interviews or docs.

---

## 📊 Analytical Scope

This platform is rigorously trained across clinical variances involving the **ARCADE** (3000+ COCO-format samples) and **CADICA** external validation datasets to evaluate zero-shot scalability against multi-lesion occlusion instances.

> **Disclaimer:** *CardioVision is engineered purely for academic data science, diagnostic methodology research, and technical deployment demonstrations. It is strictly not licensed for real-world clinical application or primary medical diagnoses.*
