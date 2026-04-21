export default function About() {
  return (
    <div className="bg-white min-h-screen py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-6">

        <div className="mb-20">
          <div className="w-12 h-1 bg-red-600 mb-6"></div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4 leading-tight">Project Metadata</h1>
          <p className="text-sm font-bold tracking-widest text-gray-400 uppercase">Development Architecture</p>
        </div>

        {/* Timeline Grid */}
        <div className="mb-24">
          <div className="flex items-center gap-3 mb-8 border-b-2 border-gray-900 pb-4">
            <span className="text-sm font-bold text-gray-900 uppercase tracking-widest">Development Schedule</span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 border border-gray-200">
            <div className="bg-white p-6 md:p-8 hover:bg-gray-50 transition-colors">
              <span className="text-xs font-bold text-red-600 tracking-widest uppercase mb-2 block">Phase 01</span>
              <h3 className="text-xl font-bold text-gray-900 mb-3">January</h3>
              <p className="text-sm text-gray-600 font-medium">Literature review frameworks spanning 2021–2025.</p>
            </div>
            <div className="bg-white p-6 md:p-8 hover:bg-gray-50 transition-colors">
              <span className="text-xs font-bold text-red-600 tracking-widest uppercase mb-2 block">Phase 02</span>
              <h3 className="text-xl font-bold text-gray-900 mb-3">February</h3>
              <p className="text-sm text-gray-600 font-medium">Dataset normalization and architectural planning.</p>
            </div>
            <div className="bg-white p-6 md:p-8 hover:bg-gray-50 transition-colors">
              <span className="text-xs font-bold text-red-600 tracking-widest uppercase mb-2 block">Phase 03</span>
              <h3 className="text-xl font-bold text-gray-900 mb-3">March</h3>
              <p className="text-sm text-gray-600 font-medium">Model propagation and web interface initialization.</p>
            </div>
            <div className="bg-white p-6 md:p-8 hover:bg-gray-50 transition-colors">
              <span className="text-xs font-bold text-red-600 tracking-widest uppercase mb-2 block">Phase 04</span>
              <h3 className="text-xl font-bold text-gray-900 mb-3">April</h3>
              <p className="text-sm text-gray-600 font-medium">Final network validation and research compiling.</p>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-24">
          <div className="flex items-center gap-3 mb-8 border-b-2 border-gray-900 pb-4">
            <span className="text-sm font-bold text-gray-900 uppercase tracking-widest">Stack Engineering</span>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="border border-gray-200 p-8 shadow-sm hover:border-red-300 hover:shadow-md transition-all cursor-default">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><span className="w-2 h-2 bg-red-600 rounded-full"></span> Client System</h3>
              <ul className="text-sm text-gray-600 space-y-4 font-medium">
                <li className="flex justify-between border-b border-gray-100 pb-2"><span>Framework</span> <span className="text-gray-900">React + Vite</span></li>
                <li className="flex justify-between border-b border-gray-100 pb-2"><span>Architecture</span> <span className="text-gray-900">Tailwind CSS</span></li>
                <li className="flex justify-between border-b border-gray-100 pb-2"><span>Data Protocol</span> <span className="text-gray-900">Axios REST Client</span></li>
              </ul>
            </div>
            <div className="border border-gray-200 p-8 shadow-sm hover:border-red-300 hover:shadow-md transition-all cursor-default">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><span className="w-2 h-2 bg-red-600 rounded-full"></span> Server System</h3>
              <ul className="text-sm text-gray-600 space-y-4 font-medium">
                <li className="flex justify-between border-b border-gray-100 pb-2"><span>Runtime</span> <span className="text-gray-900">FastAPI + Python</span></li>
                <li className="flex justify-between border-b border-gray-100 pb-2"><span>Tensor Engine</span> <span className="text-gray-900">PyTorch</span></li>
                <li className="flex justify-between border-b border-gray-100 pb-2"><span>Vision Core</span> <span className="text-gray-900">Ultralytics YOLOv8</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Team & Ack */}
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-6 bg-red-600"></div>
              <span className="text-sm font-bold text-gray-900 uppercase tracking-widest">Project Team</span>
            </div>
            <div className="space-y-6">
              <div className="bg-gray-50 border border-gray-200 p-5 hover:border-red-300 hover:bg-white transition-colors cursor-default">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Mentor</span>
                <span className="text-lg font-bold text-gray-900">Mr. Faisal Firdous</span>
              </div>
              <div className="border border-gray-200 p-5 hover:border-red-300 transition-colors cursor-default">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-3">Group Members</span>
                <ul className="grid grid-cols-2 gap-3 text-sm font-bold text-gray-900">
                  <li className="hover:text-red-700 transition-colors">Nivi Jha</li>
                  <li className="hover:text-red-700 transition-colors">Aarya Gupta</li>
                  <li className="hover:text-red-700 transition-colors">Raavi Aggarwal</li>
                  <li className="hover:text-red-700 transition-colors">Darshika Tyagi</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-end">
            <div className="border border-gray-200 bg-gray-50 p-8 hover:bg-white hover:border-gray-300 transition-all cursor-default">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Academic Notice</h3>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                Formulated exclusively for research evaluations to demonstrate deep learning pathology integration. We recognize dataset providers and university mentors involved. Not provisioned for direct clinical inference.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
