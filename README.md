# CardioVision 🫀
**Automated Coronary Artery Stenosis Detection & Segmentation**

CardioVision is an AI-powered diagnostic companion built to rigorously localize and extract arterial blockages (stenosis) directly from routine coronary angiography imaging. Utilizing a state-of-the-art dual inference pipeline via **YOLOv8**, CardioVision computes exact physical occlusion percentages while securely mapping bounding boxes and vessel segmentation data into an elegant, academic-grade web interface.

---

## 🔬 Core Features

*   **Dual Inference Pipeline:** Simultaneously coordinates `YOLOv8s-det` logic and `YOLOv8s-seg` isolation to ensure pixel-perfect lesion detection without muddying structural boundaries.
*   **Transparent Diagnostics:** Immediately evaluates severity brackets (Minimal, Mild, Moderate, Severe, Occlusion) natively derived from maximum bounding-box short/long axis differential algorithms.
*   **IEEE-Style Interface:** Features a strictly minimal, tech-forward research presentation utilizing Vite/React and strict Framer Motion heuristics.
*   **Drop-In APIs:** Completely decoupled interface and prediction services, bridging a FastAPI Python core to the React frontend.

---

## 🛠️ Technology Stack

*   **Frontend End:** React 18, Vite, Tailwind CSS, Framer Motion, Axios
*   **Backend End:** FastAPI, Ultralytics YOLOv8, PyTorch, Py-OpenCV, Uvicorn
*   **Deployment Architecture:** Configured for Vercel (Frontend) and Render (Backend - PyTorch CPU-Isolated)

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
*The UI will broadcast natively at `http://localhost:5173`*

---

## 🧪 Analytical Scope

This platform is rigorously trained across clinical variances involving the **ARCADE** (3000+ COCO-format samples) and **CADICA** external validation datasets to evaluate zero-shot scalability against multi-lesion occlusion instances. 

> **Disclaimer:** *CardioVision is engineered purely for academic data science, diagnostic methodology research, and technical deployment demonstrations. It is strictly not licensed for real-world clinical application or primary medical diagnoses.*
