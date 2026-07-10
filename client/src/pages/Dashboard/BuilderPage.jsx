import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiLayout, FiDownload, FiEye, FiCheck } from 'react-icons/fi';
import { useAuthStore } from '../../store';

const TEMPLATES = [
  { id: 'modern', name: 'Modern', desc: 'Clean two-column layout with accent colors', colors: ['#4F46E5', '#7C3AED'], popular: true },
  { id: 'ats', name: 'ATS Friendly', desc: 'Single column, keyword-optimized for ATS systems', colors: ['#06B6D4', '#0891B2'], popular: false },
  { id: 'corporate', name: 'Corporate', desc: 'Professional, conservative layout for enterprises', colors: ['#1E293B', '#475569'], popular: false },
  { id: 'minimal', name: 'Minimal', desc: 'Clean typography with maximum whitespace', colors: ['#10B981', '#059669'], popular: false },
];

const ResumePreview = ({ template, user }) => (
  <div className="bg-white rounded-xl p-6 text-gray-800 text-xs leading-tight shadow-xl overflow-hidden" style={{ minHeight: '500px' }}>
    {/* Header */}
    <div className="border-b-2 pb-3 mb-3" style={{ borderColor: template.colors[0] }}>
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-lg font-bold text-gray-900">{user?.name || 'Your Full Name'}</h1>
          <p className="text-gray-500 mt-0.5">{user?.degree || 'Software Engineer'}</p>
        </div>
        <div className="text-right text-gray-500">
          <p>{user?.email || 'email@example.com'}</p>
          <p>{user?.phone || '+1 234 567 8900'}</p>
          <p>{user?.location || 'San Francisco, CA'}</p>
        </div>
      </div>
    </div>

    {/* Summary */}
    <div className="mb-3">
      <h2 className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: template.colors[0] }}>Summary</h2>
      <p className="text-gray-600">{user?.bio || 'Results-driven developer with expertise in modern web technologies...'}</p>
    </div>

    {/* Skills */}
    <div className="mb-3">
      <h2 className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: template.colors[0] }}>Skills</h2>
      <div className="flex flex-wrap gap-1">
        {(user?.skills?.length ? user.skills : ['JavaScript', 'React', 'Node.js', 'MongoDB', 'TypeScript']).map((s, i) => (
          <span key={i} className="px-2 py-0.5 rounded text-xs text-white" style={{ background: template.colors[0] }}>{s}</span>
        ))}
      </div>
    </div>

    {/* Experience */}
    <div className="mb-3">
      <h2 className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: template.colors[0] }}>Experience</h2>
      <div>
        <div className="flex justify-between">
          <span className="font-semibold">Senior Software Engineer</span>
          <span className="text-gray-500">2022 - Present</span>
        </div>
        <p className="text-gray-500">TechCorp Inc. · San Francisco, CA</p>
        <ul className="mt-1 ml-3 text-gray-600 space-y-0.5">
          <li>• Led development of real-time dashboard serving 15,000+ users</li>
          <li>• Reduced bundle size by 42%, improving Lighthouse score to 94</li>
        </ul>
      </div>
    </div>

    {/* Education */}
    <div>
      <h2 className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: template.colors[0] }}>Education</h2>
      <div className="flex justify-between">
        <span className="font-semibold">{user?.degree || 'B.Tech Computer Science'}</span>
        <span className="text-gray-500">2020</span>
      </div>
      <p className="text-gray-500">{user?.college || 'Stanford University'}</p>
    </div>
  </div>
);

const BuilderPage = () => {
  const { user } = useAuthStore();
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [exporting, setExporting] = useState(false);

  const template = TEMPLATES.find(t => t.id === selectedTemplate);

  const handleExport = async () => {
    setExporting(true);
    await new Promise(r => setTimeout(r, 1500));
    setExporting(false);
    toast?.success?.('PDF export coming soon!');
    alert('PDF export will be available in the full version. Your resume data is ready!');
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-heading font-bold text-white mb-1">Resume Builder</h1>
        <p className="text-slate-400 text-sm">Choose a template and build your ATS-optimized resume.</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Templates + Options */}
        <div className="space-y-5">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <FiLayout size={16} className="text-primary" /> Choose Template
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  className={`relative p-4 rounded-xl border-2 text-left transition-all ${selectedTemplate === t.id ? 'border-primary bg-primary/10' : 'border-white/10 hover:border-white/20 bg-white/3'}`}
                >
                  {t.popular && <span className="absolute top-2 right-2 text-xs px-1.5 py-0.5 rounded bg-primary text-white font-bold">Popular</span>}
                  <div className="flex gap-1 mb-2">
                    {t.colors.map((c, i) => <div key={i} className="w-4 h-4 rounded-full" style={{ background: c }} />)}
                  </div>
                  <p className="text-white text-sm font-medium">{t.name}</p>
                  <p className="text-slate-500 text-xs mt-1 leading-tight">{t.desc}</p>
                  {selectedTemplate === t.id && (
                    <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <FiCheck size={10} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 space-y-3">
            <h2 className="text-white font-semibold mb-2">Export Options</h2>
            <button onClick={handleExport} disabled={exporting} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
              {exporting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiDownload size={16} />}
              {exporting ? 'Preparing PDF...' : 'Export as PDF'}
            </button>
            <button onClick={() => alert('DOCX export coming soon!')} className="btn-secondary w-full flex items-center justify-center gap-2">
              <FiDownload size={16} /> Export as DOCX
            </button>
          </motion.div>
        </div>

        {/* Right: Preview */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-4">
          <div className="flex items-center gap-2 mb-4">
            <FiEye size={16} className="text-accent" />
            <h2 className="text-white font-semibold text-sm">Live Preview — {template?.name}</h2>
          </div>
          <div className="overflow-auto" style={{ maxHeight: '600px' }}>
            <ResumePreview template={template} user={user} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BuilderPage;
