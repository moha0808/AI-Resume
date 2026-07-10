import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiBriefcase, FiMapPin, FiDollarSign, FiBookmark, FiExternalLink, FiSearch, FiFilter, FiStar, FiClock } from 'react-icons/fi';
import { jobAPI } from '../../services/api';
import toast from 'react-hot-toast';

const MOCK_JOBS = [
  { _id: '1', title: 'Frontend Developer', company: 'TechCorp', location: 'San Francisco, CA', type: 'full-time', salary: { min: 90000, max: 130000 }, skills: ['React', 'JavaScript', 'TypeScript'], logo: 'TC', matchScore: 92, experience: '2-4 years', postedAt: new Date(Date.now() - 86400000 * 2) },
  { _id: '2', title: 'Backend Engineer', company: 'StartupX', location: 'Remote', type: 'remote', salary: { min: 100000, max: 140000 }, skills: ['Node.js', 'Python', 'MongoDB'], logo: 'SX', matchScore: 85, experience: '3-5 years', postedAt: new Date(Date.now() - 86400000 * 1) },
  { _id: '3', title: 'Full Stack Developer', company: 'InnovateLabs', location: 'New York, NY', type: 'full-time', salary: { min: 110000, max: 160000 }, skills: ['React', 'Node.js', 'PostgreSQL'], logo: 'IL', matchScore: 88, experience: '3-6 years', postedAt: new Date(Date.now() - 86400000 * 3) },
  { _id: '4', title: 'Software Engineer Intern', company: 'BigTech Inc', location: 'Seattle, WA', type: 'internship', salary: { min: 6000, max: 8000 }, skills: ['Python', 'Java', 'Git'], logo: 'BT', matchScore: 78, experience: '0-1 years', postedAt: new Date() },
  { _id: '5', title: 'React Developer', company: 'WebAgency', location: 'Austin, TX', type: 'full-time', salary: { min: 80000, max: 110000 }, skills: ['React', 'Redux', 'CSS'], logo: 'WA', matchScore: 95, experience: '1-3 years', postedAt: new Date(Date.now() - 86400000 * 5) },
  { _id: '6', title: 'DevOps Engineer', company: 'CloudSys', location: 'Remote', type: 'remote', salary: { min: 120000, max: 160000 }, skills: ['AWS', 'Docker', 'Kubernetes'], logo: 'CS', matchScore: 70, experience: '3-5 years', postedAt: new Date(Date.now() - 86400000 * 7) },
  { _id: '7', title: 'ML Engineer', company: 'AI Startup', location: 'Boston, MA', type: 'full-time', salary: { min: 130000, max: 180000 }, skills: ['Python', 'TensorFlow', 'PyTorch'], logo: 'AS', matchScore: 65, experience: '2-5 years', postedAt: new Date(Date.now() - 86400000 * 4) },
  { _id: '8', title: 'Mobile Developer', company: 'AppVentures', location: 'Chicago, IL', type: 'full-time', salary: { min: 95000, max: 130000 }, skills: ['React Native', 'iOS', 'Android'], logo: 'AV', matchScore: 80, experience: '2-4 years', postedAt: new Date(Date.now() - 86400000 * 6) },
];

const typeColors = { 'full-time': '#10B981', 'remote': '#4F46E5', 'internship': '#F59E0B', 'contract': '#06B6D4', 'part-time': '#7C3AED' };

const matchColor = (s) => s >= 85 ? '#10B981' : s >= 70 ? '#F59E0B' : '#EF4444';

const days = (d) => {
  const diff = Math.floor((Date.now() - new Date(d)) / 86400000);
  return diff === 0 ? 'Today' : diff === 1 ? '1 day ago' : `${diff} days ago`;
};

