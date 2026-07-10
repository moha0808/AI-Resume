import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiFileText, FiBriefcase, FiBarChart2, FiTrash2, FiSearch } from 'react-icons/fi';
import { adminAPI } from '../../services/api';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const MOCK_STATS = { totalUsers: 1248, totalResumes: 3872, totalJobs: 45 };
const MOCK_USERS = [
  { _id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'user', createdAt: new Date(Date.now() - 86400000 * 5), profileCompletion: 85 },
  { _id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'user', createdAt: new Date(Date.now() - 86400000 * 3), profileCompletion: 60 },
  { _id: '3', name: 'Carol Davis', email: 'carol@example.com', role: 'admin', createdAt: new Date(Date.now() - 86400000 * 30), profileCompletion: 100 },
  { _id: '4', name: 'Dave Wilson', email: 'dave@example.com', role: 'user', createdAt: new Date(Date.now() - 86400000 * 1), profileCompletion: 40 },
];
const CHART_DATA = [
  { month: 'Jan', users: 120 }, { month: 'Feb', users: 190 }, { month: 'Mar', users: 280 },
  { month: 'Apr', users: 340 }, { month: 'May', users: 420 }, { month: 'Jun', users: 580 },
  { month: 'Jul', users: 750 }, { month: 'Aug', users: 920 }, { month: 'Sep', users: 1100 },
];

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="glass-card p-6 flex items-center gap-4">
    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
      <Icon size={22} style={{ color }} />
    </div>
    <div>
      <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">{label}</p>
      <p className="text-white text-2xl font-bold font-heading">{value.toLocaleString()}</p>
    </div>
  </div>
);

const AdminPage = () => {
  const [stats, setStats] = useState(MOCK_STATS);
  const [users, setUsers] = useState(MOCK_USERS);
  const [search, setSearch] = useState('');

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-dark text-white p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold gradient-text">Admin Dashboard</h1>
          <p className="text-slate-400 mt-1">Platform analytics and user management</p>
        </div>
        <Link to="/dashboard" className="btn-secondary text-sm">← Back to App</Link>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard icon={FiUsers} label="Total Users" value={stats.totalUsers} color="#4F46E5" />
        <StatCard icon={FiFileText} label="Resumes Analyzed" value={stats.totalResumes} color="#7C3AED" />
        <StatCard icon={FiBriefcase} label="Job Listings" value={stats.totalJobs} color="#06B6D4" />
      </div>

      {/* Growth Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <FiBarChart2 size={16} className="text-primary" /> User Growth
        </h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={CHART_DATA}>
            <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
            <Bar dataKey="users" fill="#4F46E5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Users Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
        <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
          <h2 className="text-white font-semibold">User Management</h2>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input type="text" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9 py-2 text-sm h-9" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 text-slate-400 font-medium">User</th>
                <th className="text-left py-3 text-slate-400 font-medium">Role</th>
                <th className="text-left py-3 text-slate-400 font-medium">Profile</th>
                <th className="text-left py-3 text-slate-400 font-medium">Joined</th>
                <th className="text-left py-3 text-slate-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user._id} className="border-b border-white/5 hover:bg-white/3 transition-all">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
                        {user.name[0]}
                      </div>
                      <div>
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-slate-500 text-xs">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className={`${user.role === 'admin' ? 'badge-primary' : 'badge-accent'}`}>{user.role}</span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${user.profileCompletion}%` }} />
                      </div>
                      <span className="text-slate-400 text-xs">{user.profileCompletion}%</span>
                    </div>
                  </td>
                  <td className="py-3 text-slate-400 text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="py-3">
                    <button onClick={() => setUsers(u => u.filter(x => x._id !== user._id))} className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                      <FiTrash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminPage;
