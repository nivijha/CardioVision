"""Pydantic request/response schemas for the CardioVision API."""

from typing import List, Optional

from pydantic import BaseModel, Field


class DetectionItem(BaseModel):
    """A single detected lesion."""

    bbox: List[float] = Field(..., description="Bounding box [x1, y1, x2, y2]")
    confidence: float = Field(..., ge=0, le=1, description="Detection confidence score")
    severity: str = Field(..., description="Severity classification")
    stenosis_percent: float = Field(..., ge=0, le=100, description="Stenosis percentage")
    mask_b64: Optional[str] = Field(None, description="Base64-encoded segmentation mask")


class StenosisResult(BaseModel):
    """Detection or segmentation inference result."""

    stenosis: bool
    confidence: float = Field(..., ge=0, le=1)
    severity: str
    stenosis_percent: float = Field(..., ge=0, le=100)
    bbox: List[float]
    mask_b64: Optional[str] = None
    heatmap_b64: Optional[str] = None
    overlay_b64: Optional[str] = None
    detections: List[DetectionItem] = Field(default_factory=list)
    model_used: str
    processing_time: float = Field(..., ge=0)


class HealthCheckResponse(BaseModel):
    """Health check payload."""

    status: str
    available_models: List[str] = Field(default_factory=list)


class ModelMetrics(BaseModel):
    """Benchmark row for a single model variant."""

    name: str
    map50: float
    precision: float
    recall: float
    iou: float
    params_millions: float
    inference_time_ms: float
    available: bool


class ComparisonResponse(BaseModel):
    """Model comparison payload."""

    detection_models: List[ModelMetrics]
    segmentation_models: List[ModelMetrics]


class ChatMessage(BaseModel):
    """One message in the chatbot history."""

    role: str
    content: str


class ChatRequest(BaseModel):
    """Chatbot request with diagnosis context."""

    severity: str
    stenosis_percent: float
    messages: List[ChatMessage]
