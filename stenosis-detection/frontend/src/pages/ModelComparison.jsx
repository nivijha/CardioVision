import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Target, Activity, Zap, Award, Layers } from 'lucide-react';
import { getModelComparison } from '../utils/api';
import { getDefaultModelComparisonData } from '../utils/modelConstants';

const datasetResults = {
  ARCADE: {
    detection: [
      { name: 'YOLOv8n', map50: 0.782, precision: 0.81, recall: 0.74, params_millions: 3.0, inference_time_ms: 12 },
      { name: 'YOLOv8s', map50: 0.823, precision: 0.85, recall: 0.79, params_millions: 11.2, inference_time_ms: 23 },
      { name: 'YOLOv8m', map50: 0.867, precision: 0.89, recall: 0.84, params_millions: 25.9, inference_time_ms: 45 },
    ],
    segmentation: [
      { name: 'YOLOv8n-seg', map50: 0.758, precision: 0.78, recall: 0.71, iou: 0.68, params_millions: 3.2, inference_time_ms: 15 },
      { name: 'YOLOv8s-seg', map50: 0.801, precision: 0.82, recall: 0.76, iou: 0.73, params_millions: 11.8, inference_time_ms: 28 },
      { name: 'YOLOv8m-seg', map50: 0.849, precision: 0.87, recall: 0.82, iou: 0.79, params_millions: 27.3, inference_time_ms: 52 },
    ],
  },
  CADICA: {
    detection: [
      { name: 'YOLOv8n', map50: null, precision: null, recall: null, params_millions: 3.0, inference_time_ms: 12 },
      { name: 'YOLOv8s', map50: null, precision: null, recall: null, params_millions: 11.2, inference_time_ms: 23 },
      { name: 'YOLOv8m', map50: null, precision: null, recall: null, params_millions: 25.9, inference_time_ms: 45 },
    ],
    segmentation: [
      { name: 'YOLOv8n-seg', map50: null, precision: null, recall: null, iou: null, params_millions: 3.2, inference_time_ms: 15 },
      { name: 'YOLOv8s-seg', map50: null, precision: null, recall: null, iou: null, params_millions: 11.8, inference_time_ms: 28 },
      { name: 'YOLOv8m-seg', map50: null, precision: null, recall: null, iou: null, params_millions: 27.3, inference_time_ms: 52 },
    ],
  },
};

