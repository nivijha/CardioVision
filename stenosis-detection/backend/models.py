"""Data models and type definitions for Stenosis Detection API."""

from pydantic import BaseModel, Field
from typing import List, Optional


class DetectionItem(BaseModel):
    """Single detection result."""
    bbox: List[float] = Field(..., description="Bounding box [x1, y1, x2, y2]")
    confidence: float = Field(..., ge=0, le=1, description="Detection confidence score")
    severity: str = Field(..., description="Severity classification")
    stenosis_percent: float = Field(..., ge=0, le=100, description="Stenosis percentage")
    mask_b64: Optional[str] = Field(None, description="Base64-encoded segmentation mask")


class StenosisResult(BaseModel):
    """Detection or segmentation inference result."""
    stenosis: bool = Field(..., description="Whether stenosis was detected")
    confidence: float = Field(..., ge=0, le=1, description="Primary detection confidence")
    severity: str = Field(..., description="Overall severity classification")
    stenosis_percent: float = Field(..., ge=0, le=100, description="Overall stenosis percentage")
    bbox: List[float] = Field(..., description="Primary bounding box")
    mask_b64: Optional[str] = Field(None, description="Primary segmentation mask")
    heatmap_b64: Optional[str] = Field(None, description="Heatmap visualization")
    overlay_b64: Optional[str] = Field(None, description="Heatmap overlay on original image")
    detections: List[DetectionItem] = Field(default_factory=list, description="All detections")
    model_used: str = Field(..., description="Model name used for inference")
    processing_time: float = Field(..., ge=0, description="Processing time in seconds")


class HealthCheckResponse(BaseModel):
    """Health check response."""
    status: str = Field(..., description="Status: 'ok' or 'error'")
    available_models: List[str] = Field(default_factory=list)


class ModelMetrics(BaseModel):
    """Model performance metrics."""
    name: str
    map50: float
    precision: float
    recall: float
    iou: float
    params_millions: float
    inference_time_ms: float
    available: bool


class ComparisonResponse(BaseModel):
    """Model comparison response."""
    detection_models: List[ModelMetrics]
    segmentation_models: List[ModelMetrics]
