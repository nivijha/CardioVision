import { useState, useCallback, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Eye, Layers, Download, RotateCcw, CheckCircle, AlertCircle, Image as ImageIcon, FileCheck } from 'lucide-react';
import axios from 'axios';

export default function Predict() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [result, setResult] = useState(null);
  const [viewMode, setViewMode] = useState('detection');
  const [selectedModel, setSelectedModel] = useState('YOLOv8m');
  const [error, setError] = useState(null);

  const primaryDetection = result?.detections?.[0] || result;
  const detectionCount = result?.detections?.length || 0;

  const detectionModels = [
    { id: 'YOLOv8n', name: 'YOLOv8 Nano', description: 'Fastest, lightweight model' },
    { id: 'YOLOv8s', name: 'YOLOv8 Small', description: 'Balanced speed and accuracy' },
    { id: 'YOLOv8m', name: 'YOLOv8 Medium', description: 'High accuracy, standard choice' },
  ];

  const segmentationModels = [
    { id: 'YOLOv8n-seg', name: 'YOLOv8 Nano-Seg', description: 'Fast segmentation model' },
    { id: 'YOLOv8s-seg', name: 'YOLOv8 Small-Seg', description: 'Balanced segmentation' },
    { id: 'YOLOv8m-seg', name: 'YOLOv8 Medium-Seg', description: 'High accuracy segmentation' },
  ];

  const currentModels = viewMode === 'detection' ? detectionModels : segmentationModels;

  useEffect(() => {
    // Update selected model when view mode changes
    if (viewMode === 'detection') {
      setSelectedModel('YOLOv8m');
    } else if (viewMode === 'segmentation') {
      setSelectedModel('YOLOv8m-seg');
    }
  }, [viewMode]);

  const stages = [
    { id: 'upload', label: 'Uploading', icon: Upload },
    { id: 'analyze', label: 'Analyzing', icon: Eye },
    { id: 'complete', label: 'Complete', icon: CheckCircle },
  ];

  const handlePredict = useCallback(async (file) => {
    setLoading(true);
    setError(null);
    setProcessingStage('upload');

    try {
      await new Promise(r => setTimeout(r, 500));
      setProcessingStage('analyze');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('model', selectedModel);

      const API_URL = import.meta.env.DEV 
        ? 'http://localhost:8000/predict' 
        : 'https://cardiovision-bt72.onrender.com/predict';

      const response = await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setProcessingStage('complete');
      setResult(response.data);

      await new Promise(r => setTimeout(r, 800));
    } catch (err) {
      setError(err.message || 'Failed to process image');
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedModel]);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setError(null);

    await handlePredict(file);
  }, [handlePredict]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.bmp', '.tiff'],
    },
    multiple: false,
  });

  const prevModelRef = useRef(selectedModel);

  useEffect(() => {
    if (selectedFile && !loading && result && prevModelRef.current !== selectedModel) {
      handlePredict(selectedFile);
    }
    prevModelRef.current = selectedModel;
  }, [selectedModel, selectedFile, loading, result, handlePredict]);

  // Auto-scroll to heatmap when available
  useEffect(() => {
    if (result && (result.overlay_b64 || result.heatmap_b64)) {
      setTimeout(() => {
        const heatmapSection = document.querySelector('[data-heatmap-section]');
        if (heatmapSection) {
          heatmapSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [result]);

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    setProcessingStage('');
    setViewMode('detection');
  };

  const handleDownload = () => {
    if (!previewUrl || !result) return;

    const link = document.createElement('a');
    link.href = previewUrl;
    link.download = `stenosis-analysis-${Date.now()}.png`;
    link.click();
  };

  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'mild': return 'badge-soft-success';
      case 'moderate': return 'badge-soft-warning';
      case 'severe': return 'badge-soft-danger';
      default: return 'bg-warm-sand text-warm-secondary';
    }
  };

  return (
    <div className="min-h-screen py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-semibold mb-3 tracking-tight text-warm-text">
            Analysis Tool
          </h1>
          <p className="text-warm-secondary text-lg max-w-2xl mx-auto mb-4">
            Upload an angiography image for automated detection and segmentation of coronary artery stenosis using YOLOv8 models.
          </p>
          <div className="inline-block bg-warm-primary/10 border border-warm-primary/30 rounded-lg px-4 py-2.5 max-w-2xl">
            <p className="text-xs text-warm-text font-medium">
              <strong>⚠️ Research Disclaimer:</strong> This tool is designed for research and educational purposes only. Results are not intended for clinical use or diagnosis. Always consult qualified medical professionals for clinical decisions.
            </p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="card rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center text-warm-text">
                <Upload className="w-5 h-5 mr-2 text-warm-primary" />
                Image Upload
              </h2>

              {!selectedFile ? (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                    isDragActive
                      ? 'border-warm-primary bg-warm-sand'
                      : 'border-warm-border hover:border-warm-primary hover:bg-warm-sand/50'
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="w-16 h-16 rounded-2xl bg-warm-sand flex items-center justify-center mx-auto mb-4">
                    <ImageIcon className="w-8 h-8 text-warm-primary" />
                  </div>
                  <p className="text-warm-text font-medium mb-2">
                    {isDragActive ? 'Drop the image here' : 'Drag & drop an image here'}
                  </p>
                  <p className="text-sm text-warm-tertiary">
                    or click to select (PNG, JPG, BMP)
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <div className="aspect-square rounded-2xl overflow-hidden bg-warm-sand border border-warm-border">
                    <img
                      src={previewUrl}
                      alt="Uploaded angiography"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <button
                    onClick={handleReset}
                    className="absolute top-3 right-3 p-2.5 rounded-xl bg-warm-surface/90 backdrop-blur text-warm-secondary hover:text-warm-danger hover:bg-warm-danger/10 transition-all shadow-soft"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {loading && (
                    <div className="absolute inset-0 bg-warm-surface/90 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <div className="text-center">
                        <div className="relative w-16 h-16 mx-auto mb-4">
                          <div className="absolute inset-0 rounded-full border-4 border-warm-sand" />
                          <div className="absolute inset-0 rounded-full border-4 border-warm-primary border-t-transparent animate-spin" />
                        </div>
                        <p className="text-warm-text font-medium">Analyzing image...</p>
                        <p className="text-sm text-warm-secondary">Running YOLOv8 inference</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 rounded-xl bg-warm-danger/10 border border-warm-danger/30 flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-warm-danger" />
                  <span className="text-warm-danger">{error}</span>
                </div>
              )}
            </div>

            {/* Processing Stages */}
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card rounded-2xl p-5"
              >
                <div className="flex items-center justify-between">
                  {stages.map((stage, index) => {
                    const isComplete = stage.id === 'complete';
                    const isCurrent = stage.id === processingStage;
                    const isPast = stages.findIndex(s => s.id === processingStage) > index;

                    return (
                      <div key={stage.id} className="flex items-center">
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            isPast || isComplete
                              ? 'bg-warm-success text-white'
                              : isCurrent
                                ? 'bg-warm-primary text-white shadow-soft'
                                : 'bg-warm-sand text-warm-tertiary'
                          }`}>
                            {isPast || isComplete ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              <stage.icon className={`w-5 h-5 ${isCurrent ? 'animate-pulse' : ''}`} />
                            )}
                          </div>
                          <span className={`text-xs mt-2 font-medium ${
                            isPast || isComplete ? 'text-warm-success' : isCurrent ? 'text-warm-primary' : 'text-warm-tertiary'
                          }`}>
                            {stage.label}
                          </span>
                        </div>
                        {index < stages.length - 1 && (
                          <div className={`w-10 h-1 mx-2 rounded-full transition-all ${
                            isPast || isComplete ? 'bg-warm-success' : 'bg-warm-sand'
                          }`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="card rounded-2xl p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold flex items-center text-warm-text">
                  <CheckCircle className="w-5 h-5 mr-2 text-warm-primary" />
                  Analysis Results
                </h2>
                {result && (
                  <button
                    onClick={handleDownload}
                    className="p-2.5 rounded-xl bg-warm-sand text-warm-secondary hover:text-warm-primary hover:bg-warm-primary/10 transition-all"
                    title="Download Results"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                )}
              </div>

              {!result && !loading && (
                <div className="h-80 flex items-center justify-center text-warm-tertiary">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-warm-sand flex items-center justify-center mx-auto mb-4">
                      <Eye className="w-8 h-8 opacity-50" />
                    </div>
                    <p className="font-medium">Upload an image to see analysis results</p>
                    <p className="text-sm mt-1">Results will appear here</p>
                  </div>
                </div>
              )}

              {result && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-5"
                >
                  <div className="card rounded-xl p-5 border-warm-border">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-warm-secondary font-medium">Detection Status</span>
                      <span className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                        result.stenosis
                          ? 'bg-warm-success/10 text-warm-success border border-warm-success/30'
                          : 'bg-warm-sand text-warm-secondary'
                      }`}>
                        {result.stenosis ? 'Stenosis Detected' : 'No Stenosis'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-warm-secondary font-medium">Stenosis %</span>
                      <span className="font-semibold text-warm-text">{(result.stenosis_percent ?? 0).toFixed(1)}%</span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-warm-secondary font-medium">Severity</span>
                        <span
                          className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getSeverityClass(primaryDetection?.severity || result?.severity)}`}
                        >
                          {(primaryDetection?.severity || result?.severity || 'none').toUpperCase()}
                        </span>
                      </div>
                      <div className="p-3 rounded-lg bg-warm-sand/50 border border-warm-border">
                        <p className="text-xs text-warm-secondary leading-relaxed">
                          <strong>How Severity is Calculated:</strong><br />
                          Severity is estimated from the stenosis percentage based on clinical thresholds:<br />
                          • <strong>Minimal:</strong> &lt; 25%<br />
                          • <strong>Mild:</strong> 25–50%<br />
                          • <strong>Moderate:</strong> 50–70%<br />
                          • <strong>Severe:</strong> 70–90%<br />
                          • <strong>Occlusion:</strong> &gt; 90%
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 text-sm text-warm-secondary">
                      Detected lesions: <span className="font-semibold text-warm-text">{detectionCount}</span>
                    </div>
                  </div>

                  {result.overlay_b64 || result.heatmap_b64 ? (
                    <motion.div
                      data-heatmap-section
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="card rounded-xl p-5 border-warm-border"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-warm-secondary font-medium">Region Intensity Heatmap</span>
                        <span className="text-xs text-warm-tertiary">Detection confidence-weighted map</span>
                      </div>
                      {result.overlay_b64 ? (
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-warm-tertiary mb-2">Heatmap Overlay (JET colormap)</p>
                            <div className="aspect-video rounded-xl overflow-hidden bg-warm-sand border border-warm-border">
                              <img
                                src={`data:image/png;base64,${result.overlay_b64}`}
                                alt="Heatmap overlay"
                                className="w-full h-full object-contain"
                              />
                            </div>
                          </div>
                          {result.heatmap_b64 && (
                            <div>
                              <p className="text-xs text-warm-tertiary mb-2">Raw Heatmap</p>
                              <div className="aspect-video rounded-xl overflow-hidden bg-warm-sand border border-warm-border">
                                <img
                                  src={`data:image/png;base64,${result.heatmap_b64}`}
                                  alt="Raw heatmap"
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-4 rounded-lg bg-warm-warning/10 border border-warm-warning/30 text-center">
                          <p className="text-sm text-warm-secondary">Heatmap data received but not rendering properly. Check browser console for details.</p>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <div className="card rounded-xl p-5 border-warm-border">
                      <p className="text-xs text-warm-tertiary text-center py-6">
                        ℹ️ Heatmap generation in progress or not available for this detection
                      </p>
                    </div>
                  )}

                  {viewMode === 'segmentation' && result.mask_b64 && (
                    <div className="card rounded-xl p-5 border-warm-border">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-warm-secondary font-medium">Segmented Artery</span>
                        <span className="text-xs text-warm-tertiary">Visible mask overlay</span>
                      </div>
                      <div className="aspect-video rounded-xl overflow-hidden bg-warm-sand border border-warm-border">
                        <img
                          src={`data:image/png;base64,${result.mask_b64}`}
                          alt="Segmentation mask"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  )}

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <button
                      onClick={handleReset}
                      className="w-full btn-secondary py-3.5 rounded-xl flex items-center justify-center space-x-2 font-medium"
                    >
                      <RotateCcw className="w-5 h-5" />
                      <span>Try Another Image</span>
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
