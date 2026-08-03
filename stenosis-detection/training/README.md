# CardioVision Training

Reproducible fine-tuning scripts for the YOLOv8 segmentation models served by the backend.

## Why this folder exists

Every performance number on the site and the resume should trace back to a
run you can re-create. This folder makes the training reproducible and gives
you artifacts (`results.csv`, `metrics.json`, `best.pt`) to point to in
interviews instead of hardcoded constants.

## Quickstart

```bash
# 1. Prepare the ARCADE dataset (COCO -> YOLO format, single class "stenosis")
#    into ../data/arcade per data.yaml.

# 2. Fine-tune each variant from COCO-pretrained weights.
python train.py --model n --data data.yaml --epochs 150 --batch 32
python train.py --model s --data data.yaml --epochs 150 --batch 16
python train.py --model m --data data.yaml --epochs 150 --batch 8

# 3. Checkpoint + metrics land in runs/segment/yolov8<size>-seg-arcade/
#    best.pt        <- copy to ../backend/models/YOLOv8<X>-seg-best.pt
#    results.csv    <- commit this so the Results page has provenance
#    metrics.json   <- machine-readable summary
```

Augmentation (mosaic, mixup, HSV jitter, flips) is enabled by Ultralytics
defaults and is the main lever that lets a ~1.5k-image medical dataset
fine-tune without severe overfitting. Early stopping is on via `--patience`.

## Evaluation

To validate a trained model on an external set (e.g. CADICA zero-shot):

```bash
python -c "
from ultralytics import YOLO
m = YOLO('runs/segment/yolov8s-seg-arcade/best.pt')
r = m.val(data='data/cadica.yaml', split='test')
print(r.results_dict)
"
```

## Notes for honesty in interviews

- `runs/**` and imaging data are gitignored; commit `metrics.json` / `results.csv` only.
- If a headline number (e.g. 94.4% mAP@0.5) came from a detection-only model,
  record that explicitly — see `../METRICS.md`.
