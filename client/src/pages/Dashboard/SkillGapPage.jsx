import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTarget, FiTrendingUp, FiBookOpen, FiArrowRight } from 'react-icons/fi';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const currentSkills = ['JavaScript', 'React', 'Node.js', 'MongoDB', 'HTML', 'CSS', 'Git', 'REST API'];
const missingSkills = [
  { skill: 'TypeScript', demand: 'High', learning: '2 weeks', color: '#4F46E5' },
  { skill: 'AWS', demand: 'High', learning: '1 month', color: '#7C3AED' },
  { skill: 'Docker', demand: 'Medium', learning: '1 week', color: '#06B6D4' },
  { skill: 'CI/CD', demand: 'Medium', learning: '2 weeks', color: '#10B981' },
  { skill: 'GraphQL', demand: 'Medium', learning: '1 week', color: '#F59E0B' },
  { skill: 'Redis', demand: 'Low', learning: '3 days', color: '#EC4899' },
];
const trendingSkills = ['AI/ML Integration', 'Next.js', 'Prisma', 'Bun.js', 'tRPC', 'Turborepo', 'Rust', 'Go'];

const radarData = [
  { subject: 'Frontend', score: 88 }, { subject: 'Backend', score: 72 }, { subject: 'Database', score: 65 },
  { subject: 'Cloud', score: 30 }, { subject: 'DevOps', score: 25 }, { subject: 'AI/ML', score: 20 },
];

const pieData = [
  { name: 'Strong', value: 8, color: '#10B981' },
  { name: 'Learning', value: 4, color: '#F59E0B' },
  { name: 'Missing', value: 6, color: '#EF4444' },
];

const demandBadge = (d) => d === 'High' ? 'badge-danger' : d === 'Medium' ? 'badge-warning' : 'badge-accent';

const SkillGapPage = () => {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-heading font-bold text-white mb-1">Skill Gap Analysis</h1>
        <p className="text-slate-400 text-sm">Compare your skills against industry requirements and identify gaps.</p>
      </motion.div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Radar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
          <h2 className="text-white font-semibold mb-4">Skill Domain Coverage</h2>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <Radar name="Your Skills" dataKey="score" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.25} strokeWidth={2} dot={{ fill: '#4F46E5', r: 3 }} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie + Legend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-6">
          <h2 className="text-white font-semibold mb-4">Skill Portfolio</h2>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3 flex-1">
              {pieData.map((d, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: d.color }} />
                    <span className="text-slate-300 text-sm">{d.name}</span>
                  </div>
                  <span className="text-white font-bold">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Current Skills */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <FiTarget size={16} className="text-green-400" /> Your Current Skills
        </h2>
        <div className="flex flex-wrap gap-2">
          {currentSkills.map((skill, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-green-300 text-sm font-medium">{skill}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Missing Skills */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card p-6">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <FiBookOpen size={16} className="text-amber-400" /> Skills to Acquire
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {missingSkills.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              whileHover={{ y: -2 }} className="p-4 rounded-xl border border-white/10 bg-white/3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium text-sm">{item.skill}</span>
                <span className={demandBadge(item.demand)}>{item.demand} Demand</span>
              </div>
              <div className="progress-bar mb-2">
                <div className="progress-fill" style={{ width: '0%', background: item.color }} />
              </div>
              <p className="text-slate-400 text-xs">Est. learning time: {item.learning}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Trending Skills */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <FiTrendingUp size={16} className="text-accent" /> Trending in the Industry
        </h2>
        <div className="flex flex-wrap gap-2">
          {trendingSkills.map((skill, i) => (
            <motion.span key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className="badge-accent flex items-center gap-1">
              <FiTrendingUp size={10} /> {skill}
            </motion.span>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card p-6 text-center" style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.1), rgba(79,70,229,0.1))' }}>
        <h3 className="text-white font-bold text-lg mb-2">Ready to Fill Your Skill Gaps?</h3>
        <p className="text-slate-400 text-sm mb-4">Use AI to improve your resume and get matched with jobs that fit your skill level.</p>
        <Link to="/dashboard/jobs" className="btn-primary inline-flex items-center gap-2">
          View Matching Jobs <FiArrowRight size={16} />
        </Link>
      </motion.div>
    </div>
  );
};

export default SkillGapPage;
