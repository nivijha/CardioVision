import SectionHeader from '../components/SectionHeader';

export default function Research() {
  const sections = [
    {
      title: "Abstract",
      content: "This project presents a deep learning-based approach for automated detection and segmentation of coronary artery stenosis from angiography images. Utilizing the YOLOv8 architecture, the model identifies and segments stenotic locations within vascular mappings to objectively scale quantitative assessments."
    },
    {
      title: "Introduction",
      content: "Coronary artery disease dictates a disproportionate volume of global mortality trends. Accurate detection of stenosis relies on structural evaluation of blood vessels in angiography imagery. Deploying convolutional network methods directly minimizes manual calculation drift and standardizes anatomical observations."
    },
    {
      title: "Methodology Arrays",
      content: "The workflow initiates around instance segmentation variations of YOLOv8. The network executes bounding box localization coordinates synchronously with contour extraction to decouple semantic masks from arbitrary angiogram artifacts."
    },
    {
      title: "Dataset Infrastructure",
      content: "ARCADE formulation generated the training baseline representing ~3,000 spatial samples fixed at 512×512 resolution thresholds. The distinct CADICA clinical dataset enabled zero-shot validation environments verifying structural robustness beyond training distributions."
    },
    {
      title: "Architectural Topology",
      content: "Network topology embeds a CSPDarknet core driving feature extraction routines into a Feature Pyramid Network. Computations are split at the decoupled head enabling independent optimizations for logical objectness, classification scoring, and mask probability generation."
    },
    {
      title: "Results Diagnostics",
      content: "Performance evaluations confirm YOLOv8s generated an objective optimization peak (Precision: 0.447) handling the ARCADE dataset. Mapping models onto identical constraints over CADICA produced significant mean average precision alignment."
    },
    {
      title: "Limitations",
      list: [
        "Contrast degradation in clinical hardware limits localized feature tracking.",
        "Diminished spatial constraints evaluating micro-lesion variations.",
        "Direct clinical severity mappings stringently require external regression tuning.",
        "Data distribution generalizations remain fixed against available public repository variations."
      ]
    },
    {
      title: "Conclusion",
      content: "The formulation of localized YOLOv8 paradigms validates high-availability inference channels for coronary flow obstructions, securing a formidable pipeline capable of expanding deep-learning assisted diagnostic interventions."
    }
  ];

  return (
    <div className="bg-white min-h-screen py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-6">
        
        <SectionHeader 
          title={<>Project Mechanics<br/>& Documentation</>}
          subtitle="Methodological Frameworks"
          className="mb-20"
        />

        <div className="space-y-16">
          {sections.map((section, idx) => (
            <div key={idx} className="group">
              <div className="flex flex-col md:flex-row gap-4 md:gap-12 items-baseline">
                <div className="md:w-32 flex-shrink-0">
                  <span className="text-xs font-bold text-red-600 tracking-widest uppercase">
                    Section {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">{section.title}</h2>
                  {section.content && (
                    <p className="text-base text-gray-600 leading-relaxed font-medium">
                      {section.content}
                    </p>
                  )}
                  {section.list && (
                    <ul className="space-y-3 mt-4 text-base text-gray-600 font-medium">
                      {section.list.map((item, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="text-red-500">—</span> {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
