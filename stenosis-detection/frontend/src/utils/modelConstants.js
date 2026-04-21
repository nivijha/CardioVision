/**
 * Model statistics and configurations
 * Keep in sync with backend/main.py MODEL_STATS
 */

export const MODEL_STATS = {
  'YOLOv8n-seg': {
    map50: 0.758,
    precision: 0.78,
    recall: 0.71,
    iou: 0.68,
    params_millions: 3.2,
    inference_time_ms: 15,
  },
  'YOLOv8s-seg': {
    map50: 0.801,
    precision: 0.82,
    recall: 0.76,
    iou: 0.73,
    params_millions: 11.8,
    inference_time_ms: 28,
  },
  'YOLOv8m-seg': {
    map50: 0.849,
    precision: 0.87,
    recall: 0.82,
    iou: 0.79,
    params_millions: 27.3,
    inference_time_ms: 52,
  },
};

/**
 * Get default fallback data for when API is unavailable
 * Matches backend format: { detection_models: [], segmentation_models: [] }
 */
export const getDefaultModelComparisonData = () => ({
  detection_models: [],
  segmentation_models: Object.entries(MODEL_STATS).map(([name, stats]) => ({
    name,
    ...stats,
    available: true,
  })),
});
