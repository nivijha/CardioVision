import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Activity, Brain, Zap, ChevronRight, ArrowRight, Target, Layers, Eye } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'YOLOv8 Detection',
    description: 'State-of-the-art object detection for identifying stenosis in coronary arteries with high precision.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Layers,
    title: 'Segmentation',
    description: 'Pixel-perfect segmentation masks to delineate affected arterial regions accurately.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Eye,
    title: 'Explainable AI',
    description: 'Grad-CAM heatmaps provide visual explanations of model attention and decision-making.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Target,
    title: 'Severity Assessment',
    description: 'Automatic classification into mild, moderate, or severe stenosis categories.',
    color: 'from-orange-500 to-red-500',
  },
];

const stats = [
  { value: '86.7%', label: 'mAP50 Score', sub: 'YOLOv8m' },
  { value: '0.89', label: 'Precision', sub: 'Detection' },
  { value: '0.79', label: 'IoU Score', sub: 'Segmentation' },
  { value: '45ms', label: 'Inference Time', sub: 'Average' },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-medical-600/10 to-transparent" />

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-medical-500/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center space-x-2 glass-card px-4 py-2 rounded-full mb-6">
              <Activity className="w-4 h-4 text-medical-400" />
              <span className="text-sm text-gray-300">AI-Powered Medical Imaging</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-white">Stenosis Detection in</span>
              <br />
              <span className="gradient-text neon-glow">Coronary Arteries</span>
            </h1>

            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              Advanced AI system using YOLOv8 for automated detection and segmentation
              of coronary artery stenosis from angiography images.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/predict"
                className="btn-primary flex items-center space-x-2 text-lg px-8 py-4"
              >
                <span>Start Analysis</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/research"
                className="glass-card px-8 py-4 rounded-lg text-white font-medium hover:bg-white/10 transition-all flex items-center space-x-2"
              >
                <span>View Research</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="glass-card rounded-2xl p-6 text-center glass-card-hover"
              >
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
                <div className="text-xs text-medical-400 mt-1">{stat.sub}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Powered by Advanced AI
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our system leverages cutting-edge computer vision techniques for
              accurate and explainable stenosis analysis.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card rounded-2xl p-6 glass-card-hover"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-medical-600/10 to-cyan-600/10" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Analyze Angiography Images?
              </h2>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                Upload your angiography images and get instant AI-powered stenosis
                detection with confidence scores and severity assessment.
              </p>
              <Link
                to="/predict"
                className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-4"
              >
                <Zap className="w-5 h-5" />
                <span>Try Now</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
