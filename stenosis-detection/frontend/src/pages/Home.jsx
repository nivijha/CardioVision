import { Link } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';

export default function Home() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      
      <section className="w-full min-h-[calc(100vh-64px)] flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden">
        {/* Subtle grid background for premium tech feel */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none w-full h-full"></div>

        <div className="max-w-4xl mx-auto w-full relative z-10 flex flex-col items-center text-center">
          <SectionHeader 
            title={<>Coronary Artery Stenosis<br className="hidden md:block"/> Detection and Segmentation</>}
            subtitle="Core Diagnostic Pipeline"
          />
          
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl leading-relaxed">
            A precise, deep learning-based diagnostic pipeline utilizing YOLOv8 to automate tracking and stenosis identification in cardiology imaging.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
            <Link to="/predict" className="bg-red-600 text-white px-8 py-3.5 text-sm font-bold uppercase tracking-wide hover:bg-red-700 transition w-full sm:w-auto text-center">
              Run Inference System
            </Link>
            <Link to="/research" className="border-2 border-gray-900 text-gray-900 bg-white px-8 py-3.5 text-sm font-bold uppercase tracking-wide hover:bg-gray-900 hover:text-white transition w-full sm:w-auto text-center">
              Read Methodology
            </Link>
          </div>
        </div>
      </section>

      {/* Info Grid */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 lg:gap-24">
          
          <div className="space-y-16 lg:pr-12">
            <div className="hover:pl-4 transition-all border-l-2 border-transparent hover:border-red-600">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-red-600 font-bold bg-white border border-red-100 px-2.5 py-1 text-xs tracking-wider uppercase">Dataset #1</span>
                <h3 className="text-xl font-bold text-gray-900">ARCADE Validation</h3>
              </div>
              <p className="text-gray-600 text-base leading-relaxed">
                Aggregating ~3000 high-resolution (512×512) clinical angiography samples encoded with rigorous COCO format bounding box and mask delineations.
              </p>
            </div>

            <div className="hover:pl-4 transition-all border-l-2 border-transparent hover:border-red-600">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-red-600 font-bold bg-white border border-red-100 px-2.5 py-1 text-xs tracking-wider uppercase">Dataset #2</span>
                <h3 className="text-xl font-bold text-gray-900">CADICA Integration</h3>
              </div>
              <p className="text-gray-600 text-base leading-relaxed">
                Deployed strictly as an evaluation corpus, demonstrating exact real-world zero-shot scalability and clinical variance adaptation.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center border-l-0 lg:border-l border-gray-200 lg:pl-16 relative">
            <h2 className="text-sm font-bold text-gray-900 mb-10 tracking-widest uppercase">System Architecture Pipeline</h2>
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px before:h-full before:w-[2px] before:bg-red-100 before:z-0">
              {[
                "Input Angiography Frame",
                "Normalization & Preprocessing",
                "YOLOv8 Network Inference",
                "Simultaneous Detection / Segmentation",
                "Severity Output Localization"
              ].map((step, idx) => (
                <div key={idx} className="relative z-10 flex items-center gap-6 group">
                  <div className="w-6 h-6 rounded-full bg-white border-[5px] border-red-600 flex-shrink-0 transition-transform group-hover:scale-110"></div>
                  <div className="font-semibold text-gray-800 text-base">
                    {step}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
