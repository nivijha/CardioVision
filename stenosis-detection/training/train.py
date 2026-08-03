"""Reproducible training script for CardioVision's YOLOv8-seg variants.

Fine-tunes COCO-pretrained YOLOv8n/s/m-seg on an ARCADE-style COCO dataset.
All artifacts (best.pt, results.csv, plots) are written under
runs/segment/<run-name>/ and a compact metrics.json is saved alongside so
results can be tracked and cited.

Example:
    python train.py --model s --data data/arcade.yaml --epochs 150 --batch 16
"""

import argparse
import json
import os
from pathlib import Path

from ultralytics import YOLO

SUPPORTED_SIZES = {"n", "s", "m", "l", "x"}


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Fine-tune a YOLOv8-seg model on coronary angiography data."
    )
    parser.add_argument("--model", choices=SUPPORTED_SIZES, default="s",
                        help="YOLOv8 size suffix (n/s/m). Default: s")
    parser.add_argument("--data", required=True,
                        help="Path to data.yaml (COCO-format segmentation dataset)")
    parser.add_argument("--epochs", type=int, default=150)
    parser.add_argument("--imgsz", type=int, default=512,
                        help="Input size in pixels (ARCADE is 512x512)")
    parser.add_argument("--batch", type=int, default=16)
    parser.add_argument("--patience", type=int, default=30,
                        help="Early-stopping patience (epochs without improvement)")
    parser.add_argument("--device", default=None,
                        help="Device override, e.g. '0' for GPU, 'cpu' for CPU")
    parser.add_argument("--name", default=None, help="Run name override")
    parser.add_argument("--seed", type=int, default=0)
    args = parser.parse_args()

    # Ultralytics downloads the COCO-pretrained weights on first use.
    model_name = f"yolov8{args.model}-seg"
    run_name = args.name or f"{model_name}-arcade"
    print(f"[train] Loading COCO-pretrained {model_name} ...")

    model = YOLO(f"{model_name}.pt")
    model.train(
        data=args.data,
        epochs=args.epochs,
        imgsz=args.imgsz,
        batch=args.batch,
        patience=args.patience,
        device=args.device,
        seed=args.seed,
        name=run_name,
        # Ultralytics defaults already enable mosaic/mixup/HSV-jitter/flip
        # augmentation, which is what lets us fine-tune on ~1.5k images.
    )

    # Persist a machine-readable summary for tracking / the Results page.
    best_metrics = model.val()
    metrics = best_metrics.results_dict if hasattr(best_metrics, "results_dict") else {}
    run_dir = Path("runs/segment") / run_name
    metrics_path = run_dir / "metrics.json"
    metrics_path.write_text(
        json.dumps({"model": model_name, "data": args.data, **metrics}, indent=2)
    )
    print(f"[train] Metrics written to {metrics_path}")
    print(json.dumps(metrics, indent=2))


if __name__ == "__main__":
    main()
