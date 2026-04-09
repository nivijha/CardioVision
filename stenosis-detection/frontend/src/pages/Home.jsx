import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Activity, Brain, Zap, ChevronRight, ArrowRight, Target, Layers, Eye } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'YOLOv8 Detection',
    description: 'State-of-the-art object detection for identifying stenosis in coronary arteries with high precision.',
  },
  {
    icon: Layers,
    title: 'Segmentation',
    description: 'Pixel-perfect segmentation masks to delineate affected arterial regions accurately.',
  },
  {
    icon: Eye,
    title: 'Explainable AI',
    description: 'Grad-CAM heatmaps provide visual explanations of model attention and decision-making.',
  },
  {
    icon: Target,
    title: 'Severity Assessment',
    description: 'Automatic classification into mild, moderate, or severe stenosis categories.',
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
      <section className="bg-apple-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center space-x-2 card px-4 py-2 rounded-full mb-6">
              <Activity className="w-4 h-4 text-apple-accent" />
              <span className="text-sm text-apple-secondary">AI-Powered Medical Imaging</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-semibold mb-6 tracking-tight" style={{ color: '#1D1D1F' }}>
              Stenosis Detection in
              <br />
              <span style={{ color: '#0071E3' }}>Coronary Arteries</span>
            </h1>

            <p className="text-xl text-apple-secondary max-w-3xl mx-auto mb-8">
              Advanced AI system using YOLOv8 for automated detection and segmentation
              of coronary artery stenosis from angiography images.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/predict"
                className="btn-press flex items-center space-x-2 text-lg px-8 py-4 bg-apple-accent text-white rounded-lg"
              >
                <span>Start Analysis</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/research"
                className="card px-8 py-4 rounded-lg text-apple-text font-medium hover:shadow-elevated transition-all flex items-center space-x-2"
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
                className="card rounded-2xl p-6 text-center spring-hover"
              >
                <div className="text-3xl md:text-4xl font-semibold mb-1" style={{ color: '#0071E3' }}>
                  {stat.value}
                </div>
                <div className="text-sm text-apple-secondary">{stat.label}</div>
                <div className="text-xs text-apple-tertiary mt-1">{stat.sub}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-apple-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-semibold mb-4" style={{ color: '#1D1D1F' }}>
              Powered by Advanced AI
            </h2>
            <p className="text-apple-secondary max-w-2xl mx-auto">
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
                className="card rounded-2xl p-6 spring-hover"
              >
                   {/*
                  <div className="w-12 h-12 rounded-xl bg-apple-gray flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-apple-accent" />
                  </div>
                  */}
                  <div className="w-12 h-12 rounded-xl bg-apple-accent text-white flex items-center justify-center mb-4 font-semibold text-lg">
                    {index + 1}
                  </div>
                <h3 className="text-lg font-medium mb-2" style={{ color: '#1D1D1F' }}>
                  {feature.title}
                </h3>
                <p className="text-sm text-apple-secondary">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-apple-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="card rounded-3xl p-8 md:p-12 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-semibold mb-4" style={{ color: '#1D1D1F' }}>
              Ready to Analyze Angiography Images?
            </h2>
            <p className="text-apple-secondary mb-8 max-w-xl mx-auto">
              Upload your angiography images and get instant AI-powered stenosis
              detection with confidence scores and severity assessment.
            </p>
            <Link
              to="/predict"
              className="btn-press inline-flex items-center space-x-2 text-lg px-8 py-4 bg-apple-gray text-apple-text rounded-lg"
            >
              <Zap className="w-5 h-5 text-apple-accent" />
              <span>Try Now</span>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
