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
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-warm-primary to-warm-coral flex items-center justify-center shadow-soft"
              >
                <Heart className="w-5 h-5 text-white fill-white" />
              </motion.div>
              <div>
                <h1 className="text-lg font-semibold text-warm-text group-hover:text-warm-primary transition-colors">
                  StenosisAI
                </h1>
                <p className="text-xs text-warm-secondary">Cardiovascular Care</p>
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
                    className="relative px-4 py-2 text-sm font-medium transition-all duration-300 group rounded-full"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-warm-sand rounded-full opacity-60"
                        transition={{ type: "spring", duration: 0.5 }}
                      />
                    )}
                    <span className={`relative z-10 transition-colors ${
                      isActive
                        ? 'text-warm-primary font-semibold'
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
                className="btn-primary text-sm px-5 py-2.5 rounded-full"
              >
                Start Analysis
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-warm-sand text-warm-text transition-colors"
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
            <div className="bg-warm-surface/95 backdrop-blur-xl mt-16 mx-4 rounded-3xl p-4 shadow-elevated border border-warm-border">
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
                        className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all ${
                          isActive
                            ? 'bg-warm-sand text-warm-primary'
                            : 'text-warm-secondary hover:bg-warm-sand hover:text-warm-text'
                        }`}
                      >
                        <span className="flex items-center space-x-3 font-medium">
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
                    className="btn-primary text-center block py-3 rounded-xl text-sm font-medium"
                  >
                    Start Analysis
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
