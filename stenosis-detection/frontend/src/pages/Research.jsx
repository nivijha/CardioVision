import { useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, FileText, Search, User, Filter, ChevronDown, ChevronUp } from 'lucide-react';

const papers = [
  {
    id: "nivi-2",
    author: "Nivi Jha",
    title: "Machine Learning-Based Prediction of Coronary Artery Disease Using Clinical and Behavioral Data: A Comparative Study",
    year: "2026",
    bullets: [
      "**Clinical Focus**: Early prediction of Coronary Artery Disease (CAD) using demographic, clinical, biochemical, and behavioral data.",
      "**Dataset**: Retrospective cohort of 300 adults (165 CAD patients, 135 controls).",
      "**Technical Setup**: Evaluated k-NN, SVM, ANN, Logistic Regression, Naïve Bayes, and Decision Trees using 10-fold cross-validation.",
      "**Key Results**: k-NN achieved **98.33% accuracy** and **0.99 AUC**, followed by SVM (96.67%) and ANN (95.33%).",
      "**Top Predictors**: Glucose, LDL-C, and waist circumference were the top 3 predictors. Mindful eating scores were lower in the CAD cohort.",
      "**CardioVision Influence**: Connected focal stenosis diagnosis to broader patient metabolic profiles and systemic indicators."
    ]
  },
  {
    id: "nivi-1",
    author: "Nivi Jha",
    title: "Integrated deep learning model for automatic detection and classification of stenosis in coronary angiography",
    year: "2025",
    bullets: [
      "**Clinical Focus**: Automated localization and classification of RCA stenosis (25%–70% and 70%–100% severity brackets).",
      "**Dataset**: 1,606 annotated RCA images from 132 patients over 18 years old, converted from DICOM to BMP.",
      "**Technical Setup**: YOLOv5 & YOLOv7 models, Mosaic + Mixup-4 augmentations, and CIoU loss.",
      "**Key Results**: YOLOv5l achieved **88.9% accuracy**, **85.4% recall**, and **0.875 mAP**.",
      "**Key Finding**: 25%–70% stenosis detection was higher than 70%–100%. Boundary regions between stenosis and background caused the most errors.",
      "**CardioVision Influence**: Guided our frontend approach of hosting deep learning models in a decoupled visual web interface."
    ]
  },
  {
    id: "darshika-1",
    author: "Darshika Tyagi",
    title: "DCA-YOLOv8: A Novel Framework Combined with AICI Loss Function for Coronary Artery Stenosis Detection",
    year: "2024",
    bullets: [
      "**Clinical Focus**: Stenosis detection in low-contrast, noisy, and complex coronary angiography.",
      "**Technical Framework**: Proposed DCA-YOLOv8, adding HEC Preprocessing, Double Coordinate Attention, and AICI Loss to YOLOv8.",
      "**HEC Preprocessing**: Histogram Equalization (improves contrast) + Canny Edge Detection (highlights vessel boundaries).",
      "**Custom Layers**: DCA module helps the model focus on vessel geometry. AICI Loss enhances bounding box regression on small objects.",
      "**Key Results**: **96.62% precision**, **95.06% recall**, **95.83% F1-score**, and **97.6% mAP** (exceeds YOLOv5 and YOLOv7).",
      "**Limitations**: Binary classification only (indicates presence/absence); does not classify stenosis severity.",
      "**CardioVision Influence**: Confirmed the high suitability of YOLOv8 for coronary angiography and shaped our image preprocessing choices."
    ]
  },
  {
    id: "darshika-2",
    author: "Darshika Tyagi",
    title: "LT-YOLO: long-term temporal enhanced YOLO for stenosis detection on invasive coronary angiography",
    year: "2024",
    bullets: [
      "**Clinical Focus**: Fusing spatiotemporal video sequence data for automated stenosis detection and severity scaling.",
      "**Dataset**: 350 invasive coronary angiography (ICA) videos representing 3 severity levels (<50%, 50%–70%, >70%).",
      "**Technical Setup**: Spatially Aware Backbone (YOLOv8 + Dynamic Transformer), Spatial-Temporal Fusion Neck (Mamba model), Detail-Aware Head (cross-attention).",
      "**Key Results**: LT-YOLO improved mAP by **2.9% to 16.2%** over standard models, showing huge gains in identifying small (<50%) lesions.",
      "**Key Finding**: Mamba state-space models successfully capture long-term motion patterns and vessel-background changes.",
      "**CardioVision Influence**: Inspired our long-term roadmap to expand from single-frame inputs to angiography video sequences."
    ]
  },
  {
    id: "darshika-3",
    author: "Darshika Tyagi",
    title: "A Preprocessing Method for Coronary Artery Stenosis Detection Based on Deep Learning",
    year: "2024",
    bullets: [
      "**Clinical Focus**: Enhancing fine branch vessel stenosis and resolving uneven contrast in angiography scans.",
      "**Dataset**: 250 angiography images from 20 patients taken at 6 different imaging angles.",
      "**HEV Preprocessing**: Hessian matrix + Frangi vesselness filter (HFV) to isolate tubular vessel structures, fused with original images using the IHS color model.",
      "**Key Results**: Preprocessing improved YOLOv4's mAP by **118%–135%** and R-FCN InceptionResNetv2 mAP to **0.7551** (a 102%–111% boost).",
      "**Key Finding**: Enhancement filters are crucial; without them, basic models failed to detect minor branch stenosis (YOLOv4 mAP was 0.27).",
      "**CardioVision Influence**: Influenced our backend's preprocessing routine to apply custom contrast corrections on user-uploaded files."
    ]
  },
  {
    id: "raavi-2",
    author: "Raavi Aggarwal",
    title: "YOLO-Angio: An Algorithm for Coronary Anatomy Segmentation",
    year: "2023",
    bullets: [
      "**Clinical Focus**: Automated coronary artery segmentation and reconstruction from angiograms.",
      "**Dataset**: 1,500 ARCADE angiograms at 512x512 resolution (MICCAI 2023 Challenge).",
      "**Processing Pipeline**: 1) Homomorphic contrast enhancement; 2) YOLOv8 segmentation backbone; 3) Graph-based logical anatomical validation.",
      "**Key Results**: Placed **3rd globally** in the ARCADE challenge, yielding a validation F1 of **0.422** and hold-out F1 of **0.4289**.",
      "**Ablation Performance**: Baseline YOLO F1 of **0.27** was improved to **0.31** (homomorphic enhancement), **0.37** (ensembling), and **0.4289** (graph-based validation).",
      "**CardioVision Influence**: Directly validated using the ARCADE dataset and highlighted the need to pair deep learning with anatomical post-processing."
    ]
  },
  {
    id: "aarya-1",
    author: "Aarya Gupta",
    title: "Evaluation of a deep learning model on coronary CT angiography for automatic stenosis detection",
    year: "2022",
    bullets: [
      "**Clinical Focus**: Automated severity assessment of CCTA scans based on the CAD-RADS scale.",
      "**Dataset**: 10,800 curved multiplanar reformatted (MPR) images of 3 principal coronary arteries from 400 patients.",
      "**Technical Setup**: Inception-style CNN optimized for small calcifications and faint narrowing, validated against expert consensus.",
      "**Key Results**: **81% accuracy** for 3-class CAD-RADS. **96% accuracy** (0.85 Cohen's kappa) for binary threshold (<50% vs. ≥50%).",
      "**Performance**: Reaching 96% binary accuracy matched senior readers and outperformed junior readers. 87% of errors were mild CAD-RADS 1 cases.",
      "**CardioVision Influence**: Inspired our multi-level severity brackets (Minimal to Severe) in diagnostic reports."
    ]
  },
  {
    id: "aarya-2",
    author: "Aarya Gupta",
    title: "Deep learning-based detection of functionally significant stenosis in coronary CT angiography",
    year: "2022",
    bullets: [
      "**Clinical Focus**: Non-invasive estimation of FFR values to detect functionally significant stenosis (FFR ≤ 0.8) from CCTA scans.",
      "**Dataset**: CCTA scans from 569 patients (514 vessels with invasive FFR as reference).",
      "**Technical Setup**: Centerline trees extracted for multiplanar reformations. CNN + Transformer with spatial attention mechanism.",
      "**Key Results**: Artery-level **AUC of 0.78** (accuracy 79%) and patient-level accuracy of **80%**. Regression-only FFR reached **0.83 AUC**.",
      "**Key Finding**: Lumen area was the most critical feature. Referring the top 20% most uncertain cases to invasive FFR raised sensitivity to **92%**.",
      "**CardioVision Influence**: Prompted our use of segmentations to map the vessel lumen area and highlight narrowing."
    ]
  }  
];

