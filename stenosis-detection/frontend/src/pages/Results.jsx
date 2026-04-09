import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Eye, TrendingUp, AlertTriangle, Target } from 'lucide-react';

const galleryData = {
  good_predictions: [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&h=300&fit=crop',
      confidence: 0.94,
      severity: 'severe',
      observation: 'Clear stenosis with high contrast',
      model: 'YOLOv8m',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=300&fit=crop',
      confidence: 0.89,
      severity: 'moderate',
      observation: 'Well-defined arterial narrowing',
      model: 'YOLOv8s',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=400&h=300&fit=crop',
      confidence: 0.91,
      severity: 'mild',
      observation: 'Early stage stenosis detected accurately',
      model: 'YOLOv8m-seg',
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&h=300&fit=crop',
      confidence: 0.87,
      severity: 'moderate',
      observation: 'Good boundary detection',
      model: 'YOLOv8s-seg',
    },
  ],
  failure_cases: [
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=300&fit=crop',
      confidence: 0.45,
      severity: 'mild',
      observation: 'Low contrast - vessel boundaries unclear',
      model: 'YOLOv8n',
      failure_reason: 'False negative',
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=400&h=300&fit=crop',
      confidence: 0.62,
      severity: 'moderate',
      observation: 'Motion artifacts affecting detection',
      model: 'YOLOv8n-seg',
      failure_reason: 'Motion blur',
    },
    {
      id: 7,
      image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&h=300&fit=crop',
      confidence: 0.51,
      severity: 'severe',
      observation: 'Overlapping structures causing confusion',
      model: 'YOLOv8s',
      failure_reason: 'Occlusion',
    },
    {
      id: 8,
      image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=300&fit=crop',
      confidence: 0.38,
      severity: 'mild',
      observation: 'Poor image quality - noise interference',
      model: 'YOLOv8n',
      failure_reason: 'Image noise',
    },
  ],
};

const severityColors = {
  mild: 'bg-apple-success text-white',
  moderate: 'bg-apple-warning text-white',
  severe: 'bg-apple-danger text-white',
};

export default function Results() {
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
            Results Gallery
          </h1>
          <p className="text-apple-secondary">
            Analysis of model performance across different cases
          </p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card rounded-xl p-4 text-center spring-hover"
          >
            <CheckCircle className="w-8 h-8 text-apple-success mx-auto mb-2" />
            <p className="text-2xl font-semibold text-apple-text">{galleryData.good_predictions.length}</p>
            <p className="text-sm text-apple-secondary">Successful Detections</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="card rounded-xl p-4 text-center spring-hover"
          >
            <AlertTriangle className="w-8 h-8 text-apple-warning mx-auto mb-2" />
            <p className="text-2xl font-semibold text-apple-text">{galleryData.failure_cases.length}</p>
            <p className="text-sm text-apple-secondary">Failure Cases</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="card rounded-xl p-4 text-center spring-hover"
          >
            <Target className="w-8 h-8 text-apple-accent mx-auto mb-2" />
            <p className="text-2xl font-semibold text-apple-text">86.7%</p>
            <p className="text-sm text-apple-secondary">Best mAP50</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="card rounded-xl p-4 text-center spring-hover"
          >
            <TrendingUp className="w-8 h-8 text-apple-secondary mx-auto mb-2" />
            <p className="text-2xl font-semibold text-apple-text">0.79</p>
            <p className="text-sm text-apple-secondary">Best IoU</p>
          </motion.div>
        </div>

        {/* Good Predictions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center space-x-3 mb-6">
            <CheckCircle className="w-6 h-6 text-apple-success" />
            <h2 className="text-2xl font-semibold" style={{ color: '#1D1D1F' }}>Successful Detections</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {galleryData.good_predictions.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card rounded-xl overflow-hidden spring-hover group"
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={`Case ${item.id}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4 text-apple-accent" />
                      <span className="font-semibold text-apple-text">{(item.confidence * 100).toFixed(0)}%</span>
                    </div>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${severityColors[item.severity]}`}>
                      {item.severity}
                    </span>
                  </div>
                  <p className="text-sm text-apple-secondary mb-2">{item.observation}</p>
                  <div className="flex items-center justify-between text-xs text-apple-tertiary">
                    <span>{item.model}</span>
                    <CheckCircle className="w-4 h-4 text-apple-success" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Failure Cases */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <XCircle className="w-6 h-6 text-apple-danger" />
            <h2 className="text-2xl font-semibold" style={{ color: '#1D1D1F' }}>Failure Cases & Challenges</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {galleryData.failure_cases.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="card rounded-xl overflow-hidden border border-apple-danger/20 spring-hover group"
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={`Case ${item.id}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 px-2 py-1 rounded bg-apple-danger/90 text-white text-xs font-medium">
                    {item.failure_reason}
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-apple-secondary mb-3">{item.observation}</p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-apple-tertiary">{item.model}</span>
                    <span className="text-xs text-apple-danger">{(item.confidence * 100).toFixed(0)}% conf</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-apple-danger">
                    <AlertTriangle className="w-3 h-3" />
                    <span>{item.failure_reason}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Analysis Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 card rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold mb-4" style={{ color: '#1D1D1F' }}>Analysis Summary</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-apple-success font-semibold mb-2 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Success Factors
              </h4>
              <ul className="space-y-2 text-sm text-apple-secondary">
                <li className="flex items-start">
                  <span className="text-apple-accent mr-2">&bull;</span>
                  High contrast angiography images yield best results
                </li>
                <li className="flex items-start">
                  <span className="text-apple-accent mr-2">&bull;</span>
                  YOLOv8m achieves optimal balance of accuracy and speed
                </li>
                <li className="flex items-start">
                  <span className="text-apple-accent mr-2">&bull;</span>
                  Segmentation models provide better boundary delineation
                </li>
                <li className="flex items-start">
                  <span className="text-apple-accent mr-2">&bull;</span>
                  Models perform well on moderate to severe cases
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-apple-danger font-semibold mb-2 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Common Failure Modes
              </h4>
              <ul className="space-y-2 text-sm text-apple-secondary">
                <li className="flex items-start">
                  <span className="text-apple-accent mr-2">&bull;</span>
                  Low contrast images reduce detection confidence
                </li>
                <li className="flex items-start">
                  <span className="text-apple-accent mr-2">&bull;</span>
                  Motion artifacts from patient movement
                </li>
                <li className="flex items-start">
                  <span className="text-apple-accent mr-2">&bull;</span>
                  Overlapping anatomical structures cause confusion
                </li>
                <li className="flex items-start">
                  <span className="text-apple-accent mr-2">&bull;</span>
                  Image noise affects smaller model performance
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
