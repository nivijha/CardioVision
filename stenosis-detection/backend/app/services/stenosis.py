"""Pure functions for stenosis severity estimation and classification.

Kept dependency-free (no numpy/torch/ultralytics) so the algorithm can be
unit-tested in isolation and imported by any consumer without pulling in the
ML stack.
"""

from typing import List, Tuple


def estimate_diameter_reduction(bbox: List[float], img_shape: Tuple[int, int]) -> float:
    """Estimate % stenosis from bounding box short-axis / long-axis ratio.

    Intuition: a healthy artery cross-section is roughly circular, so its
    bounding box is close to a square (ratio ~0). A narrowed segment has an
    elongated box (ratio -> 1). Mapped to [20, 95] because complete occlusion
    cannot be verified from a single 2D projection.
    """
    x1, y1, x2, y2 = bbox
    box_w = max(x2 - x1, 1.0)
    box_h = max(y2 - y1, 1.0)
    short_axis = min(box_w, box_h)
    long_axis = max(box_w, box_h)
    raw = 1.0 - (short_axis / long_axis)  # 0 = round box, 1 = very narrow
    percent = 20.0 + raw * 75.0           # maps to [20, 95]
    return round(min(max(percent, 20.0), 95.0), 1)


def classify_severity(pct: float) -> str:
    """Map a stenosis percentage to a clinical severity bracket."""
    if pct < 25:
        return "minimal"
    if pct < 50:
        return "mild"
    if pct < 70:
        return "moderate"
    if pct < 90:
        return "severe"
    return "occlusion"
