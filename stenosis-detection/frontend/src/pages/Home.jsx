import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, Database, Brain, Zap } from 'lucide-react';

export default function Home() {
  const segmentationResults = [
    { model: 'YOLOv8s', precision: '0.447', recall: '0.413', map: '0.354' },
  ];

  const detectionResults = [
    { model: 'YOLOv8s', precision: '0.9156', recall: '0.903', map: '0.9443' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Academic */}
      <section className="relative overflow-hidden bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-5xl mx-auto"
          >
            {/* Academic Title */}
            <h1 className="text-4xl md:text-5xl font-semibold mb-4 text-warm-text leading-tight">
              Coronary Artery Stenosis Detection and Segmentation using
              <span className="gradient-text block">YOLOv8</span>
            </h1>

            {/* Academic Subtitle */}
            <p className="text-lg text-warm-secondary max-w-3xl mx-auto mb-8 leading-relaxed">
              This project presents a deep learning-based approach for automated detection and segmentation of coronary artery stenosis from angiography images.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link
                to="/predict"
                className="btn-primary flex items-center space-x-2 px-6 py-3 rounded-md text-base"
              >
                <span>Try Analysis Tool</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/research"
                className="border border-warm-border px-6 py-3 rounded-md text-base font-medium text-warm-text hover:bg-warm-bgAlt transition-colors"
              >
                Read Research Paper
              </Link>
            </div>

            {/* Academic Note */}
            <div className="inline-block bg-warm-bgAlt border border-warm-border rounded-lg px-4 py-2 text-sm text-warm-secondary">
              ⚠️ This project is developed for academic and research purposes only.
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-warm-border to-transparent" />
      </section>

      {/* Dataset Summary */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-2xl font-semibold mb-8 text-warm-text">Dataset Summary</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* ARCADE */}
              <div className="card rounded-lg p-6 border border-warm-border">
                <h3 className="font-semibold text-warm-text mb-3">ARCADE Dataset</h3>
                <ul className="space-y-2 text-sm text-warm-secondary">
                  <li>• Approximately 3,000 angiography images</li>
                  <li>• Resolution: 512×512 pixels</li>
                  <li>• COCO format annotations</li>
                  <li>• Bounding boxes + segmentation masks</li>
                </ul>
              </div>
              {/* CADICA */}
              <div className="card rounded-lg p-6 border border-warm-border">
                <h3 className="font-semibold text-warm-text mb-3">CADICA Dataset</h3>
                <ul className="space-y-2 text-sm text-warm-secondary">
                  <li>• Clinical validation dataset</li>
                  <li>• Used for evaluation and generalization</li>
                  <li>• Real-world angiography images</li>
                  <li>• Expert-annotated stenosis regions</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-warm-border to-transparent" />
      </section>

      {/* System Pipeline */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-semibold mb-8 text-warm-text">Processing Pipeline</h2>
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 flex-col md:flex-row">
              {['Input Image', 'Preprocessing', 'YOLOv8 Model', 'Detection/Segmentation', 'Post-processing', 'Output'].map((step, idx) => (
                <div key={idx} className="flex items-center">
                  <div className="bg-warm-bgAlt border border-warm-border rounded-lg px-4 py-2 text-sm font-medium text-warm-text whitespace-nowrap">
                    {step}
                  </div>
                  {idx < 5 && <div className="text-warm-border ml-4 mr-2">→</div>}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-warm-border to-transparent" />
      </section>

      {/* Key Results */}
      <section className="py-16 bg-warm-bgAlt">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-semibold mb-8 text-warm-text">Key Results</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Segmentation Results */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-warm-text">Segmentation (ARCADE Dataset)</h3>
                <div className="card rounded-lg p-4 border border-warm-border overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-warm-border">
                        <th className="text-left py-2 px-2 font-semibold text-warm-text">Model</th>
                        <th className="text-left py-2 px-2 font-semibold text-warm-text">Precision</th>
                        <th className="text-left py-2 px-2 font-semibold text-warm-text">Recall</th>
                        <th className="text-left py-2 px-2 font-semibold text-warm-text">mAP@0.5</th>
                      </tr>
                    </thead>
                    <tbody>
                      {segmentationResults.map((row, idx) => (
                        <tr key={idx} className="border-b border-warm-border last:border-0">
                          <td className="py-2 px-2 text-warm-secondary">{row.model}</td>
                          <td className="py-2 px-2 text-warm-secondary">{row.precision}</td>
                          <td className="py-2 px-2 text-warm-secondary">{row.recall}</td>
                          <td className="py-2 px-2 font-medium text-warm-primary">{row.map}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Detection Results */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-warm-text">Detection (CADICA Dataset)</h3>
                <div className="card rounded-lg p-4 border border-warm-border overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-warm-border">
                        <th className="text-left py-2 px-2 font-semibold text-warm-text">Model</th>
                        <th className="text-left py-2 px-2 font-semibold text-warm-text">Precision</th>
                        <th className="text-left py-2 px-2 font-semibold text-warm-text">Recall</th>
                        <th className="text-left py-2 px-2 font-semibold text-warm-text">mAP@0.5</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detectionResults.map((row, idx) => (
                        <tr key={idx} className="border-b border-warm-border last:border-0">
                          <td className="py-2 px-2 text-warm-secondary">{row.model}</td>
                          <td className="py-2 px-2 text-warm-secondary">{row.precision}</td>
                          <td className="py-2 px-2 text-warm-secondary">{row.recall}</td>
                          <td className="py-2 px-2 font-medium text-warm-primary">{row.map}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-warm-border to-transparent" />
      </section>

      {/* Model Architecture */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-semibold mb-8 text-warm-text">Model Architecture</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="card rounded-lg p-6 border border-warm-border">
                <Brain className="w-6 h-6 text-warm-primary mb-3" />
                <h3 className="font-semibold text-warm-text mb-2">Backbone</h3>
                <p className="text-sm text-warm-secondary">CSPDarknet for efficient feature extraction</p>
              </div>
              <div className="card rounded-lg p-6 border border-warm-border">
                <Zap className="w-6 h-6 text-warm-primary mb-3" />
                <h3 className="font-semibold text-warm-text mb-2">Neck</h3>
                <p className="text-sm text-warm-secondary">Feature Pyramid Network for multi-scale detection</p>
              </div>
              <div className="card rounded-lg p-6 border border-warm-border">
                <Database className="w-6 h-6 text-warm-primary mb-3" />
                <h3 className="font-semibold text-warm-text mb-2">Head</h3>
                <p className="text-sm text-warm-secondary">Detection & Segmentation prediction heads</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-warm-border to-transparent" />
      </section>

      {/* Footer CTA */}
      <section className="py-12 bg-warm-bgAlt">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-semibold mb-4 text-warm-text">Explore the Research</h2>
          <p className="text-warm-secondary mb-6 max-w-2xl mx-auto">
            For detailed methodology, comprehensive results, and technical analysis, please refer to the research paper and about section.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/research" className="btn-primary px-6 py-3 rounded-md">View Research Paper</Link>
            <Link to="/about" className="border border-warm-border px-6 py-3 rounded-md text-warm-text hover:bg-white transition-colors">Learn About Team</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
