import { Heart, Github, Linkedin, Mail } from 'lucide-react';

const socialLinks = [
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:contact@stenosisai.com', label: 'Email' },
];

export default function Footer() {
  return (
    <footer className="glass-card mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold gradient-text mb-2">
              StenosisAI
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              AI-powered coronary artery stenosis detection using advanced YOLOv8 models.
            </p>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span>Made with</span>
              <Heart className="w-3 h-3 text-red-500 fill-red-500" />
              <span>for cardiovascular health</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/predict" className="text-gray-400 hover:text-medical-400 transition-colors">
                  Try Prediction
                </a>
              </li>
              <li>
                <a href="/models" className="text-gray-400 hover:text-medical-400 transition-colors">
                  Model Comparison
                </a>
              </li>
              <li>
                <a href="/research" className="text-gray-400 hover:text-medical-400 transition-colors">
                  Research Paper
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-400 hover:text-medical-400 transition-colors">
                  About Project
                </a>
              </li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Connect</h4>
            <div className="flex space-x-3 mb-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="w-10 h-10 rounded-lg glass-card flex items-center justify-center text-gray-400 hover:text-medical-400 hover:border-medical-400/30 transition-all duration-300"
                  aria-label={link.label}
                >
                  <link.icon size={18} />
                </a>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              ARCADE Dataset • YOLOv8 Models • Medical AI Research
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-xs text-gray-500">
              © 2024 StenosisAI. For research and educational purposes.
            </p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>v1.0.0</span>
              <span>•</span>
              <span>Built with React + FastAPI</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
