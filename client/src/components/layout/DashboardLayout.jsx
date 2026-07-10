import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import { useUIStore } from '../../store';
import { FiBell, FiSearch } from 'react-icons/fi';
import { useAuthStore } from '../../store';

const DashboardLayout = () => {
  const { sidebarOpen } = useUIStore();
  const { user } = useAuthStore();

  return (
    <div className="flex h-screen bg-dark overflow-hidden">
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-white/10 flex-shrink-0" style={{ background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(8px)' }}>
          <div className="flex-1 max-w-md">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input type="text" placeholder="Search..." className="input-field pl-9 py-2 text-sm h-9" />
            </div>
          </div>

          <div className="flex items-center gap-3 ml-4">
            <button className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <FiBell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
            </button>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="text-sm text-white font-medium hidden sm:block">{user?.name?.split(' ')[0] || 'User'}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6 min-h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