const JobCard = ({ job, onSave, saved }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -4 }}
    className="glass-card p-5 flex flex-col gap-4 group transition-all duration-300 hover:shadow-card-hover">
    {/* Header */}
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: `hsl(${job._id * 47}, 60%, 35%)` }}>
          {job.logo}
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm group-hover:text-primary transition-colors">{job.title}</h3>
          <p className="text-slate-400 text-xs">{job.company}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold" style={{ background: `${matchColor(job.matchScore)}20`, color: matchColor(job.matchScore), border: `1px solid ${matchColor(job.matchScore)}30` }}>
        {job.matchScore}% match
      </div>
    </div>

    {/* Meta */}
    <div className="flex flex-wrap gap-3 text-xs text-slate-400">
      <span className="flex items-center gap-1"><FiMapPin size={11} />{job.location}</span>
      <span className="flex items-center gap-1"><FiDollarSign size={11} />${(job.salary.min / 1000).toFixed(0)}k - ${(job.salary.max / 1000).toFixed(0)}k</span>
      <span className="flex items-center gap-1"><FiClock size={11} />{days(job.postedAt)}</span>
    </div>

    {/* Skills */}
    <div className="flex flex-wrap gap-1">
      {job.skills.slice(0, 4).map((s, i) => <span key={i} className="badge-primary text-xs">{s}</span>)}
    </div>

    {/* Type Badge */}
    <div className="flex items-center justify-between">
      <span className="text-xs font-medium capitalize px-2 py-0.5 rounded-full" style={{ background: `${typeColors[job.type]}20`, color: typeColors[job.type] }}>
        {job.type}
      </span>
      <span className="text-slate-400 text-xs">{job.experience}</span>
    </div>

    {/* Actions */}
    <div className="flex gap-2">
      <a href={job.applyLink || '#'} target="_blank" rel="noopener noreferrer" className="btn-primary flex-1 flex items-center justify-center gap-1 text-xs py-2">
        Apply <FiExternalLink size={12} />
      </a>
      <button onClick={() => onSave(job._id)} className={`p-2 rounded-xl border transition-all ${saved ? 'border-primary/50 text-primary bg-primary/10' : 'border-white/10 text-slate-400 hover:border-primary/30 hover:text-primary hover:bg-primary/5'}`}>
        <FiBookmark size={16} />
      </button>
    </div>
  </motion.div>
);

const JobsPage = () => {
  const [jobs, setJobs] = useState(MOCK_JOBS);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [savedIds, setSavedIds] = useState(new Set());
  const [activeTab, setActiveTab] = useState('all');

  const filtered = jobs.filter(j => {
    const matchSearch = !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase());
    const matchType = !typeFilter || j.type === typeFilter;
    return matchSearch && matchType;
  }).sort((a, b) => (activeTab === 'recommended' ? b.matchScore - a.matchScore : b.postedAt - a.postedAt));

  const handleSave = (id) => {
    setSavedIds(prev => { const next = new Set(prev); if (next.has(id)) { next.delete(id); toast.success('Removed from saved'); } else { next.add(id); toast.success('Job saved!'); } return next; });
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-heading font-bold text-white mb-1">Job Recommendations</h1>
        <p className="text-slate-400 text-sm">Personalized matches based on your resume skills and experience.</p>
      </motion.div>

      {/* Tabs + Filters */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
          {['all', 'recommended'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${activeTab === tab ? 'bg-primary text-white shadow-glow' : 'text-slate-400 hover:text-white'}`}>
              {tab === 'recommended' && <FiStar size={12} className="inline mr-1" />}{tab}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input type="text" placeholder="Search jobs..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9 py-2 text-sm h-10" />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="input-field py-2 text-sm h-10 w-auto">
          <option value="">All Types</option>
          <option value="full-time">Full-Time</option>
          <option value="remote">Remote</option>
          <option value="internship">Internship</option>
          <option value="contract">Contract</option>
        </select>
      </motion.div>

      {/* Stats */}
      <div className="flex gap-4 text-sm text-slate-400">
        <span><strong className="text-white">{filtered.length}</strong> jobs found</span>
        <span>·</span>
        <span><strong className="text-white">{savedIds.size}</strong> saved</span>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(job => (
          <JobCard key={job._id} job={job} onSave={handleSave} saved={savedIds.has(job._id)} />
        ))}
      </div>
    </div>
  );
};

export default JobsPage;
