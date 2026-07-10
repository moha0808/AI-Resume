import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiZap, FiCopy, FiCheck, FiRefreshCw, FiDownload, FiUser, FiCode, FiBriefcase, FiFolder } from 'react-icons/fi';
import { resumeAPI } from '../../services/api';
import toast from 'react-hot-toast';

const MOCK_IMPROVEMENTS = {
  summary: "Results-driven Full-Stack Developer with 3+ years of experience architecting and delivering scalable web applications used by 10,000+ daily active users. Expert in React, Node.js, and MongoDB with a proven track record of reducing page load times by 40% and leading cross-functional teams to deliver features ahead of schedule. Passionate about clean code, modern UI, and impactful user experiences.",
  skills: "**Technical Skills:**\nLanguages: JavaScript (ES6+), TypeScript, Python, SQL\nFrontend: React.js, Next.js, Redux, Tailwind CSS, Framer Motion\nBackend: Node.js, Express.js, FastAPI, REST APIs, GraphQL\nDatabases: MongoDB, PostgreSQL, Redis\nCloud & DevOps: AWS (EC2, S3, Lambda), Docker, CI/CD, Git\nTools: Figma, Postman, Jest, Webpack, Vite",
  experience: [
    "Led development of a real-time dashboard serving 15,000+ users, resulting in 35% improvement in data processing speed and 98% uptime",
    "Architected and deployed microservices using Node.js and Docker, reducing server costs by 25% and improving deployment frequency by 3×",
    "Mentored 3 junior developers, conducted code reviews, and established Git workflows that cut merge conflicts by 60%",
    "Implemented lazy loading and code splitting strategies that decreased initial bundle size by 42%, improving Lighthouse score from 62 to 94",
  ],
  projects: [
    "Developed an AI-powered e-commerce recommendation engine using React and Python/FastAPI, processing 50,000+ daily requests with <200ms response time and driving 28% increase in conversion",
    "Built a real-time collaborative whiteboard app supporting 500+ concurrent users using Socket.io, deployed on AWS with auto-scaling and 99.9% SLA",
    "Created an open-source React component library with 120+ reusable components, garnering 2,000+ GitHub stars and used in 50+ production projects",
  ],
};

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all">
      {copied ? <FiCheck size={14} className="text-green-400" /> : <FiCopy size={14} />}
    </button>
  );
};

const Section = ({ icon: Icon, title, content, color, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="glass-card p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
          <Icon size={16} style={{ color }} />
        </div>
        <h2 className="text-white font-semibold">{title}</h2>
      </div>
      <CopyButton text={Array.isArray(content) ? content.join('\n') : content} />
    </div>
    {Array.isArray(content) ? (
      <ul className="space-y-3">
        {content.map((item, i) => (
          <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
            <span className="text-primary font-bold text-sm mt-0.5 flex-shrink-0">{i + 1}.</span>
            <p className="text-slate-300 text-sm leading-relaxed">{item}</p>
          </li>
        ))}
      </ul>
    ) : (
      <div className="p-4 rounded-xl bg-white/3 border border-white/5">
        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>
    )}
  </motion.div>
);

const ImprovePage = () => {
  const [improvements, setImprovements] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resumes, setResumes] = useState([]);

  const generateImprovements = async () => {
    setLoading(true);
    try {
      // Try to get latest resume ID
      const resumesRes = await resumeAPI.getAll().catch(() => ({ data: { resumes: [] } }));
      const latest = resumesRes.data.resumes?.[0];
      if (latest) {
        const res = await resumeAPI.improve(latest._id);
        setImprovements(res.data.improvements);
      } else {
        // Use mock data
        await new Promise(r => setTimeout(r, 2000));
        setImprovements(MOCK_IMPROVEMENTS);
      }
      toast.success('AI improvements generated!');
    } catch {
      await new Promise(r => setTimeout(r, 1500));
      setImprovements(MOCK_IMPROVEMENTS);
      toast.success('AI improvements generated (demo mode)!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white mb-1">AI Resume Improvement</h1>
          <p className="text-slate-400 text-sm">Let AI rewrite your resume sections for maximum ATS score and recruiter impact.</p>
        </div>
        <button
          onClick={generateImprovements}
          disabled={loading}
          className="btn-primary flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiZap size={16} />}
          {loading ? 'Generating...' : improvements ? 'Regenerate with AI' : 'Generate AI Improvements'}
        </button>
      </motion.div>

      {!improvements && !loading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-12 text-center">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6" style={{ boxShadow: '0 0 40px rgba(79,70,229,0.2)' }}>
            <FiZap size={32} className="text-primary" />
          </div>
          <h2 className="text-white font-bold text-xl mb-3">AI Resume Improver</h2>
          <p className="text-slate-400 max-w-md mx-auto mb-6">
            Click "Generate AI Improvements" to get AI-rewritten summary, skills section, experience statements, and project descriptions optimized for ATS and recruiter impact.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-xl mx-auto">
            {[['Professional Summary', '#4F46E5'], ['Skills Section', '#7C3AED'], ['Experience', '#06B6D4'], ['Projects', '#10B981']].map(([l, c], i) => (
              <div key={i} className="p-3 rounded-xl text-center text-xs font-medium" style={{ background: `${c}15`, border: `1px solid ${c}25`, color: c }}>
                {l}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {loading && (
        <div className="glass-card p-12 text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-primary font-bold text-xs">AI</div>
          </div>
          <p className="text-white font-semibold mb-2">Generating AI Improvements...</p>
          <p className="text-slate-400 text-sm">Analyzing your resume, finding improvements, and rewriting content for maximum impact.</p>
          <div className="flex justify-center gap-1 mt-4">
            {[0, 1, 2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />)}
          </div>
        </div>
      )}

      {improvements && !loading && (
        <div className="space-y-5">
          <Section icon={FiUser} title="Professional Summary" content={improvements.summary} color="#4F46E5" delay={0} />
          <Section icon={FiCode} title="Skills Section" content={improvements.skills} color="#7C3AED" delay={0.1} />
          <Section icon={FiBriefcase} title="Experience Statements" content={improvements.experience} color="#06B6D4" delay={0.2} />
          <Section icon={FiFolder} title="Project Descriptions" content={improvements.projects} color="#10B981" delay={0.3} />

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex gap-3 justify-center">
            <button onClick={generateImprovements} className="btn-secondary flex items-center gap-2">
              <FiRefreshCw size={14} /> Regenerate
            </button>
            <button onClick={() => toast.success('PDF export coming soon!')} className="btn-primary flex items-center gap-2">
              <FiDownload size={14} /> Download Improved Resume
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ImprovePage;
