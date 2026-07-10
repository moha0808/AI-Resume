import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FiUser, FiMail, FiPhone, FiMapPin, FiGithub, FiLinkedin, FiBook, FiSave, FiPlus, FiX } from 'react-icons/fi';
import { userAPI } from '../../services/api';
import { useAuthStore } from '../../store';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, setUser } = useAuthStore();
  const [skills, setSkills] = useState(user?.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [saving, setSaving] = useState(false);
  const [completion, setCompletion] = useState(user?.profileCompletion || 65);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      college: user?.college || '',
      degree: user?.degree || '',
      phone: user?.phone || '',
      location: user?.location || '',
      github: user?.github || '',
      linkedin: user?.linkedin || '',
      bio: user?.bio || '',
    },
  });

  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkill('');
    }
  };

  const removeSkill = (s) => setSkills(skills.filter(sk => sk !== s));

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const res = await userAPI.updateProfile({ ...data, skills });
      setUser(res.data.user);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-heading font-bold text-white mb-1">My Profile</h1>
        <p className="text-slate-400 text-sm">Manage your personal information and career details.</p>
      </motion.div>

      {/* Profile Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white" style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary border-2 border-dark flex items-center justify-center hover:bg-primary-600 transition-colors">
              <FiPlus size={12} className="text-white" />
            </button>
          </div>
          <div>
            <h2 className="text-white font-bold text-xl">{user?.name || 'Your Name'}</h2>
            <p className="text-slate-400 text-sm">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-slate-400">Profile Completion</span>
              <div className="w-32 h-1.5 rounded-full bg-white/10">
                <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #4F46E5, #7C3AED)' }} initial={{ width: 0 }} animate={{ width: `${completion}%` }} transition={{ duration: 1, delay: 0.3 }} />
              </div>
              <span className="text-xs text-primary font-bold">{completion}%</span>
            </div>
          </div>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          {/* Basic Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
            <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
              <FiUser size={16} className="text-primary" /> Basic Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                <input type="text" className="input-field" {...register('name', { required: 'Name is required' })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input type="tel" className="input-field pl-9" placeholder="+1 234 567 8900" {...register('phone')} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input type="text" className="input-field pl-9" placeholder="City, Country" {...register('location')} />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Bio / Summary</label>
                <textarea rows={3} className="input-field resize-none" placeholder="Brief professional summary..." {...register('bio')} />
              </div>
            </div>
          </motion.div>

          {/* Education */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card p-6">
            <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
              <FiBook size={16} className="text-secondary" /> Education
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">College / University</label>
                <input type="text" className="input-field" placeholder="MIT, Stanford..." {...register('college')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Degree</label>
                <input type="text" className="input-field" placeholder="B.Tech Computer Science" {...register('degree')} />
              </div>
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
            <h3 className="text-white font-semibold mb-5">Social Links</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">GitHub</label>
                <div className="relative">
                  <FiGithub className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input type="url" className="input-field pl-9" placeholder="https://github.com/username" {...register('github')} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">LinkedIn</label>
                <div className="relative">
                  <FiLinkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input type="url" className="input-field pl-9" placeholder="https://linkedin.com/in/username" {...register('linkedin')} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Skills */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card p-6">
            <h3 className="text-white font-semibold mb-5">Skills</h3>
            <div className="flex gap-2 mb-4">
              <input type="text" value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} placeholder="Add a skill..." className="input-field flex-1" />
              <button type="button" onClick={addSkill} className="btn-primary px-4">
                <FiPlus size={16} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <motion.div key={skill} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-medium text-primary bg-primary/10 border border-primary/20">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="ml-1 text-primary/60 hover:text-red-400 transition-colors">
                    <FiX size={12} />
                  </button>
                </motion.div>
              ))}
              {skills.length === 0 && <p className="text-slate-500 text-sm">No skills added yet. Type a skill above and press Enter.</p>}
            </div>
          </motion.div>

          <motion.button
            type="submit"
            disabled={saving}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base disabled:opacity-50"
          >
            {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiSave size={18} />}
            {saving ? 'Saving...' : 'Save Profile'}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
