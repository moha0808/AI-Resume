import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiHome, FiUpload, FiBarChart2, FiTarget, FiBriefcase,
  FiZap, FiLayout, FiMessageSquare, FiBookmark, FiUser,
  FiSettings, FiLogOut, FiChevronLeft, FiChevronRight
} from 'react-icons/fi';
import { useAuthStore, useUIStore } from '../../store';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';

const navItems = [
  { label: 'Dashboard', icon: FiHome, to: '/dashboard' },
  { label: 'Upload Resume', icon: FiUpload, to: '/dashboard/upload' },
  { label: 'Analysis', icon: FiBarChart2, to: '/dashboard/analysis/latest' },
  { label: 'Skill Gap', icon: FiTarget, to: '/dashboard/skills' },
  { label: 'Job Matches', icon: FiBriefcase, to: '/dashboard/jobs' },
  { label: 'AI Improve', icon: FiZap, to: '/dashboard/improve' },
  { label: 'Builder', icon: FiLayout, to: '/dashboard/builder' },
  { label: 'Interview', icon: FiMessageSquare, to: '/dashboard/interview' },
  { label: 'Saved Jobs', icon: FiBookmark, to: '/dashboard/saved-jobs' },
];

const Sidebar = () => {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await authAPI.logout(); } catch {}
    clearAuth();
    toast.success('Logged out!');
    navigate('/');
  };

  return (
    <motion.aside
      animate={{ width: sidebarOpen ? 256 : 72 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative flex flex-col h-full border-r border-white/10"
      style={{ background: 'linear-gradient(180deg, #0F1729 0%, #131A2E 100%)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
          <span className="text-white font-bold text-sm">AI</span>
        </div>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="font-heading font-bold text-white whitespace-nowrap">
              Resume<span className="gradient-text">AI</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
        {navItems.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={18} className="flex-shrink-0" />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="text-sm font-medium whitespace-nowrap">
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}

        <div className="border-t border-white/10 pt-2 mt-2">
          <NavLink to="/dashboard/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <FiUser size={18} className="flex-shrink-0" />
            <AnimatePresence>
              {sidebarOpen && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm font-medium">Profile</motion.span>}
            </AnimatePresence>
          </NavLink>
        </div>
      </nav>

      {/* User Footer */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className={`flex items-center gap-3 mb-2 ${!sidebarOpen ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="overflow-hidden">
                <p className="text-white text-sm font-medium truncate">{user?.name || 'User'}</p>
                <p className="text-slate-500 text-xs truncate">{user?.email || ''}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button onClick={handleLogout} className={`sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 ${!sidebarOpen ? 'justify-center' : ''}`}>
          <FiLogOut size={16} className="flex-shrink-0" />
          {sidebarOpen && <span className="text-sm">Sign Out</span>}
        </button>
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 z-10 w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-slate-400 hover:text-white transition-all"
        style={{ background: '#1E293B' }}
      >
        {sidebarOpen ? <FiChevronLeft size={12} /> : <FiChevronRight size={12} />}
      </button>
    </motion.aside>
  );
};

export default Sidebar;
