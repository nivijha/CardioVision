import { motion } from 'framer-motion';
import { Heart, Users, Award, Target, Zap, Globe, Mail, MapPin, Calendar, Database, Brain } from 'lucide-react';

const teamMembers = [
  {
    name: 'Project Lead',
    role: 'AI/ML Research',
    description: 'Deep learning and computer vision expertise',
  },
  {
    name: 'Medical Advisor',
    role: 'Cardiology Specialist',
    description: 'Clinical validation and annotation guidance',
  },
  {
    name: 'Data Scientist',
    role: 'Data Analysis',
    description: 'Dataset curation and statistical analysis',
  },
];

const milestones = [
  {
    icon: Calendar,
    date: 'January 2024',
    title: 'Project Inception',
    description: 'Initial research and problem definition for AI-assisted stenosis detection',
  },
  {
    icon: Database,
    date: 'March 2024',
    title: 'Dataset Acquisition',
    description: 'ARCADE dataset integration and annotation review completed',
  },
  {
    icon: Brain,
    date: 'June 2024',
    title: 'Model Development',
    description: 'YOLOv8 models trained and optimized for coronary angiography',
  },
  {
    icon: Target,
    date: 'September 2024',
    title: 'Validation Phase',
    description: 'Cross-validation and clinical expert review of predictions',
  },
  {
    icon: Globe,
    date: 'December 2024',
    title: 'Public Release',
    description: 'Web application and research paper publication',
  },
];

const technologies = [
  { name: 'YOLOv8', category: 'Detection' },
  { name: 'PyTorch', category: 'Framework' },
  { name: 'FastAPI', category: 'Backend' },
  { name: 'React', category: 'Frontend' },
  { name: 'Grad-CAM', category: 'XAI' },
  { name: 'OpenCV', category: 'Processing' },
];

export default function About() {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-2 card px-4 py-2 rounded-full mb-4">
            <Heart className="w-4 h-4 text-apple-accent" />
            <span className="text-sm text-apple-secondary">About This Project</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold mb-4 tracking-tight" style={{ color: '#1D1D1F' }}>
            Advancing <span style={{ color: '#0071E3' }}>Cardiovascular Care</span> Through AI
          </h1>
          <p className="text-apple-secondary text-lg max-w-3xl mx-auto">
            This project represents a collaborative effort between AI researchers and medical
            professionals to develop accessible, accurate, and explainable tools for coronary
            artery stenosis detection.
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card rounded-2xl p-8 mb-8"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: '#1D1D1F' }}>Our Mission</h2>
              <p className="text-apple-secondary leading-relaxed mb-4" style={{ lineHeight: 1.7 }}>
                Cardiovascular diseases affect millions worldwide, with coronary artery stenosis
                being a leading cause of morbidity and mortality. Our mission is to leverage
                cutting-edge artificial intelligence to assist healthcare professionals in
                early and accurate detection of stenosis.
              </p>
              <p className="text-apple-secondary leading-relaxed" style={{ lineHeight: 1.7 }}>
                By providing an accessible, real-time analysis tool with explainable outputs,
                we aim to reduce diagnostic variability, improve patient outcomes, and
                democratize access to expert-level cardiovascular analysis.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="card rounded-xl p-4 text-center spring-hover">
                <Target className="w-8 h-8 text-apple-accent mx-auto mb-2" />
                <p className="text-2xl font-semibold text-apple-text">86.7%</p>
                <p className="text-sm text-apple-secondary">Detection Accuracy</p>
              </div>
              <div className="card rounded-xl p-4 text-center spring-hover">
                <Zap className="w-8 h-8 text-apple-warning mx-auto mb-2" />
                <p className="text-2xl font-semibold text-apple-text">45ms</p>
                <p className="text-sm text-apple-secondary">Avg. Inference Time</p>
              </div>
              <div className="card rounded-xl p-4 text-center spring-hover">
                <Users className="w-8 h-8 text-apple-success mx-auto mb-2" />
                <p className="text-2xl font-semibold text-apple-text">2,847</p>
                <p className="text-sm text-apple-secondary">Images Analyzed</p>
              </div>
              <div className="card rounded-xl p-4 text-center spring-hover">
                <Award className="w-8 h-8 text-apple-secondary mx-auto mb-2" />
                <p className="text-2xl font-semibold text-apple-text">6</p>
                <p className="text-sm text-apple-secondary">Models Evaluated</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Technologies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold mb-4 text-center" style={{ color: '#1D1D1F' }}>Technologies Used</h2>
          <div className="card rounded-2xl p-6">
            <div className="flex flex-wrap justify-center gap-3">
              {technologies.map((tech) => (
                <div
                  key={tech.name}
                  className="card rounded-xl px-4 py-3 text-center spring-hover border border-apple-border"
                >
                  <p className="font-semibold text-apple-text">{tech.name}</p>
                  <p className="text-xs text-apple-accent">{tech.category}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold mb-6 text-center" style={{ color: '#1D1D1F' }}>Project Timeline</h2>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-apple-border" />

            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-apple-accent transform -translate-x-1/2 z-10" />

                  {/* Content */}
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${
                    index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'
                  }`}>
                    <div className="card rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <milestone.icon className="w-5 h-5 text-apple-accent" />
                        <span className="text-sm text-apple-accent font-medium">{milestone.date}</span>
                      </div>
                      <h3 className="text-lg font-semibold mb-1" style={{ color: '#1D1D1F' }}>{milestone.title}</h3>
                      <p className="text-sm text-apple-secondary">{milestone.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold mb-6 text-center" style={{ color: '#1D1D1F' }}>Team</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="card rounded-xl p-6 text-center spring-hover"
              >
                <div className="w-16 h-16 rounded-full bg-apple-gray mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-8 h-8 text-apple-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-1" style={{ color: '#1D1D1F' }}>{member.name}</h3>
                <p className="text-apple-accent text-sm mb-2">{member.role}</p>
                <p className="text-apple-secondary text-sm">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact & Acknowledgments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="card rounded-2xl p-8"
        >
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: '#1D1D1F' }}>Acknowledgments</h3>
              <p className="text-apple-secondary leading-relaxed mb-4" style={{ lineHeight: 1.7 }}>
                We gratefully acknowledge the ARCADE dataset contributors for making their
                annotated coronary angiography images publicly available. This research
                would not have been possible without their dedication to advancing
                cardiovascular AI research.
              </p>
              <p className="text-apple-secondary leading-relaxed" style={{ lineHeight: 1.7 }}>
                Special thanks to our medical advisors for their invaluable clinical
                insights and validation of our model outputs.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: '#1D1D1F' }}>Contact</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-apple-secondary">
                  <Mail className="w-5 h-5 text-apple-accent" />
                  <span>contact@stenosisai.com</span>
                </div>
                <div className="flex items-center space-x-3 text-apple-secondary">
                  <MapPin className="w-5 h-5 text-apple-accent" />
                  <span>Medical AI Research Lab</span>
                </div>
              </div>
              <div className="mt-6 p-4 rounded-xl bg-apple-gray border border-apple-border">
                <p className="text-sm text-apple-secondary">
                  <strong className="text-apple-accent">Note:</strong> This project is for
                  research and educational purposes. It is not intended for clinical use
                  without proper regulatory approval and validation.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
