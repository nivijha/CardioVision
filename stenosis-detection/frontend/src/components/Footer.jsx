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
              <div className="w-8 h-8 rounded-lg bg-warm-primary flex items-center justify-center">
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
              <h3 className="text-base font-semibold text-warm-text">
                CardioVision
              </h3>
            </div>
            <p className="text-sm text-warm-secondary mb-4 leading-relaxed">
              This project presents a deep learning-based approach for automated detection and segmentation of coronary artery stenosis from angiography images.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-warm-text mb-4">
              Project
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="/" className="text-warm-secondary hover:text-warm-primary transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/research" className="text-warm-secondary hover:text-warm-primary transition-colors">
                  Research Paper
                </a>
              </li>
              <li>
                <a href="/about" className="text-warm-secondary hover:text-warm-primary transition-colors">
                  Team & Acknowledgments
                </a>
              </li>
              <li>
                <a href="/predict" className="text-warm-secondary hover:text-warm-primary transition-colors">
                  Try Analysis Tool
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-warm-text mb-4">Datasets</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#" className="text-warm-secondary hover:text-warm-primary transition-colors">
                  ARCADE Dataset
                </a>
              </li>
              <li>
                <a href="#" className="text-warm-secondary hover:text-warm-primary transition-colors">
                  CADICA Dataset
                </a>
              </li>
              <li>
                <a href="#" className="text-warm-secondary hover:text-warm-primary transition-colors">
                  Model Weights
                </a>
              </li>
              <li>
                <a href="#" className="text-warm-secondary hover:text-warm-primary transition-colors">
                  Source Code
                </a>
              </li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            <h4 className="text-sm font-semibold text-warm-text mb-4">Contact</h4>
            <div className="flex space-x-2 mb-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="w-9 h-9 rounded-lg bg-warm-bgAlt flex items-center justify-center text-warm-secondary hover:text-white hover:bg-warm-primary transition-all duration-300 border border-warm-border"
                  aria-label={link.label}
                >
                  <link.icon size={16} />
                </a>
              ))}
            </div>
            <p className="text-xs text-warm-tertiary leading-relaxed">
              Mentor: Mr. Faisal Firdous<br/>
              Department of Computer Science
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-warm-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-xs text-warm-tertiary">
              © {new Date().getFullYear()} CardioVision | Academic Project | Coronary Artery Stenosis Detection and Segmentation
            </p>
            <div className="flex items-center space-x-4 text-xs text-warm-tertiary">
              <span>For research and educational purposes only</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
