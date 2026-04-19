"""
Quick debug script — runs inference directly without FastAPI.
Run from the backend directory: python debug_test.py
"""
import sys
import traceback
import numpy as np
from PIL import Image
import os

MODELS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models")
MODEL_PATH = os.path.join(MODELS_DIR, "YOLOv8m-seg-best.pt")

print(f"Python: {sys.version}")
print(f"Models dir: {MODELS_DIR}")
print(f"Model file exists: {os.path.exists(MODEL_PATH)}")
print()

# --- 1. Check ultralytics ---
try:
    from ultralytics import YOLO
    print(f"✅ ultralytics imported OK")
except Exception as e:
    print(f"❌ ultralytics import failed: {e}")
    sys.exit(1)

# --- 2. Load model ---
try:
    model = YOLO(MODEL_PATH)
    print(f"✅ Model loaded: {MODEL_PATH}")
except Exception as e:
    print(f"❌ Model load failed:\n{traceback.format_exc()}")
    sys.exit(1)

# --- 3. Run inference on a tiny dummy image ---
try:
    dummy = np.zeros((256, 256, 3), dtype=np.uint8)
    dummy[80:176, 80:176] = 128   # grey square as placeholder
    pil_img = Image.fromarray(dummy)
    print(f"✅ Dummy image created: {pil_img.size}")

    results = model(dummy, conf=0.25, iou=0.45, verbose=True)
    print(f"✅ Inference ran OK — {len(results)} result(s)")

    r = results[0]
    print(f"   boxes: {len(r.boxes)}")
    print(f"   masks: {r.masks}")
except Exception as e:
    print(f"❌ Inference failed:\n{traceback.format_exc()}")
    sys.exit(1)

print("\n✅ All checks passed — the model works correctly.")
