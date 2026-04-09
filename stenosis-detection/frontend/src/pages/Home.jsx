import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, Sparkles, Users, Zap, Target, Shield, ChevronRight } from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'Precise Detection',
    description: 'AI-powered analysis identifies stenosis with clinical-grade accuracy using YOLOv8 models.',
    color: 'from-warm-primary to-warm-coral',
  },
  {
    icon: Shield,
    title: 'Trusted Results',
    description: 'Validated on the ARCADE dataset with explainable outputs for clinical confidence.',
    color: 'from-warm-teal to-warm-success',
  },
  {
    icon: Zap,
    title: 'Real-time Analysis',
    description: 'Get results in under 50ms - fast enough for clinical workflow integration.',
    color: 'from-warm-warning to-warm-primary',
  },
  {
    icon: Users,
    title: 'Patient-Centered',
    description: 'Designed to support healthcare professionals in delivering better cardiovascular care.',
    color: 'from-warm-coral to-warm-danger',
  },
];

const stats = [
  { value: '86.7%', label: 'Detection Accuracy', sub: 'YOLOv8m model' },
  { value: '2,847', label: 'Images Analyzed', sub: 'ARCADE dataset' },
  { value: '<50ms', label: 'Inference Time', sub: 'Average response' },
  { value: '0.79', label: 'IoU Score', sub: 'Segmentation quality' },
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
            {/* Badge */}
            {/*<motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 card px-4 py-2 rounded-full mb-6"
            > */}
              {/* <Sparkles className="w-4 h-4 text-warm-primary" />
              <span className="text-sm text-warm-secondary font-medium">AI-Powered Cardiovascular Care</span>*/}
            {/*</motion.div> */}

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-semibold mb-6 tracking-tight text-warm-text leading-tight">
              Detecting Stenosis with
              <span className="gradient-text block">Compassion & Precision</span>
            </h1>

            <p className="text-xl text-warm-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
              Advanced AI system using YOLOv8 for automated detection and segmentation
              of coronary artery stenosis — supporting healthcare professionals with
              explainable, real-time analysis.
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
                <span>View Research</span>
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

      {/* Features Section */}
      <section className="py-24 bg-warm-bgAlt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-warm-text">
              Why Choose StenosisAI?
            </h2>
            <p className="text-warm-secondary max-w-2xl mx-auto text-lg leading-relaxed">
              Our platform combines cutting-edge AI with human-centered design to deliver
              reliable, explainable results for cardiovascular analysis.
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
                className="card rounded-2xl p-6 spring-hover group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 shadow-soft group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-warm-text">
                  {feature.title}
                </h3>
                <p className="text-sm text-warm-secondary leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-warm-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-warm-text">
              How It Works
            </h2>
            <p className="text-warm-secondary max-w-2xl mx-auto text-lg">
              Three simple steps to get AI-powered stenosis analysis
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Upload Image',
                description: 'Upload your coronary angiography image in PNG, JPG, or BMP format.',
              },
              {
                step: '02',
                title: 'AI Analysis',
                description: 'Our YOLOv8 models analyze the image for stenosis detection and segmentation.',
              },
              {
                step: '03',
                title: 'Get Results',
                description: 'Receive detailed results with confidence scores and visual explanations.',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                <div className="card rounded-2xl p-8 h-full">
                  <div className="text-6xl font-bold text-warm-sand mb-4 font-display">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-warm-text">
                    {item.title}
                  </h3>
                  <p className="text-warm-secondary leading-relaxed">
                    {item.description}
                  </p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ChevronRight className="w-6 h-6 text-warm-border" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
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
              {/*<div className="inline-flex items-center space-x-2 badge-soft-primary mb-6">
                <Heart className="w-4 h-4" />
                <span>Ready to Help</span>
              </div>*/}

              <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-warm-text">
                Start Analyzing Angiography Images Today
              </h2>
              <p className="text-warm-secondary mb-8 max-w-xl mx-auto text-lg leading-relaxed">
                Upload your angiography images and get instant AI-powered stenosis
                detection with confidence scores and visual explanations.
              </p>
              <Link
                to="/predict"
                className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-4 rounded-xl"
              >
                {/*<Zap className="w-5 h-5" />*/}
                <span>Try Now — It's Free</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
