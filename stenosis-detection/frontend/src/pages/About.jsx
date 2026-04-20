import { motion } from 'framer-motion';
import { Heart, Users, Award, Target, Zap, Globe, Mail, MapPin, Calendar, Database, Brain, Sparkles } from 'lucide-react';

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
  { name: 'PyTorch Explainability', category: 'XAI' },
  { name: 'OpenCV', category: 'Processing' },
];

export default function About() {
  return (
    <div className="min-h-screen py-12 bg-warm-bgAlt">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          {/*<div className="inline-flex items-center space-x-2 card px-4 py-2 rounded-full mb-6">
            <Heart className="w-4 h-4 text-warm-primary" />
            <span className="text-sm text-warm-secondary font-medium">About This Project</span>
          </div>*/}
          <h1 className="text-4xl md:text-5xl font-semibold mb-4 tracking-tight text-warm-text font-display">
            Advancing <span className="gradient-text">Cardiovascular Care</span> Through AI
          </h1>
          <p className="text-warm-secondary text-lg max-w-3xl mx-auto leading-relaxed">
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
          className="card rounded-3xl p-8 md:p-10 mb-10"
        >
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              {/*<div className="inline-flex items-center space-x-2 badge-soft-primary mb-4">
                <Sparkles className="w-4 h-4" />
                <span>Our Mission</span>
              </div>*/}
              <h2 className="text-2xl font-semibold mb-4 text-warm-text font-display">
                Better Healthcare Through Technology
              </h2>
              <p className="text-warm-secondary leading-relaxed mb-4" style={{ lineHeight: 1.8 }}>
                Cardiovascular diseases affect millions worldwide, with coronary artery stenosis
                being a leading cause of morbidity and mortality. Our mission is to leverage
                cutting-edge artificial intelligence to assist healthcare professionals in
                early and accurate detection of stenosis.
              </p>
              <p className="text-warm-secondary leading-relaxed" style={{ lineHeight: 1.8 }}>
                By providing an accessible, real-time analysis tool with explainable outputs,
                we aim to reduce diagnostic variability, improve patient outcomes, and
                democratize access to expert-level cardiovascular analysis.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Target, value: '86.7%', label: 'Detection Accuracy', color: 'from-warm-primary to-warm-coral' },
                { icon: Zap, value: '<50ms', label: 'Avg. Inference Time', color: 'from-warm-warning to-warm-primary' },
                { icon: Users, value: '2,847', label: 'Images Analyzed', color: 'from-warm-teal to-warm-success' },
                { icon: Award, value: '6', label: 'Models Evaluated', color: 'from-warm-coral to-warm-danger' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="card rounded-2xl p-5 text-center spring-hover"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-3`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-2xl font-semibold text-warm-text mb-1">{stat.value}</p>
                  <p className="text-xs text-warm-secondary font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Technologies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-10"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold mb-2 text-warm-text font-display">Technologies Used</h2>
            <p className="text-warm-secondary">Built with modern, reliable tools for medical AI</p>
          </div>
          <div className="card rounded-2xl p-6">
            <div className="flex flex-wrap justify-center gap-3">
              {technologies.map((tech) => (
                <div
                  key={tech.name}
                  className="card rounded-xl px-5 py-3.5 text-center spring-hover border-warm-border bg-warm-sand/50"
                >
                  <p className="font-semibold text-warm-text text-sm">{tech.name}</p>
                  <p className="text-xs text-warm-primary font-medium mt-0.5">{tech.category}</p>
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
          className="mb-10"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-2 text-warm-text font-display">Project Timeline</h2>
            <p className="text-warm-secondary">From concept to clinical impact</p>
          </div>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-warm-border" />

            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-warm-primary to-warm-coral transform -translate-x-1/2 z-10 shadow-soft" />

                  {/* Content */}
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${
                    index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'
                  }`}>
                    <div className="card rounded-xl p-5 spring-hover">
                      <div className="flex items-center space-x-2 mb-2">
                        <milestone.icon className="w-4 h-4 text-warm-primary" />
                        <span className="text-sm text-warm-primary font-semibold">{milestone.date}</span>
                      </div>
                      <h3 className="text-base font-semibold mb-1.5 text-warm-text">{milestone.title}</h3>
                      <p className="text-sm text-warm-secondary leading-relaxed">{milestone.description}</p>
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
          className="mb-10"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold mb-2 text-warm-text font-display">Our Team</h2>
            <p className="text-warm-secondary">Bringing together AI and medical expertise</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="card rounded-2xl p-6 text-center spring-hover"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-warm-primary to-warm-coral mx-auto mb-4 flex items-center justify-center shadow-soft">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-1 text-warm-text">{member.name}</h3>
                <p className="text-warm-primary text-sm font-medium mb-2">{member.role}</p>
                <p className="text-warm-secondary text-sm">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact & Acknowledgments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="card rounded-3xl p-8"
        >
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-warm-text font-display">Acknowledgments</h3>
              <p className="text-warm-secondary leading-relaxed mb-4" style={{ lineHeight: 1.8 }}>
                We gratefully acknowledge the ARCADE dataset contributors for making their
                annotated coronary angiography images publicly available. This research
                would not have been possible without their dedication to advancing
                cardiovascular AI research.
              </p>
              <p className="text-warm-secondary leading-relaxed" style={{ lineHeight: 1.8 }}>
                Special thanks to our medical advisors for their invaluable clinical
                insights and validation of our model outputs.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-warm-text font-display">Contact</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-warm-secondary">
                  <div className="w-9 h-9 rounded-lg bg-warm-sand flex items-center justify-center">
                    <Mail className="w-4 h-4 text-warm-primary" />
                  </div>
                  <span>contact@stenosisai.com</span>
                </div>
                <div className="flex items-center space-x-3 text-warm-secondary">
                  <div className="w-9 h-9 rounded-lg bg-warm-sand flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-warm-primary" />
                  </div>
                  <span>Medical AI Research Lab</span>
                </div>
              </div>
              <div className="mt-6 p-4 rounded-xl bg-warm-sand/50 border border-warm-border">
                <p className="text-sm text-warm-secondary">
                  <strong className="text-warm-primary">Note:</strong> This project is for
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
