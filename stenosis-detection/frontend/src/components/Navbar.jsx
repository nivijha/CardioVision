import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Menu, X, ChevronRight } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/predict', label: 'Predict' },
  { path: '/models', label: 'Models' },
  { path: '/results', label: 'Results' },
  { path: '/research', label: 'Research' },
  { path: '/about', label: 'About' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-apple-surface border-b border-apple-border ${
          isScrolled ? 'py-3' : 'py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-apple-gray flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Activity className="w-6 h-6 text-apple-accent" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-apple-text">
                  StenosisAI
                </h1>
                <p className="text-xs text-apple-secondary">Coronary Artery Analysis</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="relative px-4 py-2 text-sm font-medium transition-all duration-300 group"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute bottom-0 left-4 right-4 h-0.5 bg-apple-accent"
                        transition={{ type: "spring", duration: 0.5 }}
                      />
                    )}
                    <span className={`relative z-10 ${
                      isActive
                        ? 'text-apple-accent'
                        : 'text-apple-secondary hover:text-apple-text'
                    }`}>
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-apple-gray text-apple-text transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
            <div className="bg-apple-surface mt-20 mx-4 rounded-2xl p-4 shadow-elevated border border-apple-border">
              <div className="space-y-2">
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
                        className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                          isActive
                            ? 'bg-apple-gray text-apple-accent'
                            : 'text-apple-secondary hover:bg-apple-gray hover:text-apple-text'
                        }`}
                      >
                        <span className="flex items-center space-x-3 font-medium">
                          <span>{item.label}</span>
                        </span>
                        {isActive && <ChevronRight className="w-5 h-5" />}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
