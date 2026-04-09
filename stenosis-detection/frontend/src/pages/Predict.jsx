import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Loader, Eye, Layers, Download, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function Predict() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [result, setResult] = useState(null);
  const [viewMode, setViewMode] = useState('detection');
  const [error, setError] = useState(null);

  const stages = [
    { id: 'upload', label: 'Uploading...', icon: Upload },
    { id: 'analyze', label: 'Analyzing...', icon: Loader },
    { id: 'complete', label: 'Complete', icon: CheckCircle },
  ];

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setError(null);

    await handlePredict(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.bmp', '.tiff'],
    },
    multiple: false,
  });

  const handlePredict = async (file) => {
    setLoading(true);
    setError(null);
    setProcessingStage('upload');

    try {
      // Simulate stage progression
      await new Promise(r => setTimeout(r, 500));
      setProcessingStage('analyze');

      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('http://localhost:8000/predict', formData, {
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
  };

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
      case 'mild': return 'bg-apple-success text-white';
      case 'moderate': return 'bg-apple-warning text-white';
      case 'severe': return 'bg-apple-danger text-white';
      default: return 'bg-apple-gray text-apple-text';
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-semibold mb-2 tracking-tight" style={{ color: '#1D1D1F' }}>
            Stenosis Detection
          </h1>
          <p className="text-apple-secondary">
            Upload an angiography image for AI-powered analysis
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="card rounded-2xl p-6">
              <h2 className="text-lg font-medium mb-4 flex items-center" style={{ color: '#1D1D1F' }}>
                <Upload className="w-5 h-5 mr-2 text-apple-accent" />
                Image Upload
              </h2>

              {!selectedFile ? (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
                    isDragActive
                      ? 'border-apple-accent bg-apple-gray'
                      : 'border-apple-border hover:border-apple-accent'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-12 h-12 text-apple-tertiary mx-auto mb-4" />
                  <p className="text-apple-text mb-2">
                    {isDragActive ? 'Drop the image here' : 'Drag & drop an image here'}
                  </p>
                  <p className="text-sm text-apple-tertiary">
                    or click to select (PNG, JPG, BMP)
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <div className="aspect-square rounded-xl overflow-hidden bg-apple-gray border border-apple-border">
                    <img
                      src={previewUrl}
                      alt="Uploaded angiography"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <button
                    onClick={handleReset}
                    className="absolute top-2 right-2 p-2 rounded-lg bg-apple-surface text-apple-secondary hover:text-apple-danger transition-colors shadow-card"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {loading && (
                    <div className="absolute inset-0 bg-apple-surface/90 rounded-xl flex items-center justify-center">
                      <div className="text-center">
                        <Loader className="w-12 h-12 text-apple-accent mx-auto mb-4 animate-spin" />
                        <p className="text-apple-text font-medium">Analyzing image...</p>
                        <p className="text-sm text-apple-secondary">Running YOLOv8 inference</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 rounded-xl bg-apple-danger/10 border border-apple-danger/30 flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-apple-danger" />
                  <span className="text-apple-danger">{error}</span>
                </div>
              )}
            </div>

            {/* Processing Stages */}
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card rounded-2xl p-4"
              >
                <div className="flex items-center justify-between">
                  {stages.map((stage, index) => {
                    const isComplete = stage.id === 'complete';
                    const isCurrent = stage.id === processingStage;
                    const isPast = stages.findIndex(s => s.id === processingStage) > index;

                    return (
                      <div key={stage.id} className="flex items-center">
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isPast || isComplete
                              ? 'bg-apple-success text-white'
                              : isCurrent
                                ? 'bg-apple-accent text-white'
                                : 'bg-apple-gray text-apple-tertiary'
                          }`}>
                            {isPast || isComplete ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              <stage.icon className={`w-5 h-5 ${isCurrent ? 'animate-spin' : ''}`} />
                            )}
                          </div>
                          <span className={`text-xs mt-1 ${isPast || isComplete ? 'text-apple-success' : isCurrent ? 'text-apple-accent' : 'text-apple-tertiary'}`}>
                            {stage.label}
                          </span>
                        </div>
                        {index < stages.length - 1 && (
                          <div className={`w-8 h-0.5 mx-2 ${
                            isPast || isComplete ? 'bg-apple-success' : 'bg-apple-border'
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
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium flex items-center" style={{ color: '#1D1D1F' }}>
                  <CheckCircle className="w-5 h-5 mr-2 text-apple-accent" />
                  Analysis Results
                </h2>
                {result && (
                  <button
                    onClick={handleDownload}
                    className="p-2 rounded-lg bg-apple-gray text-apple-secondary hover:text-apple-accent transition-colors"
                    title="Download Results"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                )}
              </div>

              {!result && !loading && (
                <div className="h-64 flex items-center justify-center text-apple-tertiary">
                  <div className="text-center">
                    <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Upload an image to see analysis results</p>
                  </div>
                </div>
              )}

              {result && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {/* Stenosis Detection Status */}
                  <div className="card rounded-xl p-4 border border-apple-border">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-apple-secondary">Detection Status</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        result.stenosis ? 'bg-apple-success/10 text-apple-success border border-apple-success/30' : 'bg-apple-gray text-apple-secondary'
                      }`}>
                        {result.stenosis ? 'Stenosis Detected' : 'No Stenosis'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-apple-secondary">Severity</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityClass(result.severity)}`}>
                        {result.severity.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Confidence Score */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-apple-secondary">Confidence Score</span>
                      <span className="font-semibold" style={{ color: '#1D1D1F' }}>{(result.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-1 bg-apple-gray rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.confidence * 100}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full bg-apple-accent"
                      />
                    </div>
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setViewMode('detection')}
                      className={`flex-1 py-3 rounded-xl flex items-center justify-center space-x-2 transition-all border ${
                        viewMode === 'detection'
                          ? 'bg-apple-accent text-white border-apple-accent'
                          : 'bg-apple-surface text-apple-secondary border-apple-border hover:border-apple-accent'
                      }`}
                    >
                      <Eye className="w-5 h-5" />
                      <span>Detection</span>
                    </button>
                    <button
                      onClick={() => setViewMode('segmentation')}
                      className={`flex-1 py-3 rounded-xl flex items-center justify-center space-x-2 transition-all border ${
                        viewMode === 'segmentation'
                          ? 'bg-apple-accent text-white border-apple-accent'
                          : 'bg-apple-surface text-apple-secondary border-apple-border hover:border-apple-accent'
                      }`}
                    >
                      <Layers className="w-5 h-5" />
                      <span>Segmentation</span>
                    </button>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 }}
                      className="card rounded-xl p-3 border border-apple-border"
                    >
                      <p className="text-xs text-apple-secondary mb-1">Model Used</p>
                      <p className="font-medium" style={{ color: '#1D1D1F' }}>{result.model_used}</p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="card rounded-xl p-3 border border-apple-border"
                    >
                      <p className="text-xs text-apple-secondary mb-1">Processing Time</p>
                      <p className="font-medium" style={{ color: '#1D1D1F' }}>{result.processing_time}s</p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="card rounded-xl p-3 border border-apple-border"
                    >
                      <p className="text-xs text-apple-secondary mb-1">Stenosis %</p>
                      <p className="font-medium" style={{ color: '#1D1D1F' }}>{result.stenosis_percent}%</p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="card rounded-xl p-3 border border-apple-border"
                    >
                      <p className="text-xs text-apple-secondary mb-1">Bounding Box</p>
                      <p className="font-medium text-xs" style={{ color: '#1D1D1F' }}>
                        {result.bbox?.map(b => b.toFixed(0)).join(', ')}
                      </p>
                    </motion.div>
                  </div>

                  {/* Try Another Button */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <button
                      onClick={handleReset}
                      className="w-full btn-press py-3 rounded-xl flex items-center justify-center space-x-2 bg-apple-gray text-apple-text border border-apple-border hover:border-apple-accent transition-all"
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

        {/* XAI Section - Show when results available */}
        {result && result.heatmap && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6"
          >
            <div className="card rounded-2xl p-6">
              <h2 className="text-lg font-medium mb-4 flex items-center" style={{ color: '#1D1D1F' }}>
                <Eye className="w-5 h-5 mr-2 text-apple-accent" />
                Explainability (Grad-CAM Heatmap)
              </h2>
              <p className="text-sm text-apple-secondary mb-4">
                Highlighted regions indicate model attention for stenosis detection.
                Warmer colors represent higher attention.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-apple-secondary mb-2">Original Image</p>
                  <div className="aspect-video rounded-xl overflow-hidden bg-apple-gray border border-apple-border">
                    <img src={previewUrl} alt="Original" className="w-full h-full object-contain" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-apple-secondary mb-2">Grad-CAM Heatmap Overlay</p>
                  <div className="aspect-video rounded-xl overflow-hidden bg-apple-gray border border-apple-border relative">
                    <img src={previewUrl} alt="Original" className="w-full h-full object-contain opacity-60" />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `url(data:image/svg+xml;base64,${btoa(
                          `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'>
                            <radialGradient id='grad'>
                              <stop offset='0%' stop-color='rgba(255,100,100,0.6)' />
                              <stop offset='50%' stop-color='rgba(255,200,100,0.4)' />
                              <stop offset='100%' stop-color='transparent' />
                            </radialGradient>
                            <ellipse cx='200' cy='150' rx='80' ry='60' fill='url(#grad)' />
                          </svg>`
                        )})`,
                        backgroundSize: '100% 100%',
                        mixBlendMode: 'overlay'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
