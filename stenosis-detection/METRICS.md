# CardioVision — Metrics Provenance

Every performance number you quote should have a **source** and a **task/dataset
attribution**. This file maps the figures used on the site and in the resume to
where they actually live, and flags the ones that are currently **hardcoded UI
constants** (no training artifact yet committed).

## 1. Model benchmarking table (backend `MODEL_STATS`)

Source: `backend/main.py` → `MODEL_STATS` (also mirrored in
`frontend/src/utils/modelConstants.js`). These are the **segmentation** models.

| Variant | Params | mAP@0.5 | Precision | Recall | IoU | Forward pass* |
|---|---|---|---|---|---|---|
| YOLOv8n-seg | 3.2M | 0.758 | 0.78 | 0.71 | 0.68 | 15 ms |
| YOLOv8s-seg | 11.8M | 0.801 | 0.82 | 0.76 | 0.73 | 28 ms |
| YOLOv8m-seg | 27.3M | 0.849 | 0.87 | 0.82 | 0.79 | 52 ms |

*`inference_time_ms` is the **GPU forward pass**, not end-to-end REST latency.
On the Render CPU instance the real end-to-end time is ~1–3 s per image.

## 2. Dataset-specific tables (frontend `Results.jsx`)

Source: `frontend/src/pages/Results.jsx` (hardcoded strings; **no training
artifacts committed yet**).

### ARCADE — Segmentation
| Model | Precision | Recall | mAP@0.5 | mAP@0.5:0.95 | F1 |
|---|---|---|---|---|---|
| YOLOv8n | 0.421 | 0.381 | 0.327 | 0.120 | 0.41 |
| YOLOv8s | 0.447 | 0.413 | 0.354 | 0.124 | 0.43 |
| YOLOv8m | 0.438 | 0.403 | 0.375 | 0.138 | 0.42 |

### ARCADE — Detection
| Model | Precision | Recall | mAP@0.5 | mAP@0.5:0.95 | F1 |
|---|---|---|---|---|---|
| YOLOv8n | 0.327 | 0.323 | 0.262 | 0.095 | 0.32 |
| YOLOv8s | 0.305 | 0.335 | 0.223 | 0.085 | 0.32 |
| YOLOv8m | 0.193 | 0.323 | 0.168 | 0.061 | 0.24 |

### CADICA — Detection (external zero-shot validation)
| Model | Precision | Recall | mAP@0.5 | mAP@0.5:0.95 | F1 |
|---|---|---|---|---|---|
| YOLOv8n | 0.905 | 0.850 | 0.940 | 0.550 | 0.87 |
| **YOLOv8s** | **0.915** | **0.903** | **0.944** | **0.561** | **0.91** |
| YOLOv8m | 0.559 | 0.430 | 0.475 | 0.207 | 0.49 |

## 3. Mapping the resume headline

> "94.4% mAP@0.5 and 0.91 F1-score"

- **Task:** *detection* (bounding boxes only), **not** segmentation.
- **Dataset:** **CADICA** external validation set (YOLOv8s row above).
- **Why the discrepancy with 0.801?** That number is *segmentation* mAP@0.5
  (mask IoU is a stricter metric than box IoU). Segmentation mAP is always lower
  than detection mAP for the same model.
- **Warning:** one prep doc claims 94.4% is an ARCADE detection result; the
  code (`Results.jsx`) says CADICA. Trust the code — quote **CADICA detection**.

> "1,500 angiography images"

- ARCADE is **~3,000** COCO-format samples (README/Home page). "1,500" is the
  fine-tune/validation split used in prep docs. Quote it as **a ~1.5k-image
  split of ARCADE** or drop the count.

> "28ms real-time inference"

- That is the **GPU forward pass** for YOLOv8s-seg. On Render CPU it is 1–3 s.
  Say "28 ms forward pass (GPU); ~1–3 s end-to-end on our CPU deployment."

## 4. Known inconsistencies to fix before interviews

1. **ARCADE segmentation mAP@0.5 differs between sources:** `Results.jsx` says
   YOLOv8s = 0.354, but `MODEL_STATS` says 0.801. One of them is stale or they
   measure different splits. Re-run validation via `training/train.py` + `model.val()`
   and make both sources read from one committed `metrics.json`.
2. No training artifacts (`results.csv`, `metrics.json`) are committed yet — the
   `training/` folder and this doc are the fix.
3. Only `YOLOv8s-seg-best.pt` and `YOLOv8s-det.pt` are committed; n/m weights
   are not, so `/api/health` reports them unavailable. The benchmark tables are
   still the evidence for the "3 variants" claim.

## 5. How to make a number reproducible

1. Run `python training/train.py --model s --data training/data.yaml`.
2. `best.pt` → `backend/models/`, commit `results.csv` + `metrics.json`.
3. Point the Results page / `MODEL_STATS` at the committed JSON instead of
   hardcoded values.
