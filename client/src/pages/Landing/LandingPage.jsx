import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { FiArrowRight, FiUpload, FiBarChart2, FiBriefcase, FiMessageSquare, FiStar, FiCheck, FiChevronDown, FiChevronUp, FiZap, FiTarget, FiAward, FiUsers } from 'react-icons/fi';
import Navbar from '../../components/layout/Navbar';
import Hero3D from '../../components/three/Hero3D';

// Animated counter
const Counter = ({ end, suffix = '', duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef();
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const increment = end / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, end, duration]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

const features = [
  { icon: FiBarChart2, title: 'ATS Score Analysis', desc: 'Get instant ATS compatibility score out of 100. Know exactly how recruiters\' systems rate your resume.', color: '#4F46E5', gradient: 'from-primary/20 to-primary/5' },
  { icon: FiZap, title: 'AI Resume Improvement', desc: 'One-click AI generation of better summaries, skill descriptions, and achievement-focused experience points.', color: '#7C3AED', gradient: 'from-secondary/20 to-secondary/5' },
  { icon: FiBriefcase, title: 'Smart Job Matching', desc: 'Get personalized job recommendations ranked by skill match percentage from thousands of live listings.', color: '#06B6D4', gradient: 'from-accent/20 to-accent/5' },
  { icon: FiMessageSquare, title: 'Interview Prep AI', desc: 'Generate role-specific technical, behavioral, and project questions with sample answers and expert tips.', color: '#EC4899', gradient: 'from-pink-500/20 to-pink-500/5' },
  { icon: FiTarget, title: 'Skill Gap Detection', desc: 'Instantly compare your current skills vs. industry requirements with radar charts and trend analysis.', color: '#F59E0B', gradient: 'from-amber-500/20 to-amber-500/5' },
  { icon: FiAward, title: 'Resume Builder', desc: 'Build ATS-friendly resumes from scratch with professional templates and real-time preview.', color: '#10B981', gradient: 'from-emerald-500/20 to-emerald-500/5' },
];

const steps = [
  { num: '01', title: 'Upload Your Resume', desc: 'Drag & drop your PDF or DOCX resume. Our AI instantly extracts and parses all your information.', icon: FiUpload },
  { num: '02', title: 'Get Deep Analysis', desc: 'Receive your ATS score, keyword analysis, formatting feedback, and section-by-section breakdown.', icon: FiBarChart2 },
  { num: '03', title: 'Improve with AI', desc: 'Apply one-click AI suggestions to transform weak descriptions into powerful achievement statements.', icon: FiZap },
  { num: '04', title: 'Land Your Dream Job', desc: 'Apply to matched job recommendations with a resume optimized to beat ATS and impress recruiters.', icon: FiBriefcase },
];

const stats = [
  { value: 50000, suffix: '+', label: 'Resumes Analyzed', icon: FiBarChart2 },
  { value: 12000, suffix: '+', label: 'Users Hired', icon: FiUsers },
  { value: 85, suffix: '%', label: 'ATS Pass Rate', icon: FiTarget },
  { value: 200, suffix: '+', label: 'Companies Hiring', icon: FiBriefcase },
];

const testimonials = [
  { name: 'Sarah Chen', role: 'Software Engineer at Google', avatar: 'SC', text: 'ResumeAI helped me increase my ATS score from 45 to 92. Got 3x more interview calls within a week!', rating: 5 },
  { name: 'Marcus Johnson', role: 'Product Manager at Meta', avatar: 'MJ', text: 'The job matching feature is incredible. It matched me with my current role at Meta with 94% skill match.', rating: 5 },
  { name: 'Priya Sharma', role: 'Data Scientist at Amazon', avatar: 'PS', text: 'The skill gap analysis showed me exactly what to learn. Completed 2 certifications and landed my dream job!', rating: 5 },
  { name: 'Alex Rodriguez', role: 'Frontend Dev at Stripe', avatar: 'AR', text: 'Interview prep questions were spot on. Was asked the exact behavioral questions it generated. Amazing tool!', rating: 5 },
];

const faqs = [
  { q: 'How does the ATS scoring work?', a: 'Our algorithm analyzes your resume against 50+ ATS criteria including keyword density, formatting compliance, section completeness, action verb strength, and quantifiable achievements to produce a score from 0-100.' },
  { q: 'Is my resume data safe and private?', a: 'Absolutely. Your resume data is encrypted in transit and at rest. We never share your information with third parties. You can delete your data anytime from your profile settings.' },
  { q: 'Do I need an OpenAI API key?', a: 'No! The platform works fully without any API key. All analysis, job matching, and interview questions use our built-in engine. AI-powered improvement suggestions require an API key for the most advanced generation.' },
  { q: 'What file formats are supported?', a: 'We support PDF and DOCX (Microsoft Word) formats up to 10MB. We recommend PDF for best parsing accuracy.' },
  { q: 'Can I upload multiple resumes?', a: 'Yes! You can upload and manage multiple resume versions for different job roles and track each one\'s ATS score and analysis independently.' },
  { q: 'How accurate is the job matching?', a: 'Our matching engine compares your skills, experience level, and education against job requirements to calculate a match percentage. Users typically see a 3x improvement in interview rates with 80%+ matched jobs.' },
];

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div layout className="glass-card p-4 cursor-pointer" onClick={() => setOpen(!open)}>
      <div className="flex items-center justify-between gap-4">
        <span className="text-white font-medium">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} className="text-primary flex-shrink-0">
          <FiChevronDown size={18} />
        </motion.div>
      </div>
      <AnimateHeight open={open}>
        <p className="text-slate-400 text-sm mt-3 leading-relaxed">{a}</p>
      </AnimateHeight>
    </motion.div>
  );
};

