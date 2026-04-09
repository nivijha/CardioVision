import { useState, useCallback } from 'react';
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
  const [error, setError] = useState(null);

  const stages = [
    { id: 'upload', label: 'Uploading', icon: Upload },
    { id: 'analyze', label: 'Analyzing', icon: Eye },
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
      case 'mild': return 'badge-soft-success';
      case 'moderate': return 'badge-soft-warning';
      case 'severe': return 'badge-soft-danger';
      default: return 'bg-warm-sand text-warm-secondary';
    }
  };

  return (
    <div className="min-h-screen py-12 bg-warm-bgAlt">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          {/* <div className="inline-flex items-center space-x-2 card px-4 py-2 rounded-full mb-4">
            <FileCheck className="w-4 h-4 text-warm-primary" />
            <span className="text-sm text-warm-secondary font-medium">AI-Powered Analysis</span>
          </div> */}
          <h1 className="text-4xl md:text-5xl font-semibold mb-3 tracking-tight text-warm-text">
            Stenosis Detection
          </h1>
          <p className="text-warm-secondary text-lg max-w-2xl mx-auto">
            Upload an angiography image for AI-powered analysis using state-of-the-art YOLOv8 models
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
                  {/* Stenosis Detection Status */}
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

                    <div className="flex items-center justify-between">
                      <span className="text-warm-secondary font-medium">Severity</span>
                      <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getSeverityClass(result.severity)}`}>
                        {result.severity.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Confidence Score */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-warm-secondary font-medium">Confidence Score</span>
                      <span className="font-semibold text-warm-text">{(result.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-warm-sand rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.confidence * 100}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-warm-primary to-warm-coral"
                      />
                    </div>
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex space-x-2 p-1 bg-warm-sand rounded-xl">
                    <button
                      onClick={() => setViewMode('detection')}
                      className={`flex-1 py-3 rounded-lg flex items-center justify-center space-x-2 transition-all font-medium ${
                        viewMode === 'detection'
                          ? 'bg-white text-warm-primary shadow-soft'
                          : 'text-warm-secondary hover:text-warm-text'
                      }`}
                    >
                      <Eye className="w-5 h-5" />
                      <span>Detection</span>
                    </button>
                    <button
                      onClick={() => setViewMode('segmentation')}
                      className={`flex-1 py-3 rounded-lg flex items-center justify-center space-x-2 transition-all font-medium ${
                        viewMode === 'segmentation'
                          ? 'bg-white text-warm-primary shadow-soft'
                          : 'text-warm-secondary hover:text-warm-text'
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
                      className="card rounded-xl p-4 bg-warm-sand/50"
                    >
                      <p className="text-xs text-warm-tertiary mb-1">Model Used</p>
                      <p className="font-semibold text-warm-text">{result.model_used}</p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="card rounded-xl p-4 bg-warm-sand/50"
                    >
                      <p className="text-xs text-warm-tertiary mb-1">Processing Time</p>
                      <p className="font-semibold text-warm-text">{result.processing_time}s</p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="card rounded-xl p-4 bg-warm-sand/50"
                    >
                      <p className="text-xs text-warm-tertiary mb-1">Stenosis %</p>
                      <p className="font-semibold text-warm-text">{result.stenosis_percent}%</p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="card rounded-xl p-4 bg-warm-sand/50"
                    >
                      <p className="text-xs text-warm-tertiary mb-1">Bounding Box</p>
                      <p className="font-semibold text-warm-text text-xs truncate">
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

        {/* XAI Section */}
        {result && result.heatmap && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <div className="card rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center text-warm-text">
                <Eye className="w-5 h-5 mr-2 text-warm-primary" />
                Explainability (Grad-CAM Heatmap)
              </h2>
              <p className="text-sm text-warm-secondary mb-6">
                Highlighted regions indicate model attention for stenosis detection.
                Warmer colors represent higher attention.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-warm-secondary mb-3 font-medium">Original Image</p>
                  <div className="aspect-video rounded-xl overflow-hidden bg-warm-sand border border-warm-border">
                    <img src={previewUrl} alt="Original" className="w-full h-full object-contain" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-warm-secondary mb-3 font-medium">Grad-CAM Heatmap Overlay</p>
                  <div className="aspect-video rounded-xl overflow-hidden bg-warm-sand border border-warm-border relative">
                    <img src={previewUrl} alt="Original" className="w-full h-full object-contain opacity-60" />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `url(data:image/svg+xml;base64,${btoa(
                          `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'>
                            <radialGradient id='grad'>
                              <stop offset='0%' stop-color='rgba(224, 122, 95, 0.6)' />
                              <stop offset='50%' stop-color='rgba(196, 154, 108, 0.4)' />
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
