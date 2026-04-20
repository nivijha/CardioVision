import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, ChevronRight } from 'lucide-react';

const stats = [
  { value: '86.7%', label: 'Accuracy', sub: 'YOLOv8m' },
  { value: '<50ms', label: 'Speed', sub: 'Analysis time' },
  { value: '2.8k+', label: 'Images', sub: 'Validated' },
  { value: '0.79', label: 'IoU', sub: 'Segmentation' },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-bg">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-warm-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-warm-coral/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-semibold mb-6 tracking-tight text-warm-text leading-tight">
              AI-Powered Stenosis
              <span className="gradient-text block">Detection System</span>
            </h1>

            <p className="text-xl text-warm-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
              Advanced real-time analysis for coronary artery stenosis using state-of-the-art YOLOv8 models with explainable AI results.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/predict"
                className="btn-primary flex items-center space-x-2 text-lg px-8 py-4 rounded-xl group"
              >
                <span>Start Analysis</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/research"
                className="card px-8 py-4 rounded-xl text-warm-text font-medium hover:shadow-elevated transition-all flex items-center space-x-2 group"
              >
                <span>Learn More</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="card rounded-2xl p-6 text-center spring-hover"
              >
                <div className="text-3xl md:text-4xl font-semibold mb-1 gradient-text">
                  {stat.value}
                </div>
                <div className="text-sm text-warm-secondary font-medium">{stat.label}</div>
                <div className="text-xs text-warm-tertiary mt-1">{stat.sub}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-warm-bgAlt">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="card rounded-3xl p-10 md:p-14 text-center relative overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-warm-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-warm-coral/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-warm-text">
                Ready to Analyze?
              </h2>
              <p className="text-warm-secondary mb-8 max-w-xl mx-auto text-lg leading-relaxed">
                Upload your angiography images and get instant AI-powered analysis with detailed results and visualizations.
              </p>
              <Link
                to="/predict"
                className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-4 rounded-xl"
              >
                <span>Get Started Now</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
