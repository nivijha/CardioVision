import { motion } from 'framer-motion';
import { Download, FileText, BookOpen, Microscope, Database, Brain, Target, Layers } from 'lucide-react';

const sections = [
  { icon: FileText, title: 'Abstract', id: 'abstract' },
  { icon: BookOpen, title: 'Introduction', id: 'introduction' },
  { icon: Microscope, title: 'Methodology', id: 'methodology' },
  { icon: Database, title: 'Dataset', id: 'dataset' },
  { icon: Brain, title: 'Model Architecture', id: 'architecture' },
  { icon: Target, title: 'Results & Analysis', id: 'results' },
  { icon: Layers, title: 'Conclusion', id: 'conclusion' },
];

export default function Research() {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center space-x-2 card px-4 py-2 rounded-full mb-4">
            <FileText className="w-4 h-4 text-apple-accent" />
            <span className="text-sm text-apple-secondary">Research Paper</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold mb-4 tracking-tight" style={{ color: '#1D1D1F' }}>
            Stenosis Detection and Segmentation in Coronary Arteries using <span style={{ color: '#0071E3' }}>YOLOv8</span>
          </h1>
          <p className="text-apple-secondary text-lg mb-6">
            A comprehensive study on automated coronary artery stenosis analysis using state-of-the-art object detection and instance segmentation models
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="btn-press flex items-center space-x-2 px-6 py-3 bg-apple-accent text-white rounded-lg">
              <Download className="w-5 h-5" />
              <span>Download PDF</span>
            </button>
            <button className="card px-6 py-3 rounded-lg text-apple-text hover:shadow-elevated transition-all flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>View arXiv Preprint</span>
            </button>
          </div>
        </motion.div>

        {/* Table of Contents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card rounded-2xl p-6 mb-8"
        >
          <h3 className="text-lg font-medium mb-4" style={{ color: '#1D1D1F' }}>Table of Contents</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {sections.map((section, index) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-apple-gray transition-colors group"
              >
                <section.icon className="w-5 h-5 text-apple-accent" />
                <span className="text-sm text-apple-secondary group-hover:text-apple-text">{section.title}</span>
              </a>
            ))}
          </div>
        </motion.div>

        {/* Abstract */}
        <motion.section
          id="abstract"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card rounded-2xl p-8 mb-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-apple-gray flex items-center justify-center">
              <FileText className="w-5 h-5 text-apple-accent" />
            </div>
            <h2 className="text-2xl font-semibold" style={{ color: '#1D1D1F' }}>Abstract</h2>
          </div>
          <p className="text-apple-secondary leading-relaxed text-justify" style={{ lineHeight: 1.7 }}>
            Coronary artery stenosis is a critical cardiovascular condition that requires accurate and timely diagnosis
            for effective treatment planning. This study presents a comprehensive deep learning approach for automated
            stenosis detection and segmentation in coronary angiography images using the YOLOv8 (You Only Look Once version 8)
            family of models. We evaluated six variants of YOLOv8—three detection models (YOLOv8n, YOLOv8s, YOLOv8m) and
            three segmentation models (YOLOv8n-seg, YOLOv8s-seg, YOLOv8m-seg)—on the ARCADE dataset. Our results demonstrate
            that YOLOv8m achieves the highest detection performance with an mAP50 of 86.7%, while YOLOv8m-seg provides
            superior segmentation with an IoU of 0.79. We further incorporate Explainable AI (XAI) techniques using Grad-CAM
            heatmaps to provide visual interpretability of model decisions. This work contributes to the growing field of
            AI-assisted cardiovascular diagnosis by offering a robust, real-time solution for stenosis analysis with
            clinically interpretable outputs.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {['Deep Learning', 'YOLOv8', 'Coronary Artery', 'Stenosis Detection', 'Medical Imaging', 'XAI'].map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full text-xs bg-apple-gray text-apple-secondary border border-apple-border">
                {tag}
              </span>
            ))}
          </div>
        </motion.section>

        {/* Introduction */}
        <motion.section
          id="introduction"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="card rounded-2xl p-8 mb-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-apple-gray flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-apple-accent" />
            </div>
            <h2 className="text-2xl font-semibold" style={{ color: '#1D1D1F' }}>Introduction</h2>
          </div>
          <div className="space-y-4 text-apple-secondary" style={{ lineHeight: 1.7 }}>
            <p>
              Cardiovascular diseases (CVDs) remain the leading cause of mortality worldwide, accounting for approximately
              17.9 million deaths annually according to the World Health Organization. Coronary artery stenosis, the
              narrowing of coronary arteries due to plaque buildup, is a primary contributor to coronary artery disease
              (CAD) and requires accurate diagnosis for appropriate clinical intervention.
            </p>
            <p>
              Traditional diagnosis of stenosis relies on coronary angiography, an invasive imaging procedure that
              visualizes the coronary arteries using X-ray imaging and contrast agents. However, manual interpretation
              of angiograms is subject to inter-observer variability and requires significant expertise. The emergence
              of deep learning, particularly convolutional neural networks (CNNs), has opened new possibilities for
              automated and objective stenosis analysis.
            </p>
            <p>
              This study leverages YOLOv8, the latest iteration of the YOLO family of real-time object detectors, for
              simultaneous detection and segmentation of stenotic regions in coronary angiography images. Our contributions
              include:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Comprehensive evaluation of multiple YOLOv8 variants for stenosis detection</li>
              <li>Instance segmentation analysis for precise stenosis boundary delineation</li>
              <li>Integration of Grad-CAM explainability for clinical interpretability</li>
              <li>Public benchmark results on the ARCADE dataset for future research comparison</li>
            </ul>
          </div>
        </motion.section>

        {/* Methodology */}
        <motion.section
          id="methodology"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="card rounded-2xl p-8 mb-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-apple-gray flex items-center justify-center">
              <Microscope className="w-5 h-5 text-apple-accent" />
            </div>
            <h2 className="text-2xl font-semibold" style={{ color: '#1D1D1F' }}>Methodology</h2>
          </div>
          <div className="space-y-6 text-apple-secondary" style={{ lineHeight: 1.7 }}>
            <div>
              <h3 className="text-lg font-medium mb-3" style={{ color: '#1D1D1F' }}>Overall Pipeline</h3>
              <p className="leading-relaxed">
                Our methodology consists of four main stages: (1) data preprocessing and augmentation, (2) model training
                with optimized hyperparameters, (3) inference and post-processing, and (4) explainability analysis using
                Grad-CAM. The pipeline is designed to handle the unique challenges of coronary angiography images,
                including low contrast, motion artifacts, and complex anatomical structures.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3" style={{ color: '#1D1D1F' }}>Preprocessing</h3>
              <p className="leading-relaxed">
                Input images were resized to 640x640 pixels and normalized using ImageNet mean and standard deviation.
                We applied data augmentation techniques including random horizontal flipping, rotation (±15 degrees),
                color jittering, and mosaic augmentation to improve model generalization. Contrast-limited adaptive
                histogram equalization (CLAHE) was optionally applied to enhance vessel visibility.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3" style={{ color: '#1D1D1F' }}>Training Configuration</h3>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div className="card rounded-xl p-4">
                  <p className="text-sm text-apple-tertiary mb-2">Optimizer</p>
                  <p className="font-medium text-apple-text">AdamW</p>
                </div>
                <div className="card rounded-xl p-4">
                  <p className="text-sm text-apple-tertiary mb-2">Learning Rate</p>
                  <p className="font-medium text-apple-text">0.001 (cosine decay)</p>
                </div>
                <div className="card rounded-xl p-4">
                  <p className="text-sm text-apple-tertiary mb-2">Batch Size</p>
                  <p className="font-medium text-apple-text">16</p>
                </div>
                <div className="card rounded-xl p-4">
                  <p className="text-sm text-apple-tertiary mb-2">Epochs</p>
                  <p className="font-medium text-apple-text">100</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Dataset */}
        <motion.section
          id="dataset"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="card rounded-2xl p-8 mb-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-apple-gray flex items-center justify-center">
              <Database className="w-5 h-5 text-apple-accent" />
            </div>
            <h2 className="text-2xl font-semibold" style={{ color: '#1D1D1F' }}>Dataset (ARCADE)</h2>
          </div>
          <div className="space-y-4 text-apple-secondary" style={{ lineHeight: 1.7 }}>
            <p>
              We utilized the ARCADE (Angiography Images for Coronary Artery Disease Evaluation) dataset, a publicly
              available collection of coronary angiography images annotated by experienced cardiologists. The dataset
              contains images from multiple views (LAO, RAO, cranial, caudal) with varying degrees of stenosis severity.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 mt-4">
              <div className="card rounded-xl p-4 text-center">
                <p className="text-3xl font-semibold" style={{ color: '#0071E3' }}>2,847</p>
                <p className="text-sm text-apple-secondary mt-1">Total Images</p>
              </div>
              <div className="card rounded-xl p-4 text-center">
                <p className="text-3xl font-semibold" style={{ color: '#0071E3' }}>1,523</p>
                <p className="text-sm text-apple-secondary mt-1">Stenosis Cases</p>
              </div>
              <div className="card rounded-xl p-4 text-center">
                <p className="text-3xl font-semibold" style={{ color: '#0071E3' }}>80/20</p>
                <p className="text-sm text-apple-secondary mt-1">Train/Test Split</p>
              </div>
            </div>
            <p>
              Annotations include bounding boxes for stenosis regions and pixel-level segmentation masks for affected
              arterial segments. Severity labels (mild: &lt;50%, moderate: 50-70%, severe: &gt;70% diameter reduction)
              were provided based on quantitative coronary angiography measurements.
            </p>
          </div>
        </motion.section>

        {/* Model Architecture */}
        <motion.section
          id="architecture"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="card rounded-2xl p-8 mb-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-apple-gray flex items-center justify-center">
              <Brain className="w-5 h-5 text-apple-accent" />
            </div>
            <h2 className="text-2xl font-semibold" style={{ color: '#1D1D1F' }}>Model Architecture (YOLOv8)</h2>
          </div>
          <div className="space-y-4 text-apple-secondary" style={{ lineHeight: 1.7 }}>
            <p>
              YOLOv8 employs a modified CSPDarknet backbone with C2f modules for efficient feature extraction, a
              PANet-based neck for multi-scale feature fusion, and a decoupled head for separate classification
              and regression tasks. The architecture supports both object detection and instance segmentation
              through an additional mask prediction branch.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="card rounded-xl p-4">
                <h4 className="text-apple-accent font-semibold mb-2">YOLOv8n/n-seg</h4>
                <p className="text-sm text-apple-tertiary">Nano variant with 3.0M parameters, optimized for edge deployment and real-time inference.</p>
              </div>
              <div className="card rounded-xl p-4">
                <h4 className="text-apple-accent font-semibold mb-2">YOLOv8s/s-seg</h4>
                <p className="text-sm text-apple-tertiary">Small variant with 11.2M parameters, balancing accuracy and computational efficiency.</p>
              </div>
              <div className="card rounded-xl p-4">
                <h4 className="text-apple-accent font-semibold mb-2">YOLOv8m/m-seg</h4>
                <p className="text-sm text-apple-tertiary">Medium variant with 25.9M parameters, achieving highest accuracy for clinical applications.</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Results */}
        <motion.section
          id="results"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="card rounded-2xl p-8 mb-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-apple-gray flex items-center justify-center">
              <Target className="w-5 h-5 text-apple-accent" />
            </div>
            <h2 className="text-2xl font-semibold" style={{ color: '#1D1D1F' }}>Results & Analysis</h2>
          </div>
          <div className="space-y-6 text-apple-secondary" style={{ lineHeight: 1.7 }}>
            <div>
              <h3 className="text-lg font-medium mb-3" style={{ color: '#1D1D1F' }}>Detection Performance</h3>
              <p className="leading-relaxed mb-4">
                YOLOv8m achieved the highest mAP50 of 86.7% with precision of 0.89 and recall of 0.84. The nano variant
                (YOLOv8n) demonstrated competitive performance with 78.2% mAP50 while being 3.75x faster in inference,
                making it suitable for resource-constrained environments.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3" style={{ color: '#1D1D1F' }}>Segmentation Performance</h3>
              <p className="leading-relaxed mb-4">
                For instance segmentation, YOLOv8m-seg achieved an IoU of 0.79, demonstrating accurate delineation of
                stenotic arterial segments. The segmentation branch effectively captured the irregular boundaries
                characteristic of atherosclerotic plaques.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3" style={{ color: '#1D1D1F' }}>Explainability Analysis</h3>
              <p className="leading-relaxed">
                Grad-CAM heatmaps revealed that models primarily attend to the stenotic regions and adjacent vessel
                segments, aligning with cardiologist interpretation patterns. This visual interpretability enhances
                clinical trust and facilitates error analysis.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Conclusion */}
        <motion.section
          id="conclusion"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="card rounded-2xl p-8"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-apple-gray flex items-center justify-center">
              <Layers className="w-5 h-5 text-apple-accent" />
            </div>
            <h2 className="text-2xl font-semibold" style={{ color: '#1D1D1F' }}>Conclusion</h2>
          </div>
          <div className="space-y-4 text-apple-secondary" style={{ lineHeight: 1.7 }}>
            <p>
              This study demonstrates the effectiveness of YOLOv8 models for automated stenosis detection and
              segmentation in coronary angiography images. The multi-model comparison provides practitioners with
              options ranging from edge-deployable nano variants to high-accuracy medium models. The integration
              of explainability techniques addresses the "black box" concern often raised in medical AI applications.
            </p>
            <p>
              Future work will explore cross-dataset validation, 3D reconstruction from multiple angiographic views,
              and prospective clinical validation. The code and trained models will be made publicly available to
              facilitate reproducibility and further research in AI-assisted cardiovascular diagnosis.
            </p>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
