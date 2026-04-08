import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Loader, Eye, Layers, Download, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function Predict() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [viewMode, setViewMode] = useState('detection'); // 'detection' | 'segmentation'
  const [error, setError] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setError(null);

    // Auto-predict on upload
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

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('http://localhost:8000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data);
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
      case 'mild': return 'severity-mild';
      case 'moderate': return 'severity-moderate';
      case 'severe': return 'severity-severe';
      default: return '';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'mild': return '🟢';
      case 'moderate': return '🟡';
      case 'severe': return '🔴';
      default: return '⚪';
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
          <h1 className="text-4xl font-bold text-white mb-2">
            <span className="gradient-text">Stenosis Detection</span>
          </h1>
          <p className="text-gray-400">
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
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Upload className="w-5 h-5 mr-2 text-medical-400" />
                Image Upload
              </h2>

              {!selectedFile ? (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
                    isDragActive
                      ? 'border-medical-400 bg-medical-600/10'
                      : 'border-white/10 hover:border-medical-400/50 hover:bg-white/5'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-300 mb-2">
                    {isDragActive ? 'Drop the image here' : 'Drag & drop an image here'}
                  </p>
                  <p className="text-sm text-gray-500">
                    or click to select (PNG, JPG, BMP)
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <div className="aspect-square rounded-xl overflow-hidden bg-black/50">
                    <img
                      src={previewUrl}
                      alt="Uploaded angiography"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <button
                    onClick={handleReset}
                    className="absolute top-2 right-2 p-2 rounded-lg glass-card text-white hover:bg-red-500/80 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {loading && (
                    <div className="absolute inset-0 bg-black/70 rounded-xl flex items-center justify-center">
                      <div className="text-center">
                        <Loader className="w-12 h-12 text-medical-400 mx-auto mb-4 animate-spin" />
                        <p className="text-white">Analyzing image...</p>
                        <p className="text-sm text-gray-400">Running YOLOv8 inference</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-400">{error}</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="glass-card rounded-2xl p-6 h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-medical-400" />
                  Analysis Results
                </h2>
                {result && (
                  <button
                    onClick={handleDownload}
                    className="p-2 rounded-lg glass-card text-gray-400 hover:text-white transition-colors"
                    title="Download Results"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                )}
              </div>

              {!result && !loading && (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Upload an image to see analysis results</p>
                  </div>
                </div>
              )}

              {result && (
                <div className="space-y-6">
                  {/* Stenosis Detection Status */}
                  <div className="glass-card rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-400">Detection Status</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        result.stenosis ? 'bg-medical-500/20 text-medical-400' : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {result.stenosis ? 'Stenosis Detected' : 'No Stenosis'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Severity</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityClass(result.severity)}`}>
                        {getSeverityIcon(result.severity)} {result.severity.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Confidence Score */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400">Confidence Score</span>
                      <span className="text-white font-semibold">{(result.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.confidence * 100}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="h-full bg-gradient-to-r from-medical-500 to-cyan-500"
                      />
                    </div>
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setViewMode('detection')}
                      className={`flex-1 py-3 rounded-xl flex items-center justify-center space-x-2 transition-all ${
                        viewMode === 'detection'
                          ? 'bg-medical-600/30 text-medical-400 border border-medical-400/30'
                          : 'glass-card text-gray-400 hover:text-white'
                      }`}
                    >
                      <Eye className="w-5 h-5" />
                      <span>Detection</span>
                    </button>
                    <button
                      onClick={() => setViewMode('segmentation')}
                      className={`flex-1 py-3 rounded-xl flex items-center justify-center space-x-2 transition-all ${
                        viewMode === 'segmentation'
                          ? 'bg-medical-600/30 text-medical-400 border border-medical-400/30'
                          : 'glass-card text-gray-400 hover:text-white'
                      }`}
                    >
                      <Layers className="w-5 h-5" />
                      <span>Segmentation</span>
                    </button>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="glass-card rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-1">Model Used</p>
                      <p className="text-white font-medium">{result.model_used}</p>
                    </div>
                    <div className="glass-card rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-1">Processing Time</p>
                      <p className="text-white font-medium">{result.processing_time}s</p>
                    </div>
                    <div className="glass-card rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-1">Stenosis %</p>
                      <p className="text-white font-medium">{result.stenosis_percent}%</p>
                    </div>
                    <div className="glass-card rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-1">Bounding Box</p>
                      <p className="text-white font-medium text-xs">
                        {result.bbox?.map(b => b.toFixed(0)).join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
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
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Eye className="w-5 h-5 mr-2 text-medical-400" />
                Explainability (Grad-CAM Heatmap)
              </h2>
              <p className="text-sm text-gray-400 mb-4">
                Highlighted regions indicate model attention for stenosis detection.
                Warmer colors represent higher attention.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-2">Original Image</p>
                  <div className="aspect-video rounded-xl overflow-hidden bg-black/50">
                    <img src={previewUrl} alt="Original" className="w-full h-full object-contain" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-2">Grad-CAM Heatmap Overlay</p>
                  <div className="aspect-video rounded-xl overflow-hidden bg-black/50 relative">
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
