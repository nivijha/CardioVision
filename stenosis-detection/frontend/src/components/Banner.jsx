import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Github, X, ExternalLink } from 'lucide-react';

export default function Banner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('cardiovision_banner_dismissed');
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('cardiovision_banner_dismissed', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="bg-amber-50 border-b border-amber-100 text-amber-900 px-4 py-3 relative z-50 overflow-hidden"
        >
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 pr-8">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <p className="text-xs md:text-sm font-medium leading-relaxed text-center md:text-left">
                <span className="font-bold">Backend Performance Notice:</span> The server runs on free backend services. Because the deep learning services are heavy, this may lead to delayed, longer, or failed responses. For a smooth and fast experience, please run CardioVision locally.
              </p>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <a
                href="https://github.com/nivijha/CardioVision"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-amber-950 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded hover:bg-amber-900 transition-colors shadow-sm"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub Repository</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-700 hover:text-amber-950 p-1 hover:bg-amber-100 rounded transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
