import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Eye, TrendingUp, AlertTriangle, Target, Image as ImageIcon } from 'lucide-react';

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
  mild: 'badge-soft-success',
  moderate: 'badge-soft-warning',
  severe: 'badge-soft-danger',
};

export default function Results() {
  return (
    <div className="min-h-screen py-12 bg-warm-bgAlt">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          {/*<div className="inline-flex items-center space-x-2 card px-4 py-2 rounded-full mb-4">
            <ImageIcon className="w-4 h-4 text-warm-primary" />
            <span className="text-sm text-warm-secondary font-medium">Results Gallery</span>
          </div>*/}
          <h1 className="text-4xl md:text-5xl font-semibold mb-3 tracking-tight text-warm-text">
            Analysis Results
          </h1>
          <p className="text-warm-secondary text-lg max-w-2xl mx-auto">
            Explore model performance across successful detections and challenging cases
          </p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card rounded-2xl p-6 text-center spring-hover"
          >
            <div className="w-12 h-12 rounded-xl bg-warm-success/10 flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-warm-success" />
            </div>
            <p className="text-2xl font-semibold text-warm-text">{galleryData.good_predictions.length}</p>
            <p className="text-sm text-warm-secondary font-medium">Successful Detections</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="card rounded-2xl p-6 text-center spring-hover"
          >
            <div className="w-12 h-12 rounded-xl bg-warm-warning/10 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6 text-warm-warning" />
            </div>
            <p className="text-2xl font-semibold text-warm-text">{galleryData.failure_cases.length}</p>
            <p className="text-sm text-warm-secondary font-medium">Failure Cases</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="card rounded-2xl p-6 text-center spring-hover"
          >
            <div className="w-12 h-12 rounded-xl bg-warm-primary/10 flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-warm-primary" />
            </div>
            <p className="text-2xl font-semibold text-warm-text">86.7%</p>
            <p className="text-sm text-warm-secondary font-medium">Best mAP50</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="card rounded-2xl p-6 text-center spring-hover"
          >
            <div className="w-12 h-12 rounded-xl bg-warm-teal/10 flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-warm-teal" />
            </div>
            <p className="text-2xl font-semibold text-warm-text">0.79</p>
            <p className="text-sm text-warm-secondary font-medium">Best IoU</p>
          </motion.div>
        </div>

        {/* Good Predictions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-warm-success/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-warm-success" />
            </div>
            <h2 className="text-2xl font-semibold text-warm-text">Successful Detections</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {galleryData.good_predictions.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card rounded-2xl overflow-hidden spring-hover group"
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={`Case ${item.id}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4 text-warm-primary" />
                      <span className="font-semibold text-warm-text">{(item.confidence * 100).toFixed(0)}%</span>
                    </div>
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${severityColors[item.severity]}`}>
                      {item.severity}
                    </span>
                  </div>
                  <p className="text-sm text-warm-secondary mb-3 line-clamp-2">{item.observation}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-warm-tertiary font-medium">{item.model}</span>
                    <CheckCircle className="w-4 h-4 text-warm-success" />
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
            <div className="w-8 h-8 rounded-lg bg-warm-danger/10 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-warm-danger" />
            </div>
            <h2 className="text-2xl font-semibold text-warm-text">Failure Cases & Challenges</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {galleryData.failure_cases.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="card rounded-2xl overflow-hidden border border-warm-danger/20 spring-hover group"
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={`Case ${item.id}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1.5 rounded-lg bg-warm-danger/90 text-white text-xs font-semibold backdrop-blur-sm">
                    {item.failure_reason}
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-warm-secondary mb-3 line-clamp-2">{item.observation}</p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-warm-tertiary font-medium">{item.model}</span>
                    <span className="text-xs text-warm-danger font-semibold">{(item.confidence * 100).toFixed(0)}% conf</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-xs text-warm-danger font-medium">
                    <AlertTriangle className="w-3.5 h-3.5" />
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
          className="mt-12 card rounded-3xl p-8"
        >
          <h3 className="text-xl font-semibold mb-6 text-warm-text">Analysis Summary</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-warm-success font-semibold mb-4 flex items-center text-base">
                <div className="w-6 h-6 rounded-lg bg-warm-success/10 flex items-center justify-center mr-2">
                  <CheckCircle className="w-3.5 h-3.5" />
                </div>
                Success Factors
              </h4>
              <ul className="space-y-3 text-sm text-warm-secondary">
                {['High contrast angiography images yield best results',
                  'YOLOv8m achieves optimal balance of accuracy and speed',
                  'Segmentation models provide better boundary delineation',
                  'Models perform well on moderate to severe cases'].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-warm-primary mr-3 mt-0.5">&bull;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-warm-danger font-semibold mb-4 flex items-center text-base">
                <div className="w-6 h-6 rounded-lg bg-warm-danger/10 flex items-center justify-center mr-2">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
                Common Failure Modes
              </h4>
              <ul className="space-y-3 text-sm text-warm-secondary">
                {['Low contrast images reduce detection confidence',
                  'Motion artifacts from patient movement',
                  'Overlapping anatomical structures cause confusion',
                  'Image noise affects smaller model performance'].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-warm-primary mr-3 mt-0.5">&bull;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
