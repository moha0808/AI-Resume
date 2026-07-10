import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUpload, FiBarChart2, FiBriefcase, FiTarget, FiTrendingUp, FiZap, FiMessageSquare, FiArrowRight, FiPlus } from 'react-icons/fi';
import { useAuthStore } from '../../store';
import { userAPI, resumeAPI } from '../../services/api';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

const StatCard = ({ icon: Icon, label, value, color, suffix = '', delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.5 }}
    whileHover={{ y: -4 }} className="glass-card p-6 flex items-center gap-4">
    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}20`, border: `1px solid ${color}30` }}>
      <Icon size={22} style={{ color }} />
    </div>
    <div>
      <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">{label}</p>
      <p className="text-white text-2xl font-bold font-heading">{value}{suffix}</p>
    </div>
  </motion.div>
);

const QuickActionCard = ({ icon: Icon, title, desc, to, color, gradient }) => (
  <Link to={to}>
    <motion.div whileHover={{ y: -4, scale: 1.02 }} className="glass-card p-5 cursor-pointer group h-full" style={{ transition: 'all 0.3s' }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
        <Icon size={18} style={{ color }} />
      </div>
      <h3 className="text-white font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
    </motion.div>
  </Link>
);

const ScoreRing = ({ score }) => {
  const data = [{ value: score, fill: '#4F46E5' }, { value: 100 - score, fill: 'rgba(255,255,255,0.05)' }];
  const color = score >= 80 ? '#10B981' : score >= 60 ? '#F59E0B' : '#EF4444';

  return (
    <div className="relative w-40 h-40">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="90%" startAngle={90} endAngle={-270} data={[{ value: score, fill: color }]}>
          <RadialBar dataKey="value" cornerRadius={4} background={{ fill: 'rgba(255,255,255,0.05)' }} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold font-heading" style={{ color }}>{score}</span>
        <span className="text-slate-400 text-xs">ATS Score</span>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ resumeCount: 0, savedJobCount: 0, atsScore: 0, skillsFound: 0, missingSkills: 0, profileCompletion: 0 });
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, resumesRes] = await Promise.all([
          userAPI.getDashboardStats().catch(() => ({ data: { stats: {} } })),
          resumeAPI.getAll().catch(() => ({ data: { resumes: [] } })),
        ]);
        setStats({ resumeCount: 0, savedJobCount: 0, atsScore: 72, skillsFound: 8, missingSkills: 4, profileCompletion: 65, ...statsRes.data.stats });
        setResumes(resumesRes.data.resumes || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const quickActions = [
    { icon: FiUpload, title: 'Upload Resume', desc: 'Add a new resume for analysis', to: '/dashboard/upload', color: '#4F46E5' },
    { icon: FiBarChart2, title: 'View Analysis', desc: 'See your ATS score breakdown', to: '/dashboard/analysis/latest', color: '#7C3AED' },
    { icon: FiTarget, title: 'Skill Gap', desc: 'Find missing skills for your target role', to: '/dashboard/skills', color: '#06B6D4' },
    { icon: FiBriefcase, title: 'Job Matches', desc: 'See personalized job recommendations', to: '/dashboard/jobs', color: '#10B981' },
    { icon: FiZap, title: 'AI Improve', desc: 'Generate better resume sections', to: '/dashboard/improve', color: '#F59E0B' },
    { icon: FiMessageSquare, title: 'Interview Prep', desc: 'Generate practice questions', to: '/dashboard/interview', color: '#EC4899' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white mb-1">
            Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0] || 'there'}!</span> 👋
          </h1>
          <p className="text-slate-400 text-sm">Here's your career progress overview.</p>
        </div>
        <Link to="/dashboard/upload" className="btn-primary flex items-center gap-2 text-sm">
          <FiPlus size={16} /> Upload Resume
        </Link>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard icon={FiBarChart2} label="Resumes" value={stats.resumeCount} color="#4F46E5" delay={0} />
        <StatCard icon={FiTrendingUp} label="ATS Score" value={stats.atsScore} suffix="/100" color="#7C3AED" delay={0.05} />
        <StatCard icon={FiTarget} label="Skills Found" value={stats.skillsFound} color="#06B6D4" delay={0.1} />
        <StatCard icon={FiZap} label="Missing Skills" value={stats.missingSkills} color="#F59E0B" delay={0.15} />
        <StatCard icon={FiBriefcase} label="Saved Jobs" value={stats.savedJobCount} color="#10B981" delay={0.2} />
        <StatCard icon={FiTarget} label="Profile" value={stats.profileCompletion} suffix="%" color="#EC4899" delay={0.25} />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* ATS Score Card */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="glass-card p-6 flex flex-col items-center justify-center">
          <h2 className="text-white font-semibold mb-4 text-center">Your ATS Score</h2>
          <ScoreRing score={stats.atsScore || 72} />
          <p className="text-slate-400 text-xs mt-4 text-center">
            {stats.atsScore >= 80 ? '🎉 Excellent! Your resume is ATS-ready.' : stats.atsScore >= 60 ? '⚡ Good! A few improvements can boost this.' : '🔧 Needs work. Let AI help you improve.'}
          </p>
          <Link to="/dashboard/upload" className="btn-primary text-sm w-full text-center mt-4">
            {stats.resumeCount > 0 ? 'Analyze Again' : 'Upload to Get Score'}
          </Link>
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="lg:col-span-2 glass-card p-6">
          <h2 className="text-white font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {quickActions.map((action, i) => (
              <QuickActionCard key={i} {...action} />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Resumes */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold">Recent Resumes</h2>
          <Link to="/dashboard/upload" className="text-primary text-sm hover:text-primary-300 flex items-center gap-1 transition-colors">
            Upload New <FiArrowRight size={14} />
          </Link>
        </div>
        {resumes.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <FiUpload size={24} className="text-primary" />
            </div>
            <h3 className="text-white font-medium mb-2">No resumes yet</h3>
            <p className="text-slate-400 text-sm mb-4">Upload your first resume to get AI-powered analysis and job matches.</p>
            <Link to="/dashboard/upload" className="btn-primary inline-flex items-center gap-2 text-sm">
              <FiUpload size={14} /> Upload Resume
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {resumes.slice(0, 5).map((resume) => (
              <div key={resume._id} className="flex items-center gap-4 p-3 rounded-xl bg-white/3 hover:bg-white/5 transition-all">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary text-xs font-bold uppercase">
                  {resume.fileType || 'PDF'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{resume.originalName || resume.fileName}</p>
                  <p className="text-slate-500 text-xs">{new Date(resume.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  {resume.analysis?.atsScore && (
                    <span className="badge-primary">{resume.analysis.atsScore}/100</span>
                  )}
                  <Link to={`/dashboard/analysis/${resume._id}`} className="text-primary hover:text-primary-300 text-xs transition-colors">View →</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DashboardPage;