const AnimateHeight = ({ open, children }) => (
  <motion.div
    initial={false}
    animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
    transition={{ duration: 0.3, ease: 'easeInOut' }}
    style={{ overflow: 'hidden' }}
  >
    {children}
  </motion.div>
);

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const LandingPage = () => {
  return (
    <div className="bg-dark text-white min-h-screen">
      <Navbar />

      {/* ─── Hero ─── */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        {/* Background gradient blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl animate-pulse" style={{ background: 'radial-gradient(circle, #4F46E5, transparent)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl animate-pulse animation-delay-1000" style={{ background: 'radial-gradient(circle, #7C3AED, transparent)' }} />
          <div className="absolute top-1/2 left-1/2 w-60 h-60 rounded-full opacity-10 blur-3xl" style={{ background: 'radial-gradient(circle, #06B6D4, transparent)', transform: 'translate(-50%, -50%)' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <motion.div variants={stagger} initial="hidden" animate="visible" className="relative z-10">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-primary mb-6 border border-primary/30" style={{ background: 'rgba(79,70,229,0.1)' }}>
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Powered by AI · ATS Optimized · Free to Start
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight mb-6">
                Land Your{' '}
                <span className="gradient-text">Dream Job</span>{' '}
                with AI-Powered Resumes
              </motion.h1>

              <motion.p variants={fadeUp} className="text-slate-400 text-lg md:text-xl leading-relaxed mb-8 max-w-xl">
                Upload your resume and get instant ATS score, skill gap analysis, personalized job matches, and AI-generated improvements — all in seconds.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link to="/register" className="btn-primary flex items-center justify-center gap-2 text-base px-8 py-4">
                  Analyze My Resume Free <FiArrowRight size={18} />
                </Link>
                <Link to="/login" className="btn-secondary flex items-center justify-center gap-2 text-base px-8 py-4">
                  <FiUpload size={18} /> Upload & Analyze
                </Link>
              </motion.div>

              {/* Social proof */}
              <motion.div variants={fadeUp} className="flex items-center gap-6">
                <div className="flex -space-x-2">
                  {['SC', 'MJ', 'PS', 'AR', 'TK'].map((av, i) => (
                    <div key={i} className="w-9 h-9 rounded-full border-2 border-dark flex items-center justify-center text-xs font-bold text-white" style={{ background: `hsl(${i * 50 + 230}, 70%, 50%)` }}>
                      {av}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => <FiStar key={i} size={14} className="text-amber-400 fill-amber-400" />)}
                  </div>
                  <p className="text-slate-400 text-sm">Loved by 12,000+ job seekers</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: 3D Canvas */}
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }} className="h-[500px] lg:h-[600px] relative">
              <Hero3D />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section className="py-20 border-y border-white/5" style={{ background: 'linear-gradient(90deg, rgba(79,70,229,0.05) 0%, rgba(124,58,237,0.05) 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div key={i} variants={fadeUp} className="text-center">
                <div className="text-4xl md:text-5xl font-heading font-bold gradient-text mb-1">
                  <Counter end={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.p variants={fadeUp} className="badge-primary mb-4 inline-block">Powerful Features</motion.p>
            <motion.h2 variants={fadeUp} className="section-title mb-4">Everything You Need to Get Hired</motion.h2>
            <motion.p variants={fadeUp} className="text-slate-400 text-lg max-w-2xl mx-auto">
              From ATS optimization to interview prep, our AI handles every step of your job search journey.
            </motion.p>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} variants={fadeUp} whileHover={{ y: -6, scale: 1.02 }} className="glass-card p-6 group cursor-default transition-all duration-300 hover:shadow-card-hover">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{ background: `${f.color}20`, border: `1px solid ${f.color}30` }}>
                  <f.icon size={22} style={{ color: f.color }} />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="how-it-works" className="py-24" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(79,70,229,0.03) 50%, transparent 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.p variants={fadeUp} className="badge-accent mb-4 inline-block">Simple Process</motion.p>
            <motion.h2 variants={fadeUp} className="section-title mb-4">From Upload to Offer in 4 Steps</motion.h2>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-16 left-1/4 right-1/4 h-px bg-gradient-to-r from-primary/50 to-accent/50" style={{ left: '12%', right: '12%' }} />

            {steps.map((step, i) => (
              <motion.div key={i} variants={fadeUp} className="relative text-center">
                <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 mx-auto" style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', boxShadow: '0 0 30px rgba(79,70,229,0.4)' }}>
                  <step.icon size={24} className="text-white" />
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-accent text-dark text-xs font-bold flex items-center justify-center">{i + 1}</span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section id="testimonials" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.p variants={fadeUp} className="badge-primary mb-4 inline-block">Success Stories</motion.p>
            <motion.h2 variants={fadeUp} className="section-title mb-4">Trusted by Thousands of Job Seekers</motion.h2>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={fadeUp} whileHover={{ y: -4 }} className="glass-card p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => <FiStar key={j} size={14} className="text-amber-400" style={{ fill: '#F59E0B' }} />)}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: `hsl(${i * 60 + 230}, 70%, 50%)` }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{t.name}</p>
                    <p className="text-slate-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="py-24" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(79,70,229,0.03) 50%, transparent 100%)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.p variants={fadeUp} className="badge-accent mb-4 inline-block">FAQ</motion.p>
            <motion.h2 variants={fadeUp} className="section-title mb-4">Frequently Asked Questions</motion.h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div key={i} variants={fadeUp}>
                <FaqItem q={faq.q} a={faq.a} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeUp} className="section-title mb-6">Ready to Land Your Dream Job?</motion.h2>
            <motion.p variants={fadeUp} className="text-slate-400 text-lg mb-10">
              Join 12,000+ job seekers who improved their interview rate by 3x with ResumeAI.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary flex items-center justify-center gap-2 text-lg px-10 py-4">
                Start for Free <FiArrowRight size={20} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
                <span className="text-white font-bold text-xs">AI</span>
              </div>
              <span className="text-white font-heading font-bold">Resume<span className="gradient-text">AI</span></span>
            </Link>
            <p className="text-slate-500 text-sm">© 2025 ResumeAI. Built with ❤️ for job seekers worldwide.</p>
            <div className="flex gap-6">
              {['Privacy', 'Terms', 'Contact'].map(l => (
                <a key={l} href="#" className="text-slate-500 hover:text-white text-sm transition-colors">{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