export default function ModelComparison() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState('detection');
  const [dataset, setDataset] = useState('ARCADE');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getModelComparison();
        setData(response);
      } catch (error) {
        console.error('Error fetching model comparison:', error);
        setData(getDefaultModelComparisonData());
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-bgAlt">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-warm-sand" />
            <div className="absolute inset-0 rounded-full border-4 border-warm-primary border-t-transparent animate-spin" />
          </div>
          <p className="text-warm-secondary">Loading model comparison data...</p>
        </div>
      </div>
    );
  }

  const currentData = viewType === 'detection' ? data.detection_models : data.segmentation_models;
  const datasetData = datasetResults[dataset][viewType];
  const isDatasetPending = dataset === 'CADICA';

  const chartData = currentData.map(model => ({
    name: model.name.replace('YOLOv8', 'v8').replace('-seg', '-S'),
    mAP50: model.map50 != null ? (model.map50 * 100).toFixed(1) : 0,
    precision: model.precision != null ? (model.precision * 100).toFixed(1) : 0,
    recall: model.recall != null ? (model.recall * 100).toFixed(1) : 0,
    iou: model.iou != null ? (model.iou * 100).toFixed(1) : null,
    params: model.params_millions,
    inference: model.inference_time_ms,
  }));

  const datasetChartData = datasetData.map(model => ({
    name: model.name.replace('YOLOv8', 'v8').replace('-seg', '-S'),
    mAP50: model.map50 != null ? (model.map50 * 100).toFixed(1) : null,
    iou: model.iou != null ? (model.iou * 100).toFixed(1) : null,
  }));

  const getBestValue = (key) => {
    const values = currentData.map(m => m[key] || 0);
    return Math.max(...values);
  };

  const MetricCard = ({ icon: Icon, title, value, best, label, color }) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      className="card rounded-2xl p-5 spring-hover"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {value === best && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-warm-success/10 text-warm-success font-semibold border border-warm-success/30">
            Best
          </span>
        )}
      </div>
      <p className="text-2xl font-semibold text-warm-text">{value}</p>
      <p className="text-sm text-warm-secondary font-medium mt-1">{title}</p>
      <p className="text-xs text-warm-tertiary mt-1.5">{label}</p>
    </motion.div>
  );

  const bestMap50 = getBestValue('map50');
  const bestPrecision = getBestValue('precision');
  const bestRecall = getBestValue('recall');
  const bestIoU = viewType === 'segmentation' ? getBestValue('iou') : null;

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
            <Award className="w-4 h-4 text-warm-primary" />
            <span className="text-sm text-warm-secondary font-medium">Performance Analysis</span>
          </div>*/}
          <h1 className="text-4xl md:text-5xl font-semibold mb-3 tracking-tight text-warm-text">
            Model Comparison
          </h1>
          <p className="text-warm-secondary text-lg max-w-2xl mx-auto">
            Comprehensive performance metrics across YOLOv8 detection and segmentation models
          </p>
        </motion.div>

        {/* Toggle */}
        <div className="flex justify-center mb-10">
          <div className="card rounded-xl p-1.5 inline-flex shadow-soft">
            <button
              onClick={() => setViewType('detection')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                viewType === 'detection'
                  ? 'bg-gradient-to-r from-warm-primary to-warm-coral text-white shadow-soft'
                  : 'text-warm-secondary hover:text-warm-text'
              }`}
            >
              Detection
            </button>
            <button
              onClick={() => setViewType('segmentation')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                viewType === 'segmentation'
                  ? 'bg-gradient-to-r from-warm-primary to-warm-coral text-white shadow-soft'
                  : 'text-warm-secondary hover:text-warm-text'
              }`}
            >
              Segmentation
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <MetricCard
            icon={Target}
            title="mAP50"
            value={`${(bestMap50 * 100).toFixed(1)}%`}
            best={bestMap50}
            label={currentData.find(m => m.map50 === bestMap50)?.name}
            color="from-warm-primary to-warm-coral"
          />
          <MetricCard
            icon={TrendingUp}
            title="Precision"
            value={`${(bestPrecision * 100).toFixed(1)}%`}
            best={bestPrecision}
            label={currentData.find(m => m.precision === bestPrecision)?.name}
            color="from-warm-teal to-warm-success"
          />
          <MetricCard
            icon={Activity}
            title="Recall"
            value={`${(bestRecall * 100).toFixed(1)}%`}
            best={bestRecall}
            label={currentData.find(m => m.recall === bestRecall)?.name}
            color="from-warm-warning to-warm-primary"
          />
          {viewType === 'segmentation' && bestIoU && (
            <MetricCard
              icon={Layers}
              title="IoU"
              value={`${(bestIoU * 100).toFixed(1)}%`}
              best={bestIoU}
              label={currentData.find(m => m.iou === bestIoU)?.name}
              color="from-warm-coral to-warm-danger"
            />
          )}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold mb-6 text-warm-text">mAP50 Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D9" />
                <XAxis dataKey="name" stroke="#8B7E74" fontSize={12} />
                <YAxis stroke="#8B7E74" fontSize={12} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    background: '#FFFFFF',
                    border: '1px solid #E8E0D9',
                    borderRadius: '12px',
                    boxShadow: '0 4px 16px rgba(92, 68, 49, 0.1)',
                  }}
                  labelStyle={{ color: '#2D2A26', fontWeight: 600 }}
                />
                <Bar dataKey="mAP50" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C49A6C" />
                    <stop offset="100%" stopColor="#A67C52" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold mb-6 text-warm-text">Precision vs Recall</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D9" />
                <XAxis dataKey="name" stroke="#8B7E74" fontSize={12} />
                <YAxis stroke="#8B7E74" fontSize={12} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    background: '#FFFFFF',
                    border: '1px solid #E8E0D9',
                    borderRadius: '12px',
                    boxShadow: '0 4px 16px rgba(92, 68, 49, 0.1)',
                  }}
                  labelStyle={{ color: '#2D2A26', fontWeight: 600 }}
                />
                <Legend />
                <Bar dataKey="precision" fill="#C49A6C" radius={[8, 8, 0, 0]} name="Precision" />
                <Bar dataKey="recall" fill="#A4B494" radius={[8, 8, 0, 0]} name="Recall" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Inference Time Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card rounded-2xl p-6 mb-8"
        >
          <h3 className="text-lg font-semibold mb-6 flex items-center text-warm-text">
            <Zap className="w-5 h-5 mr-2 text-warm-warning" />
            Inference Time Comparison
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D9" />
              <XAxis type="number" stroke="#8B7E74" fontSize={12} />
              <YAxis dataKey="name" type="category" stroke="#8B7E74" fontSize={12} width={100} />
              <Tooltip
                contentStyle={{
                  background: '#FFFFFF',
                  border: '1px solid #E8E0D9',
                  borderRadius: '12px',
                  boxShadow: '0 4px 16px rgba(92, 68, 49, 0.1)',
                }}
                formatter={(value) => [`${value} ms`, 'Inference Time']}
                labelStyle={{ color: '#2D2A26', fontWeight: 600 }}
              />
              <Bar dataKey="inference" fill="#E07A5F" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Dataset-Specific Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="card rounded-2xl p-6 mb-8"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-warm-text">Dataset-Specific Results</h3>
              <p className="text-sm text-warm-secondary mt-2">
                ARCADE training outputs are shown here for both detection and segmentation. CADICA results are currently pending.
              </p>
            </div>
            <div className="inline-flex rounded-xl bg-warm-sand/90 p-1">
              {['ARCADE', 'CADICA'].map((label) => (
                <button
                  key={label}
                  onClick={() => setDataset(label)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    dataset === label
                      ? 'bg-gradient-to-r from-warm-primary to-warm-coral text-white shadow-soft'
                      : 'text-warm-secondary hover:text-warm-text'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="card rounded-2xl p-5 bg-warm-sand/50">
              <p className="text-xs text-warm-tertiary uppercase tracking-wider mb-2">Dataset</p>
              <p className="text-xl font-semibold text-warm-text">{dataset}</p>
            </div>
            <div className="card rounded-2xl p-5 bg-warm-sand/50">
              <p className="text-xs text-warm-tertiary uppercase tracking-wider mb-2">Mode</p>
              <p className="text-xl font-semibold text-warm-text">{viewType === 'detection' ? 'Detection' : 'Segmentation'}</p>
            </div>
            <div className="card rounded-2xl p-5 bg-warm-sand/50">
              <p className="text-xs text-warm-tertiary uppercase tracking-wider mb-2">Status</p>
              <p className="text-xl font-semibold text-warm-text">{dataset === 'CADICA' ? 'Pending' : 'Trained'}</p>
            </div>
          </div>

          {dataset === 'CADICA' ? (
            <div className="rounded-2xl border border-warm-border bg-warm-sand/70 p-6 text-warm-secondary">
              <p className="text-sm">
                CADICA model evaluation is being prepared and published after the next training run. The charts below will update once CADICA performance data is available.
              </p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card rounded-2xl p-6"
              >
                <h4 className="text-md font-semibold text-warm-text mb-4">Model Performance on {dataset}</h4>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={datasetChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D9" />
                    <XAxis dataKey="name" stroke="#8B7E74" fontSize={12} />
                    <YAxis stroke="#8B7E74" fontSize={12} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        background: '#FFFFFF',
                        border: '1px solid #E8E0D9',
                        borderRadius: '12px',
                        boxShadow: '0 4px 16px rgba(92, 68, 49, 0.1)',
                      }}
                      labelStyle={{ color: '#2D2A26', fontWeight: 600 }}
                    />
                    <Bar dataKey="mAP50" fill="#C49A6C" radius={[8, 8, 0, 0]} name="mAP50" />
                    {viewType === 'segmentation' && <Bar dataKey="iou" fill="#A4B494" radius={[8, 8, 0, 0]} name="IoU" />}
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card rounded-2xl p-6"
              >
                <h4 className="text-md font-semibold text-warm-text mb-4">Dataset Breakdown</h4>
                <div className="space-y-4">
                  {datasetChartData.map((item) => (
                    <div key={item.name} className="rounded-2xl bg-warm-sand/80 p-4 border border-warm-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-warm-text">{item.name}</span>
                        <span className="text-sm text-warm-secondary">{viewType === 'segmentation' ? 'Segmentation' : 'Detection'}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm text-warm-secondary">
                        <div>
                          <p className="font-semibold text-warm-text">mAP50</p>
                          <p>{item.mAP50 != null ? `${item.mAP50}%` : 'Pending'}</p>
                        </div>
                        {viewType === 'segmentation' && (
                          <div>
                            <p className="font-semibold text-warm-text">IoU</p>
                            <p>{item.iou != null ? `${item.iou}%` : 'Pending'}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>

        {/* Detailed Metrics Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card rounded-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-warm-border bg-warm-sand/30">
            <h3 className="text-lg font-semibold text-warm-text">Detailed Metrics</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-warm-sand/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-warm-secondary uppercase tracking-wider">Model</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-warm-secondary uppercase tracking-wider">mAP50</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-warm-secondary uppercase tracking-wider">Precision</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-warm-secondary uppercase tracking-wider">Recall</th>
                  {viewType === 'segmentation' && (
                    <th className="px-6 py-4 text-left text-xs font-semibold text-warm-secondary uppercase tracking-wider">IoU</th>
                  )}
                  <th className="px-6 py-4 text-left text-xs font-semibold text-warm-secondary uppercase tracking-wider">Params (M)</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-warm-secondary uppercase tracking-wider">Inference (ms)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-border">
                {currentData.map((model, index) => (
                  <tr
                    key={model.name}
                    className="hover:bg-warm-sand/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-warm-text font-semibold">{model.name}</td>
                    <td className="px-6 py-4 text-warm-primary font-semibold">{(model.map50 * 100).toFixed(1)}%</td>
                    <td className="px-6 py-4 text-warm-secondary">{(model.precision * 100).toFixed(1)}%</td>
                    <td className="px-6 py-4 text-warm-secondary">{(model.recall * 100).toFixed(1)}%</td>
                    {viewType === 'segmentation' && model.iou && (
                      <td className="px-6 py-4 text-warm-secondary">{(model.iou * 100).toFixed(1)}%</td>
                    )}
                    <td className="px-6 py-4 text-warm-tertiary">{model.params_millions}</td>
                    <td className="px-6 py-4 text-warm-tertiary">{model.inference_time_ms}</td>
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
