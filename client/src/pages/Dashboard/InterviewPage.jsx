import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiZap, FiCode, FiUsers, FiActivity, FiFolder, FiChevronDown, FiChevronUp, FiBookmark } from 'react-icons/fi';
import { interviewAPI } from '../../services/api';
import toast from 'react-hot-toast';

const MOCK_QUESTIONS = [
  { question: 'Explain the concept of closures in JavaScript and provide a practical example.', type: 'technical', difficulty: 'intermediate', sampleAnswer: 'A closure is a function that retains access to variables from its outer lexical scope even after the outer function has returned. Example: factory functions, event handlers, module patterns.', tips: 'Walk through a practical code example. Mention memory implications and common pitfalls like loop closures.' },
  { question: 'What is the difference between controlled and uncontrolled components in React?', type: 'technical', difficulty: 'intermediate', sampleAnswer: 'Controlled components have their state managed by React via props and onChange handlers. Uncontrolled components use DOM refs and manage their own state internally.', tips: 'Demonstrate with code snippets. Mention when to use each pattern and form libraries like React Hook Form.' },
  { question: 'How does the Node.js event loop work?', type: 'technical', difficulty: 'intermediate', sampleAnswer: 'The event loop is Node.js\'s mechanism for handling async operations. It processes the call stack, then checks microtasks (Promises), then macro tasks (setTimeout, I/O callbacks) in phases.', tips: 'Draw the phases: timers, I/O, idle, poll, check, close. Show how async/await fits in.' },
  { question: 'Describe a situation where you had to debug a critical production issue. How did you approach it?', type: 'behavioral', difficulty: 'intermediate', sampleAnswer: 'Use the STAR method. Describe the incident, your systematic debugging approach (logs, metrics, reproduce locally), the fix, and preventive measures.', tips: 'Show calm under pressure, systematic thinking, and learning mindset. Mention communication with stakeholders.' },
  { question: 'Tell me about a time you had a conflict with a teammate. How did you resolve it?', type: 'behavioral', difficulty: 'intermediate', sampleAnswer: 'Emphasize active listening, data-driven discussion, seeking common ground, and escalating appropriately when needed.', tips: 'Avoid blaming others. Focus on the process and outcome. Show emotional intelligence.' },
  { question: 'Why are you interested in this particular role and company?', type: 'hr', difficulty: 'beginner', sampleAnswer: 'Research the company\'s mission, recent news, and tech stack. Connect your skills and career goals to the specific role requirements.', tips: 'Show genuine enthusiasm. Mention specific company achievements or products that impressed you.' },
  { question: 'Where do you see yourself in 5 years?', type: 'hr', difficulty: 'beginner', sampleAnswer: 'Align your growth goals with the company\'s opportunities. Show ambition but also commitment to the role.', tips: 'Avoid extremes: don\'t say "running my own company" or give a vague answer. Show a realistic progression path.' },
  { question: 'Walk me through your most technically challenging project in detail.', type: 'project', difficulty: 'advanced', sampleAnswer: 'Describe the problem, architecture decisions, technologies chosen and why, key challenges, solutions, and measurable results.', tips: 'Have metrics ready: performance improvements, scale, users, cost savings. Show system thinking.' },
  { question: 'How would you optimize a React application that has performance issues?', type: 'technical', difficulty: 'advanced', sampleAnswer: 'Start with profiling (React DevTools, Lighthouse). Then apply: React.memo, useMemo, useCallback, code splitting, lazy loading, virtualization, and state optimization.', tips: 'Show a systematic approach: measure first, then optimize. Mention avoiding premature optimization.' },
];

const typeConfig = {
  technical: { icon: FiCode, color: '#4F46E5', label: 'Technical' },
  behavioral: { icon: FiActivity, color: '#7C3AED', label: 'Behavioral' },
  hr: { icon: FiUsers, color: '#06B6D4', label: 'HR' },
  project: { icon: FiFolder, color: '#10B981', label: 'Project' },
};

