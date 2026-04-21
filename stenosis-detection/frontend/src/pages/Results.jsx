export default function Results() {
  const segmentationArcade = [
    { model: 'YOLOv8n', precision: '0.421', recall: '0.381', map50: '0.327', map95: '0.120' },
    { model: 'YOLOv8s', precision: '0.447', recall: '0.413', map50: '0.354', map95: '0.124' },
    { model: 'YOLOv8m', precision: '-', recall: '-', map50: '-', map95: '-' },
  ];

  const detectionArcade = [
    { model: 'YOLOv8n', precision: '0.327', recall: '0.323', map50: '0.262', map95: '0.095' },
    { model: 'YOLOv8s', precision: '0.305', recall: '0.335', map50: '0.223', map95: '0.085' },
    { model: 'YOLOv8m', precision: '-', recall: '-', map50: '-', map95: '-' },
  ];

  const detectionCadica = [
    { model: 'YOLOv8n', precision: '0.942', recall: '0.960', map50: '0.940', map95: '0.550' },
    { model: 'YOLOv8s', precision: '0.9156', recall: '0.903', map50: '0.9443', map95: '0.561' },
    { model: 'YOLOv8m', precision: '-', recall: '-', map50: '-', map95: '-' },
  ];

  const Table = ({ data, title }) => (
    <div className="mb-16">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-6 bg-red-600"></div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h2>
      </div>
      <div className="border border-gray-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm text-gray-900 border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-900">
              <th className="px-6 py-4 text-left font-bold text-gray-900 uppercase tracking-widest text-xs bg-gray-50">Model</th>
              <th className="px-6 py-4 text-right font-bold text-gray-900 uppercase tracking-widest text-xs bg-gray-50">Precision</th>
              <th className="px-6 py-4 text-right font-bold text-gray-900 uppercase tracking-widest text-xs bg-gray-50">Recall</th>
              <th className="px-6 py-4 text-right font-bold text-gray-900 uppercase tracking-widest text-xs bg-gray-50">mAP@0.5</th>
              <th className="px-6 py-4 text-right font-bold text-gray-900 uppercase tracking-widest text-xs bg-gray-50">mAP@0.5:0.95</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-5 font-bold">{row.model}</td>
                <td className="px-6 py-5 text-right font-medium text-gray-600">{row.precision}</td>
                <td className="px-6 py-5 text-right font-medium text-gray-600">{row.recall}</td>
                <td className="px-6 py-5 text-right font-bold text-red-600">{row.map50}</td>
                <td className="px-6 py-5 text-right font-medium text-gray-600">{row.map95}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-6">

        <div className="mb-20">
          <div className="w-12 h-1 bg-red-600 mb-6"></div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4 leading-tight">Performance Evaluations</h1>
          <p className="text-sm font-bold tracking-widest text-gray-400 uppercase">Empirical Model Metrics</p>
        </div>

        <Table title="Segmentation Analysis: ARCADE Core" data={segmentationArcade} />
        <Table title="Detection Analysis: ARCADE Core" data={detectionArcade} />
        <Table title="Detection Analysis: CADICA Core" data={detectionCadica} />

        <div className="border-t-2 border-gray-900 pt-16 mt-8">
          <h2 className="text-2xl font-bold mb-8 text-gray-900 tracking-tight">Analytical Observations</h2>
          <div className="bg-gray-50 p-8 border border-gray-200">
            <ul className="space-y-4 text-gray-800 font-medium text-base">
              <li className="flex gap-4">
                <span className="text-red-600 font-bold">01/</span>
                YOLOv8s establishes statistical dominance natively within isolated segmentation parameters.
              </li>
              <li className="flex gap-4">
                <span className="text-red-600 font-bold">02/</span>
                Architectural limits scale proportionally dataset quality restrictions over parameter count.
              </li>
              <li className="flex gap-4">
                <span className="text-red-600 font-bold">03/</span>
                Inference precision demonstrates radical stabilization when evaluated symmetrically on clinical CADICA fields.
              </li>
              <li className="flex gap-4">
                <span className="text-red-600 font-bold">04/</span>
                Nano configurations (YOLOv8n) remain viably optimized for real-time edge throughput systems.
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
