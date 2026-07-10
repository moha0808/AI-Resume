import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBarChart2, FiZap, FiCheck, FiX, FiAlertCircle, FiArrowRight, FiRefreshCw, FiDownload } from 'react-icons/fi';
import { RadialBarChart, RadialBar, RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import { resumeAPI } from '../../services/api';
import toast from 'react-hot-toast';

const MOCK_ANALYSIS = {
  atsScore: 72,
  formatting: { score: 78, feedback: ['Good use of bullet points', 'Consider adding more white space', 'Consistent heading sizes'] },
  keywords: { score: 65, found: ['JavaScript', 'React', 'Node.js', 'Git', 'REST API', 'MongoDB'], missing: ['TypeScript', 'AWS', 'Docker', 'CI/CD', 'GraphQL'] },
  experience: { score: 70, feedback: ['Add quantifiable metrics to achievements', 'Use stronger action verbs', 'Describe impact of your work'] },
  skills: { score: 80, feedback: ['Well-organized skills section', 'Consider adding proficiency levels'] },
  education: { score: 88, feedback: ['Education section is complete', 'Add relevant coursework'] },
  projects: { score: 62, feedback: ['Add GitHub links', 'Describe project impact', 'List technologies used'] },
  suggestions: [
    'Add a professional summary at the top',
    'Include metrics to quantify achievements',
    'Add relevant certifications',
    'Tailor keywords to the job description',
    'Add a GitHub/portfolio link',
  ],
  strengths: ['Strong educational background', 'Relevant technical skills', 'Good project portfolio'],
  weaknesses: ['Missing quantifiable achievements', 'No professional summary', 'Limited cloud experience'],
  overallFeedback: 'Your resume shows solid potential but needs optimization for ATS systems. Focus on adding industry keywords and quantifying your achievements.',
};

const ScoreBar = ({ label, score, color, delay = 0 }) => (
  <div>
    <div className="flex items-center justify-between mb-1">
      <span className="text-slate-300 text-sm">{label}</span>
      <span className="text-white font-semibold text-sm">{score}/100</span>
    </div>
    <div className="progress-bar">
      <motion.div
        className="progress-fill"
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 1, delay, ease: 'easeOut' }}
        style={{ background: `linear-gradient(90deg, ${color}, ${color}CC)` }}
      />
    </div>
  </div>
);

const ResumeAnalysisPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    const loadAnalysis = async () => {
      if (id === 'latest') {
        // Use mock data for demo
        setTimeout(() => { setAnalysis(MOCK_ANALYSIS); setLoading(false); }, 800);
        return;
      }
      try {
        const res = await resumeAPI.getOne(id);
        if (res.data.resume.analysis?.atsScore) {
          setAnalysis(res.data.resume.analysis);
        } else {
          // Auto-analyze
          setAnalyzing(true);
          const analysisRes = await resumeAPI.analyze(id);
          setAnalysis(analysisRes.data.analysis);
          setAnalyzing(false);
        }
      } catch {
        setAnalysis(MOCK_ANALYSIS);
      } finally {
        setLoading(false);
      }
    };
    loadAnalysis();
  }, [id]);

  const reAnalyze = async () => {
    if (id === 'latest') { setAnalysis(null); setLoading(true); setTimeout(() => { setAnalysis(MOCK_ANALYSIS); setLoading(false); }, 1500); return; }
    setAnalyzing(true);
    try {
      const res = await resumeAPI.analyze(id);
      setAnalysis(res.data.analysis);
      toast.success('Re-analysis complete!');
    } catch {
      toast.error('Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const radarData = analysis ? [
    { subject: 'Formatting', A: analysis.formatting?.score || 0 },
    { subject: 'Keywords', A: analysis.keywords?.score || 0 },
    { subject: 'Experience', A: analysis.experience?.score || 0 },
    { subject: 'Skills', A: analysis.skills?.score || 0 },
    { subject: 'Education', A: analysis.education?.score || 0 },
    { subject: 'Projects', A: analysis.projects?.score || 0 },
  ] : [];

  const scoreColor = (s) => s >= 80 ? '#10B981' : s >= 60 ? '#F59E0B' : '#EF4444';

  if (loading || analyzing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 space-y-4">
        <div className="relative w-20 h-20">
          <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-primary font-bold text-xs">AI</div>
        </div>
        <p className="text-white font-semibold">{analyzing ? 'Analyzing your resume...' : 'Loading analysis...'}</p>
        <p className="text-slate-400 text-sm">Our AI is reading your resume, scoring keywords, and preparing feedback.</p>
      </div>
    );
  }

  const score = analysis?.atsScore || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white mb-1">Resume Analysis</h1>
          <p className="text-slate-400 text-sm">AI-powered ATS score and detailed feedback</p>
        </div>
        <div className="flex gap-2">
          <button onClick={reAnalyze} className="btn-secondary flex items-center gap-2 text-sm">
            <FiRefreshCw size={14} /> Re-analyze
          </button>
          <Link to="/dashboard/improve" className="btn-primary flex items-center gap-2 text-sm">
            <FiZap size={14} /> AI Improve
          </Link>
        </div>
      </div>

      {/* Score + Radar */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* ATS Score */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6 flex flex-col items-center">
          <h2 className="text-white font-semibold mb-6">Overall ATS Score</h2>
          <div className="relative w-48 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="65%" outerRadius="85%" startAngle={90} endAngle={-270} data={[{ value: score, fill: scoreColor(score) }]}>
                <RadialBar dataKey="value" background={{ fill: 'rgba(255,255,255,0.05)' }} cornerRadius={6} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-5xl font-bold font-heading" style={{ color: scoreColor(score) }}>
                {score}
              </motion.span>
              <span className="text-slate-400 text-sm">/ 100</span>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-white font-medium">{score >= 80 ? 'Excellent!' : score >= 60 ? 'Good' : 'Needs Improvement'}</p>
            <p className="text-slate-400 text-xs mt-1">{analysis?.overallFeedback?.slice(0, 80)}...</p>
          </div>
        </motion.div>

        {/* Radar Chart */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="glass-card p-6">
          <h2 className="text-white font-semibold mb-4">Category Breakdown</h2>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <Radar name="Score" dataKey="A" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Score Bars */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
        <h2 className="text-white font-semibold mb-5">Section Scores</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <ScoreBar label="Formatting" score={analysis?.formatting?.score || 0} color="#4F46E5" delay={0.3} />
          <ScoreBar label="Keywords" score={analysis?.keywords?.score || 0} color="#7C3AED" delay={0.4} />
          <ScoreBar label="Experience" score={analysis?.experience?.score || 0} color="#06B6D4" delay={0.5} />
          <ScoreBar label="Skills" score={analysis?.skills?.score || 0} color="#10B981" delay={0.6} />
          <ScoreBar label="Education" score={analysis?.education?.score || 0} color="#F59E0B" delay={0.7} />
          <ScoreBar label="Projects" score={analysis?.projects?.score || 0} color="#EC4899" delay={0.8} />
        </div>
      </motion.div>

      {/* Keywords */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <FiCheck size={16} className="text-green-400" /> Keywords Found
          </h2>
          <div className="flex flex-wrap gap-2">
            {(analysis?.keywords?.found || []).map((kw, i) => (
              <motion.span key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className="badge-success">{kw}</motion.span>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card p-6">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <FiX size={16} className="text-red-400" /> Missing Keywords
          </h2>
          <div className="flex flex-wrap gap-2">
            {(analysis?.keywords?.missing || []).map((kw, i) => (
              <motion.span key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className="badge-danger">{kw}</motion.span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Suggestions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <FiAlertCircle size={16} className="text-amber-400" /> AI Suggestions
        </h2>
        <div className="space-y-3">
          {(analysis?.suggestions || []).map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <FiAlertCircle size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-slate-300 text-sm">{s}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Strengths & Weaknesses */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
          <h2 className="text-white font-semibold mb-4">💪 Strengths</h2>
          <ul className="space-y-2">
            {(analysis?.strengths || []).map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <FiCheck size={14} className="text-green-400 mt-0.5 flex-shrink-0" />{s}
              </li>
            ))}
          </ul>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="glass-card p-6">
          <h2 className="text-white font-semibold mb-4">⚠️ Areas to Improve</h2>
          <ul className="space-y-2">
            {(analysis?.weaknesses || []).map((w, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <FiX size={14} className="text-red-400 mt-0.5 flex-shrink-0" />{w}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* CTA */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-6 text-center" style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.1), rgba(124,58,237,0.1))' }}>
        <h3 className="text-white font-bold text-lg mb-2">Ready to Improve Your Resume?</h3>
        <p className="text-slate-400 text-sm mb-4">Let AI rewrite your resume sections for maximum impact and ATS score.</p>
        <Link to="/dashboard/improve" className="btn-primary inline-flex items-center gap-2">
          <FiZap size={16} /> Generate AI Improvements <FiArrowRight size={16} />
        </Link>
      </motion.div>
    </div>
  );
};

export default ResumeAnalysisPage;
