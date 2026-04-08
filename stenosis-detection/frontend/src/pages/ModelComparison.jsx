import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Target, Activity, Zap } from 'lucide-react';
import axios from 'axios';

export default function ModelComparison() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState('detection');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/models/comparison');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching model comparison:', error);
        setData({
          detection_models: [
            { name: 'YOLOv8n', map50: 0.782, precision: 0.81, recall: 0.74, params_millions: 3.0, inference_time_ms: 12 },
            { name: 'YOLOv8s', map50: 0.823, precision: 0.85, recall: 0.79, params_millions: 11.2, inference_time_ms: 23 },
            { name: 'YOLOv8m', map50: 0.867, precision: 0.89, recall: 0.84, params_millions: 25.9, inference_time_ms: 45 },
          ],
          segmentation_models: [
            { name: 'YOLOv8n-seg', map50: 0.758, precision: 0.78, recall: 0.71, iou: 0.68, params_millions: 3.2, inference_time_ms: 15 },
            { name: 'YOLOv8s-seg', map50: 0.801, precision: 0.82, recall: 0.76, iou: 0.73, params_millions: 11.8, inference_time_ms: 28 },
            { name: 'YOLOv8m-seg', map50: 0.849, precision: 0.87, recall: 0.82, iou: 0.79, params_millions: 27.3, inference_time_ms: 52 },
          ],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-medical-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading model comparison data...</p>
        </div>
      </div>
    );
  }

  const currentData = viewType === 'detection' ? data.detection_models : data.segmentation_models;

  const chartData = currentData.map(model => ({
    name: model.name,
    mAP50: (model.map50 * 100).toFixed(1),
    precision: (model.precision * 100).toFixed(1),
    recall: (model.recall * 100).toFixed(1),
    iou: model.iou ? (model.iou * 100).toFixed(1) : null,
    params: model.params_millions,
    inference: model.inference_time_ms,
  }));

  const getBestValue = (key) => {
    const values = currentData.map(m => m[key] || 0);
    return Math.max(...values);
  };

  const MetricCard = ({ icon: Icon, title, value, best, label }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass-card rounded-xl p-4 glass-card-hover"
    >
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-5 h-5 text-medical-400" />
        {value === best && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-medical-500/20 text-medical-400">
            Best
          </span>
        )}
      </div>
      <p className="text-2xl font-bold gradient-text">{value}</p>
      <p className="text-sm text-gray-400">{title}</p>
      <p className="text-xs text-medical-400 mt-1">{label}</p>
    </motion.div>
  );

  const bestMap50 = getBestValue('map50');
  const bestPrecision = getBestValue('precision');
  const bestRecall = getBestValue('recall');
  const bestIoU = viewType === 'segmentation' ? getBestValue('iou') : null;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            <span className="gradient-text">Model Comparison</span>
          </h1>
          <p className="text-gray-400">
            Performance metrics across YOLOv8 detection and segmentation models
          </p>
        </motion.div>

        <div className="flex justify-center mb-8">
          <div className="glass-card rounded-xl p-1 inline-flex">
            <button
              onClick={() => setViewType('detection')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                viewType === 'detection'
                  ? 'bg-medical-600/30 text-medical-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Detection Models
            </button>
            <button
              onClick={() => setViewType('segmentation')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                viewType === 'segmentation'
                  ? 'bg-medical-600/30 text-medical-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Segmentation Models
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <MetricCard
            icon={Target}
            title="mAP50"
            value={`${(bestMap50 * 100).toFixed(1)}%`}
            best={bestMap50}
            label={currentData.find(m => m.map50 === bestMap50)?.name}
          />
          <MetricCard
            icon={TrendingUp}
            title="Precision"
            value={`${(bestPrecision * 100).toFixed(1)}%`}
            best={bestPrecision}
            label={currentData.find(m => m.precision === bestPrecision)?.name}
          />
          <MetricCard
            icon={Activity}
            title="Recall"
            value={`${(bestRecall * 100).toFixed(1)}%`}
            best={bestRecall}
            label={currentData.find(m => m.recall === bestRecall)?.name}
          />
          {viewType === 'segmentation' && bestIoU && (
            <MetricCard
              icon={Target}
              title="IoU"
              value={`${(bestIoU * 100).toFixed(1)}%`}
              best={bestIoU}
              label={currentData.find(m => m.iou === bestIoU)?.name}
            />
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">mAP50 Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(20, 20, 30, 0.9)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="mAP50" fill="url(#colorMap)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="colorMap" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" />
                    <stop offset="100%" stopColor="#0284c7" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Precision vs Recall</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(20, 20, 30, 0.9)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="precision" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Precision" />
                <Bar dataKey="recall" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Recall" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-400" />
            Inference Time Comparison
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis type="number" stroke="#9ca3af" />
              <YAxis dataKey="name" type="category" stroke="#9ca3af" width={100} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(20, 20, 30, 0.9)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                }}
                formatter={(value) => [`${value} ms`, 'Inference Time']}
              />
              <Bar dataKey="inference" fill="url(#colorTime)" radius={[0, 4, 4, 0]} />
              <defs>
                <linearGradient id="colorTime" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white">Detailed Metrics</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Model</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">mAP50</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Precision</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Recall</th>
                  {viewType === 'segmentation' && (
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">IoU</th>
                  )}
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Params (M)</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Inference (ms)</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((model, index) => (
                  <tr
                    key={model.name}
                    className="border-t border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 text-white font-medium">{model.name}</td>
                    <td className="px-6 py-4 text-medical-400">{(model.map50 * 100).toFixed(1)}%</td>
                    <td className="px-6 py-4 text-gray-300">{(model.precision * 100).toFixed(1)}%</td>
                    <td className="px-6 py-4 text-gray-300">{(model.recall * 100).toFixed(1)}%</td>
                    {viewType === 'segmentation' && model.iou && (
                      <td className="px-6 py-4 text-purple-400">{(model.iou * 100).toFixed(1)}%</td>
                    )}
                    <td className="px-6 py-4 text-gray-400">{model.params_millions}</td>
                    <td className="px-6 py-4 text-gray-400">{model.inference_time_ms}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
