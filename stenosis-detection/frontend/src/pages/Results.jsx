import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Eye, TrendingUp, AlertTriangle, Target } from 'lucide-react';

// Mock gallery data
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
  mild: 'text-green-400 bg-green-500/10 border-green-500/30',
  moderate: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  severe: 'text-red-400 bg-red-500/10 border-red-500/30',
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
          <h1 className="text-4xl font-bold text-white mb-2">
            <span className="gradient-text">Results Gallery</span>
          </h1>
          <p className="text-gray-400">
            Analysis of model performance across different cases
          </p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-xl p-4 text-center"
          >
            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{galleryData.good_predictions.length}</p>
            <p className="text-sm text-gray-400">Successful Detections</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-xl p-4 text-center"
          >
            <AlertTriangle className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{galleryData.failure_cases.length}</p>
            <p className="text-sm text-gray-400">Failure Cases</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-xl p-4 text-center"
          >
            <Target className="w-8 h-8 text-medical-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">86.7%</p>
            <p className="text-sm text-gray-400">Best mAP50</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-xl p-4 text-center"
          >
            <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">0.79</p>
            <p className="text-sm text-gray-400">Best IoU</p>
          </motion.div>
        </div>

        {/* Good Predictions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center space-x-3 mb-6">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <h2 className="text-2xl font-bold text-white">Successful Detections</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {galleryData.good_predictions.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-xl overflow-hidden glass-card-hover group"
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={`Case ${item.id}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Overlay Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center space-x-2 mb-2">
                      <Eye className="w-4 h-4 text-medical-400" />
                      <span className="text-white font-semibold">{(item.confidence * 100).toFixed(0)}%</span>
                    </div>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${severityColors[item.severity]}`}>
                      {item.severity}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-300 mb-2">{item.observation}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{item.model}</span>
                    <CheckCircle className="w-4 h-4 text-green-400" />
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
            <XCircle className="w-6 h-6 text-red-400" />
            <h2 className="text-2xl font-bold text-white">Failure Cases & Challenges</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {galleryData.failure_cases.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="glass-card rounded-xl overflow-hidden border border-red-500/20 glass-card-hover group"
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={`Case ${item.id}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute top-2 right-2 px-2 py-1 rounded bg-red-500/80 text-white text-xs font-medium">
                    {item.failure_reason}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-300 mb-3">{item.observation}</p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">{item.model}</span>
                    <span className="text-xs text-red-400">{(item.confidence * 100).toFixed(0)}% conf</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-red-400">
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
          className="mt-12 glass-card rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">Analysis Summary</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-green-400 font-semibold mb-2 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Success Factors
              </h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start">
                  <span className="text-medical-400 mr-2">•</span>
                  High contrast angiography images yield best results
                </li>
                <li className="flex items-start">
                  <span className="text-medical-400 mr-2">•</span>
                  YOLOv8m achieves optimal balance of accuracy and speed
                </li>
                <li className="flex items-start">
                  <span className="text-medical-400 mr-2">•</span>
                  Segmentation models provide better boundary delineation
                </li>
                <li className="flex items-start">
                  <span className="text-medical-400 mr-2">•</span>
                  Models perform well on moderate to severe cases
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-red-400 font-semibold mb-2 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Common Failure Modes
              </h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start">
                  <span className="text-medical-400 mr-2">•</span>
                  Low contrast images reduce detection confidence
                </li>
                <li className="flex items-start">
                  <span className="text-medical-400 mr-2">•</span>
                  Motion artifacts from patient movement
                </li>
                <li className="flex items-start">
                  <span className="text-medical-400 mr-2">•</span>
                  Overlapping anatomical structures cause confusion
                </li>
                <li className="flex items-start">
                  <span className="text-medical-400 mr-2">•</span>
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