const diffColors = { beginner: '#10B981', intermediate: '#F59E0B', advanced: '#EF4444' };

const QuestionCard = ({ q, index }) => {
  const [open, setOpen] = useState(false);
  const config = typeConfig[q.type] || typeConfig.technical;
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
      className="glass-card overflow-hidden">
      <div className="p-4 cursor-pointer" onClick={() => setOpen(!open)}>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${config.color}20` }}>
            <config.icon size={14} style={{ color: config.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-xs font-semibold" style={{ color: config.color }}>{config.label}</span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span className="text-xs font-medium capitalize" style={{ color: diffColors[q.difficulty] }}>{q.difficulty}</span>
            </div>
            <p className="text-white text-sm font-medium leading-snug">{q.question}</p>
          </div>
          <motion.div animate={{ rotate: open ? 180 : 0 }} className="text-slate-400 flex-shrink-0">
            <FiChevronDown size={16} />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-4 pb-4 space-y-3 border-t border-white/10 pt-3">
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Sample Answer Approach</h4>
                <p className="text-slate-300 text-sm leading-relaxed">{q.sampleAnswer}</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                <h4 className="text-xs font-semibold text-amber-400 mb-1">💡 Pro Tip</h4>
                <p className="text-slate-300 text-sm">{q.tips}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const InterviewPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [jobRole, setJobRole] = useState('Full Stack Developer');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [activeType, setActiveType] = useState('all');

  const generate = async () => {
    setLoading(true);
    try {
      const res = await interviewAPI.generate({ jobRole, difficulty });
      setQuestions(res.data.questions || MOCK_QUESTIONS);
      toast.success('Interview questions generated!');
    } catch {
      await new Promise(r => setTimeout(r, 1500));
      setQuestions(MOCK_QUESTIONS);
      toast.success('Questions generated (demo mode)!');
    } finally {
      setLoading(false);
    }
  };

  const filtered = activeType === 'all' ? questions : questions.filter(q => q.type === activeType);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-heading font-bold text-white mb-1">Interview Question Generator</h1>
        <p className="text-slate-400 text-sm">Generate personalized interview questions based on your target role.</p>
      </motion.div>

      {/* Config Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
        <div className="grid md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Job Role</label>
            <input type="text" value={jobRole} onChange={e => setJobRole(e.target.value)} placeholder="e.g. Full Stack Developer" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Difficulty Level</label>
            <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="input-field">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <button onClick={generate} disabled={loading} className="btn-primary flex items-center justify-center gap-2 py-3 disabled:opacity-50">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiZap size={16} />}
            {loading ? 'Generating...' : 'Generate Questions'}
          </button>
        </div>
      </motion.div>

      {questions.length > 0 && (
        <>
          {/* Type Filter */}
          <div className="flex gap-2 flex-wrap">
            {['all', 'technical', 'behavioral', 'hr', 'project'].map(type => (
              <button key={type} onClick={() => setActiveType(type)}
                className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${activeType === type ? 'text-white' : 'text-slate-400 hover:text-white bg-white/5'}`}
                style={activeType === type ? { background: typeConfig[type]?.color || '#4F46E5' } : {}}>
                {type} {type !== 'all' && <span className="ml-1 text-xs opacity-70">{questions.filter(q => q.type === type).length}</span>}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map((q, i) => <QuestionCard key={i} q={q} index={i} />)}
          </div>
        </>
      )}

      {!questions.length && !loading && (
        <div className="glass-card p-12 text-center">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <FiMessageSquare size={32} className="text-primary" />
          </div>
          <h2 className="text-white font-bold text-lg mb-2">No Questions Yet</h2>
          <p className="text-slate-400 text-sm">Configure your target role and click "Generate Questions" to get personalized interview prep questions.</p>
        </div>
      )}
    </div>
  );
};

export default InterviewPage;
