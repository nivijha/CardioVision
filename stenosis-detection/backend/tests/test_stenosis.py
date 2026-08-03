"""Unit tests for the geometric stenosis algorithm (no ML dependencies)."""

import pytest

from app.services.stenosis import classify_severity, estimate_diameter_reduction


class TestEstimateDiameterReduction:
    def test_square_box_is_minimal(self):
        # A roughly circular vessel -> square-ish box -> ~20% (no narrowing).
        assert estimate_diameter_reduction([0, 0, 100, 100], (512, 512)) == pytest.approx(20.0)

    def test_elongated_box_raises_percent(self):
        square = estimate_diameter_reduction([0, 0, 100, 100], (512, 512))
        narrow = estimate_diameter_reduction([0, 0, 100, 10], (512, 512))
        assert narrow > square

    def test_extreme_narrow_box_is_clipped(self):
        # short/long -> 0.01 -> percent would exceed 95 without the clip.
        assert estimate_diameter_reduction([0, 0, 1000, 1], (512, 512)) <= 95.0

    def test_degenerate_zero_width_is_safe(self):
        # Collapsed box must not divide by zero (guarded to min axis 1.0).
        pct = estimate_diameter_reduction([100, 100, 100, 100], (512, 512))
        assert pct == 20.0

    def test_exact_half_width(self):
        # 100x50 box: raw = 0.5 -> 20 + 37.5 = 57.5
        assert estimate_diameter_reduction([0, 0, 100, 50], (512, 512)) == pytest.approx(57.5)

    def test_bbox_values_are_floats(self):
        # The caller (FastAPI) may hand over float lists; ensure no TypeError.
        pct = estimate_diameter_reduction([10.0, 20.0, 110.0, 20.0], (512, 512))
        assert isinstance(pct, float)


class TestClassifySeverity:
    def test_all_brackets(self):
        assert classify_severity(10.0) == "minimal"
        assert classify_severity(24.9) == "minimal"
        assert classify_severity(25.0) == "mild"
        assert classify_severity(49.9) == "mild"
        assert classify_severity(50.0) == "moderate"
        assert classify_severity(69.9) == "moderate"
        assert classify_severity(70.0) == "severe"
        assert classify_severity(89.9) == "severe"
        assert classify_severity(90.0) == "occlusion"
        assert classify_severity(100.0) == "occlusion"

    def test_end_to_end(self):
        # 100x50 box -> 57.5% -> moderate
        pct = estimate_diameter_reduction([0, 0, 100, 50], (512, 512))
        assert classify_severity(pct) == "moderate"
