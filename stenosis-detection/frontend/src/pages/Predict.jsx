import { useState, useCallback, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

export default function Predict() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [imgDim, setImgDim] = useState({ w: 0, h: 0 });

  const selectedModel = 'YOLOv8s-seg';
  const prevModelRef = useRef(selectedModel);
  const abortControllerRef = useRef(null);

  const primaryDetection = result?.detections?.[0] || result;

  const handlePredict = useCallback(async (file) => {
    setLoading(true);
    setError(null);

    // Abort any ongoing request before starting a new one
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const formData = new FormData();
      formData.append('file', file);

      // model_name must be passed as a query string parameter for FastAPI to parse it
      const response = await axios.post('http://localhost:8000/predict', formData, {
        params: { model_name: selectedModel },
        headers: { 'Content-Type': 'multipart/form-data' },
        signal: abortControllerRef.current.signal,
      });

      setResult(response.data);
      setLoading(false);
    } catch (err) {
      if (axios.isCancel(err)) {
        // Request aborted cleanly, ignore error formatting
        console.log("Prediction request was safely aborted via clear.");
      } else {
        setError(err.message || 'Failed to process image');
        setLoading(false);
      }
    }
  }, [selectedModel]);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setError(null);
    setImgDim({ w: 0, h: 0 });

    await handlePredict(file);
  }, [handlePredict]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.bmp', '.tiff'] },
    multiple: false,
  });

  const resetAll = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLoading(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    setImgDim({ w: 0, h: 0 });
  };

  const isSevere = primaryDetection?.severity === 'severe';

  return (
    <div className="bg-white min-h-screen py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-6">

        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="w-12 h-1 bg-red-600 mb-6"></div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4 leading-tight">Diagnostic Inference Engine</h1>
            <p className="text-sm font-bold tracking-widest text-gray-400 uppercase">Automated Detection Sequence</p>
          </div>
          {selectedFile && (
            <button onClick={resetAll} className="px-6 py-3 bg-white border border-gray-300 text-sm font-bold text-gray-700 hover:text-red-700 hover:border-red-300 transition shadow-sm uppercase tracking-wide">
              Clear Image
            </button>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">

          {/* Upload System */}
          <div className="bg-white border border-gray-200 p-8 shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-6 bg-red-600"></div>
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Upload Image</h2>
            </div>

            <div className="flex-1 flex flex-col">
              {!selectedFile ? (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed flex-1 flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all min-h-[400px] ${isDragActive ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                >
                  <input {...getInputProps()} />
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                  </div>
                  <p className="text-gray-900 font-bold mb-2 text-lg">Drop angiography frame here</p>
                  <p className="text-gray-400 text-sm font-medium">Supports PNG, JPG, BMP formats</p>
                </div>
              ) : (
                <div className="border border-gray-200 bg-gray-50 flex-1 relative flex items-center justify-center overflow-hidden min-h-[400px]">
                  <img src={previewUrl} onLoad={(e) => setImgDim({ w: e.target.naturalWidth, h: e.target.naturalHeight })} alt="Source" className="object-contain w-full h-full p-2" />
                  {loading && (
                    <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center">
                      <div className="w-10 h-10 border-[4px] border-gray-200 border-t-red-600 rounded-full animate-spin mb-4"></div>
                      <span className="text-sm font-bold text-gray-900 tracking-wide uppercase">Executing Forward Pass</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-bold">
                Runtime Error: {error}
              </div>
            )}
          </div>

          {/* Inference Data */}
          <div className="bg-white border border-gray-200 p-8 shadow-sm flex flex-col min-h-[500px]">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-6 bg-red-600"></div>
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Model Predictions</h2>
            </div>

            {!result && !loading && (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-6 border-2 border-dashed border-gray-200 bg-gray-50/50 min-h-[400px]">
                <div className="w-16 h-16 bg-white rounded-full mb-6 flex items-center justify-center border border-gray-200 shadow-sm">
                  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <p className="text-gray-500 font-medium text-base mb-2">System idle</p>
                <p className="text-gray-400 text-sm">Validating inputs prior to rendering outputs.</p>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-10 animate-in fade-in duration-500 flex-1 flex flex-col">

                {/* Structural metrics */}
                <div>
                  <h3 className="text-xs uppercase text-gray-400 font-bold tracking-widest mb-4">Quantitative Analysis</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                    {result?.detections?.length > 0 && (
                      <div className="col-span-2 lg:col-span-3 bg-red-50 border border-red-200 p-3 text-xs text-red-800 font-bold uppercase tracking-widest flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        {result.detections.length > 1
                          ? `Critical severity driven by primary lesion out of ${result.detections.length} total mapped vectors. Origin BBox: [${result.bbox?.map(n => Math.round(n)).join(', ')}]`
                          : `Single pathology analyzed at structural BBox: [${result.bbox?.map(n => Math.round(n)).join(', ')}]`}
                      </div>
                    )}
                    <div className="border border-gray-200 p-5 bg-gray-50 hover:border-red-300 hover:bg-white transition-all cursor-default relative group">
                      <div className="text-xs text-gray-500 mb-2 font-bold tracking-wider hover:text-gray-900 transition-colors">STATUS</div>
                      <div className="text-sm font-bold text-gray-900">
                        {result.stenosis ? 'LESION DETECTED' : 'CLEAR FORMAT'}
                      </div>
                    </div>
                    <div className="border border-gray-200 p-5 bg-gray-50 hover:border-red-300 hover:bg-white transition-all cursor-default relative group">
                      <div className="text-xs text-gray-500 mb-2 font-bold tracking-wider hover:text-gray-900 transition-colors">STENOSIS %</div>
                      <div className="text-xl font-bold text-gray-900 flex items-baseline gap-1">
                        {(result.stenosis_percent ?? 0).toFixed(1)} <span className="text-xs font-bold text-gray-500">%</span>
                      </div>
                    </div>
                    <div className={`border p-5 transition-all cursor-default ${isSevere ? 'border-red-200 bg-red-50 hover:border-red-400 hover:bg-red-100' : 'border-gray-200 bg-gray-50 hover:border-red-300 hover:bg-white'}`}>
                      <div className={`text-xs mb-2 font-bold tracking-wider ${isSevere ? 'text-red-700' : 'text-gray-500'}`}>OVERALL SEVERITY</div>
                      <div className={`text-sm font-bold uppercase ${isSevere ? 'text-red-700' : 'text-gray-900'}`}>
                        {result?.severity || 'None'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Algorithmic Formulation Details */}
                <div className="bg-gray-50 border border-gray-200 p-6 flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex-1">
                    <h4 className="text-xs uppercase text-gray-500 font-bold tracking-widest mb-3">Stenosis Percentage Formula</h4>
                    <p className="text-sm text-gray-700 mb-2 font-medium">Derived from Bounding Box Short vs Long Axis:</p>
                    <code className="block bg-white p-3 border border-gray-200 text-xs text-gray-800 rounded-sm shadow-sm overflow-x-auto whitespace-nowrap">
                      Ratio = 1.0 - (MinAxis / MaxAxis)<br />
                      Percent = 20.0 + (Ratio * 75.0)
                    </code>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs uppercase text-gray-500 font-bold tracking-widest mb-3">Severity Classification Rules</h4>
                    <ul className="text-xs text-gray-700 space-y-1.5 font-medium border-l-[3px] border-red-600 pl-3">
                      <li><span className="font-bold w-12 inline-block">{"< 25%"}</span> : Minimal</li>
                      <li><span className="font-bold w-12 inline-block">{"< 50%"}</span> : Mild</li>
                      <li><span className="font-bold w-12 inline-block">{"< 70%"}</span> : Moderate</li>
                      <li><span className="font-bold w-12 inline-block">{"< 90%"}</span> : Severe</li>
                      <li><span className="font-bold w-12 inline-block">{"> 90%"}</span> : Occlusion</li>
                    </ul>
                  </div>
                </div>

                {/* Spatial Map */}
                <div className="flex flex-col pt-4 w-full">
                  <h3 className="text-xs uppercase text-gray-400 font-bold tracking-widest mb-4">Spatial Attention Mapping</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Vessel Segmentation */}
                    <div className="h-64 border border-gray-200 bg-gray-100 flex flex-col items-center overflow-hidden">
                      {result.mask_b64 ? (
                        <>
                          <div className="w-full bg-gray-200 py-1.5 text-center text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-300 flex-shrink-0 z-10">Vessel Segmentation</div>
                          <div className="flex-1 w-full relative p-2 bg-black overflow-hidden">
                            <img src={previewUrl} className="absolute inset-0 w-full h-full object-contain p-2" alt="Source Image" />
                            <img src={`data:image/png;base64,${result.mask_b64}`} className="absolute inset-0 w-full h-full object-contain p-2 opacity-50 mix-blend-screen" alt="Segmentation Result" />
                            {imgDim.w > 0 && result.detections && (
                              <svg viewBox={`0 0 ${imgDim.w} ${imgDim.h}`} preserveAspectRatio="xMidYMid meet" className="absolute inset-0 w-full h-full p-2 pointer-events-none z-20">
                                {result.detections.map((det, i) => {
                                  const [x1, y1, x2, y2] = det.bbox;
                                  const bw = Math.max(x2 - x1, 1);
                                  const bh = Math.max(y2 - y1, 1);
                                  const strokeW = Math.max(imgDim.w * 0.004, 2);
                                  const fontS = Math.max(imgDim.w * 0.025, 12);
                                  const labelText = `${det.severity.toUpperCase()} (${det.stenosis_percent}%)`;
                                  const labelW = fontS * labelText.length * 0.65;
                                  const labelY = y1 - fontS - (strokeW*2) < 0 ? y1 : y1 - fontS - (strokeW*2);
                                  const textY = y1 - fontS - (strokeW*2) < 0 ? y1 + fontS + strokeW : y1 - strokeW*1.5;
                                  
                                  return (
                                    <g key={i}>
                                      <rect x={x1} y={y1} width={bw} height={bh} fill="none" stroke="#ef4444" strokeWidth={strokeW} />
                                      <rect x={x1} y={labelY} width={labelW} height={fontS + (strokeW*2)} fill="#ef4444" />
                                      <text x={x1 + strokeW} y={textY} fill="white" fontSize={fontS} fontWeight="bold" style={{fontFamily: 'sans-serif'}}>
                                        {labelText}
                                      </text>
                                    </g>
                                  );
                                })}
                              </svg>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-6 text-sm font-medium text-gray-400 text-center">
                          <span>Segmentation overlays unrecoverable.</span>
                          <span className="text-[10px] text-red-500 mt-2 font-bold uppercase tracking-wide">⚠️ Backend Reboot Required</span>
                        </div>
                      )}
                    </div>
                    {/* Object Detection Labeling */}
                    <div className="h-64 border border-gray-200 bg-gray-100 flex flex-col items-center overflow-hidden">
                      {result.heatmap_b64 ? (
                        <>
                          <div className="w-full bg-gray-200 py-1.5 text-center text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-300 flex-shrink-0">Attention Heatmap</div>
                          <div className="flex-1 w-full relative p-2">
                            <img src={`data:image/png;base64,${result.heatmap_b64}`} className="absolute inset-0 w-full h-full object-contain p-2" alt="Heatmap Mapping Result" />
                          </div>
                        </>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-6 text-sm font-medium text-gray-400 text-center">
                          <span>Detection overlays unrecoverable.</span>
                          <span className="text-[10px] text-red-500 mt-2 font-bold uppercase tracking-wide">⚠️ Backend Reboot Required</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
