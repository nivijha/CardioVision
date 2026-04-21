import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Menu, X, ChevronRight } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/predict', label: 'Predict' },
  { path: '/research', label: 'Research' },
  { path: '/about', label: 'About' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'py-3 glass shadow-sm'
            : 'py-5 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-9 h-9 rounded-lg bg-warm-primary flex items-center justify-center"
              >
                <Heart className="w-5 h-5 text-white fill-white" />
              </motion.div>
              <div>
                <h1 className="text-base font-semibold text-warm-text group-hover:text-warm-primary transition-colors">
                  CardioVision
                </h1>
                <p className="text-xs text-warm-secondary font-normal">Stenosis Detection</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="relative px-0 py-2 text-sm font-medium transition-colors"
                  >
                    <span className={`transition-colors ${
                      isActive
                        ? 'text-warm-primary border-b-2 border-warm-primary'
                        : 'text-warm-secondary hover:text-warm-text'
                    }`}>
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <Link
                to="/predict"
                className="btn-primary text-sm px-6 py-2 rounded-md"
              >
                Try Tool
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-warm-bgAlt text-warm-text transition-colors border border-warm-border"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 left-0 right-0 z-40 md:hidden"
          >
            <div className="bg-warm-surface/95 backdrop-blur-xl mt-16 mx-4 rounded-lg p-4 border border-warm-border">
              <div className="space-y-1">
                {navItems.map((item, index) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                          isActive
                            ? 'bg-warm-bgAlt text-warm-primary border border-warm-primary'
                            : 'text-warm-secondary hover:bg-warm-bgAlt hover:text-warm-text'
                        }`}
                      >
                        <span className="flex items-center space-x-3 font-medium text-sm">
                          <span>{item.label}</span>
                        </span>
                        {isActive && <ChevronRight className="w-4 h-4" />}
                      </Link>
                    </motion.div>
                  );
                })}
                <div className="pt-2 mt-2 border-t border-warm-border">
                  <Link
                    to="/predict"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="btn-primary text-center block py-2.5 rounded-md text-sm font-medium"
                  >
                    Try Tool
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