export default function Research() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("All");
  const [expandedId, setExpandedId] = useState(null);

  const authors = ["All", "Nivi Jha", "Aarya Gupta", "Darshika Tyagi", "Raavi Aggarwal"];

  const filteredPapers = papers.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          paper.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          paper.bullets.some(bullet => bullet.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesAuthor = selectedAuthor === "All" || paper.author === selectedAuthor;
    return matchesSearch && matchesAuthor;
  });

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="bg-white min-h-screen py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-6">
        
        <SectionHeader 
          title={<>Research Foundation<br/>& Project Motivation</>}
          subtitle="Literature Review & Clinical Background"
          className="mb-16"
        />

        {/* Project Motivation Section */}
        <div className="mb-20 bg-gray-50 border border-gray-100 p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-red-600"></div>
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-red-600 font-bold bg-white border border-red-100 px-2.5 py-1 text-xs tracking-wider uppercase">Project Genesis</span>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Why We Built CardioVision</h2>
            </div>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed font-medium mb-6">
              Cardiovascular diseases, particularly coronary artery disease, remain a leading cause of global mortality. While coronary angiography is the gold-standard diagnostic tool, manual evaluation of stenotic lesions is highly dependent on operator expertise, introduces inter-observer variability, and is time-intensive.
            </p>
            <p className="text-base text-gray-600 leading-relaxed font-medium mb-8">
              Our team—<strong>Nivi, Aarya, Darshika, and Raavi</strong>—embarked on this project to bridge the gap between theoretical deep learning models and direct clinical utility. By reading and synthesizing multiple cutting-edge studies on YOLO architectures, CCTA, vessel preprocessing, and temporal sequence learning, we designed CardioVision. The project combines YOLOv8-based instance segmentation with an automated severity scaling algorithm into a high-availability, responsive web-based diagnostic companion.
            </p>
            <div className="grid sm:grid-cols-3 gap-6 border-t border-gray-200 pt-8">
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Our Core Objective</h4>
                <p className="text-sm font-bold text-gray-900">Decouple AI Inference from Complex Hardware Constraints</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Key Inspiration</h4>
                <p className="text-sm font-bold text-gray-900">DCA-YOLOv8, LT-YOLO, & the MICCAI ARCADE Benchmarks</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Clinical Alignment</h4>
                <p className="text-sm font-bold text-gray-900">Quantifiable Occlusion Percentages vs. Standard CAD-RADS</p>
              </div>
            </div>
          </div>
        </div>

        {/* Literature Review Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">Literature Review Directory</h2>
            <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider">Academic papers audited by our group</p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="Search papers or key terms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 bg-gray-50 text-sm placeholder-gray-400 focus:outline-none focus:bg-white focus:border-red-500 transition-colors"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-gray-100 pb-4">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {authors.map((author) => (
            <button
              key={author}
              onClick={() => setSelectedAuthor(author)}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border transition-colors ${
                selectedAuthor === author
                  ? 'bg-red-600 border-red-600 text-white'
                  : 'bg-white border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              {author}
            </button>
          ))}
        </div>

        {/* Literature Review List */}
        <div className="space-y-6">
          {filteredPapers.length > 0 ? (
            filteredPapers.map((paper) => {
              const isExpanded = expandedId === paper.id;
              return (
                <div 
                  key={paper.id} 
                  className={`border transition-all duration-300 bg-white ${
                    isExpanded 
                      ? 'border-red-300 shadow-md ring-1 ring-red-100' 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  {/* Header/Summary Line */}
                  <div 
                    onClick={() => toggleExpand(paper.id)}
                    className="p-6 cursor-pointer flex items-start justify-between gap-6"
                  >
                    <div className="space-y-2 w-full">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 uppercase tracking-wider bg-red-50 px-2 py-0.5 border border-red-100">
                          <User className="w-3 h-3" /> {paper.author}
                        </span>
                        <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-0.5 border border-gray-100">
                          {paper.year}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 leading-snug tracking-tight hover:text-red-600 transition-colors">
                        {paper.title}
                      </h3>
                    </div>
                    <button 
                      className={`flex-shrink-0 p-1 rounded-full border transition-colors ${
                        isExpanded 
                          ? 'border-red-200 bg-red-50 text-red-600' 
                          : 'border-gray-200 bg-gray-50 text-gray-400 hover:text-gray-900'
                      }`}
                      aria-label={isExpanded ? "Collapse" : "Expand"}
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 border-t border-gray-100 pt-6 space-y-4">
                          <h4 className="font-bold text-gray-900 uppercase tracking-wider text-xs mb-2 flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-gray-400" /> Key Research Takeaways
                          </h4>
                          <ul className="space-y-3 text-sm text-gray-600 leading-relaxed font-medium">
                            {paper.bullets.map((bullet, index) => {
                              const parts = bullet.split(/(\*\*.*?\*\*)/g);
                              return (
                                <li key={index} className="flex items-start gap-2.5">
                                  <span className="text-red-500 mt-1 flex-shrink-0">•</span>
                                  <span>
                                    {parts.map((part, i) => {
                                      if (part.startsWith('**') && part.endsWith('**')) {
                                        return <strong key={i} className="text-gray-900 font-bold">{part.slice(2, -2)}</strong>;
                                      }
                                      return part;
                                    })}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 border border-dashed border-gray-200 text-gray-400">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No research papers match your criteria.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
