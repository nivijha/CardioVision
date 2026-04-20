import { Heart, Github, Linkedin, Mail } from 'lucide-react';

const socialLinks = [
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:contact@stenosisai.com', label: 'Email' },
];

export default function Footer() {
  return (
    <footer className="bg-warm-surface border-t border-warm-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-warm-primary to-warm-coral flex items-center justify-center">
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
              <h3 className="text-lg font-semibold text-warm-text">
                StenosisAI
              </h3>
            </div>
            <p className="text-sm text-warm-secondary mb-4 leading-relaxed">
              AI-powered coronary artery stenosis detection using advanced YOLOv8 models for better cardiovascular care.
            </p>
            {/*<div className="flex items-center space-x-2 text-xs text-warm-tertiary">
              <span>Made with</span>
              <Heart className="w-3 h-3 text-warm-coral fill-warm-coral" />
              <span>for heart health</span>
            </div>*/}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-warm-text mb-4">
              Navigate
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="/predict" className="text-warm-secondary hover:text-warm-primary transition-colors">
                  Try Prediction
                </a>
              </li>
              <li>
                <a href="/models" className="text-warm-secondary hover:text-warm-primary transition-colors">
                  Model Comparison
                </a>
              </li>
              <li>
                <a href="/research" className="text-warm-secondary hover:text-warm-primary transition-colors">
                  Research
                </a>
              </li>
              <li>
                <a href="/about" className="text-warm-secondary hover:text-warm-primary transition-colors">
                  About
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-warm-text mb-4">Resources</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#" className="text-warm-secondary hover:text-warm-primary transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-warm-secondary hover:text-warm-primary transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="text-warm-secondary hover:text-warm-primary transition-colors">
                  ARCADE Dataset
                </a>
              </li>
              <li>
                <a href="#" className="text-warm-secondary hover:text-warm-primary transition-colors">
                  YOLOv8 Models
                </a>
              </li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            <h4 className="text-sm font-semibold text-warm-text mb-4">Connect</h4>
            <div className="flex space-x-2 mb-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="w-10 h-10 rounded-xl bg-warm-sand flex items-center justify-center text-warm-secondary hover:text-warm-primary hover:bg-warm-primary/10 transition-all duration-300"
                  aria-label={link.label}
                >
                  <link.icon size={18} />
                </a>
              ))}
            </div>
            <p className="text-xs text-warm-tertiary leading-relaxed">
              ARCADE Dataset &bull; YOLOv8 Models &bull; Medical AI Research
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-warm-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-xs text-warm-tertiary">
              &copy; 2024 StenosisAI. For research and educational purposes only.
            </p>
            <div className="flex items-center space-x-4 text-xs text-warm-tertiary">
              {/*<span className="px-2 py-1 rounded-md bg-warm-sand">v1.0.0</span>
              <span className="text-warm-border">&bull;</span>*/} 
              <span>Built with React + FastAPI</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
