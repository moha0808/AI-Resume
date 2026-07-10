const axios = require('axios');
const { Job, SavedJob } = require('../models/Job');
const Resume = require('../models/Resume');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

const MOCK_JOBS = [
  { title: 'Frontend Developer', company: 'TechCorp', location: 'San Francisco, CA', type: 'full-time', salary: { min: 90000, max: 130000, currency: 'USD', period: 'year' }, skills: ['React', 'JavaScript', 'TypeScript', 'CSS', 'Git'], applyLink: 'https://example.com/apply/1', logo: 'TC', category: 'Engineering', experience: '2-4 years', matchScore: 92 },
  { title: 'Backend Engineer', company: 'StartupX', location: 'Remote', type: 'remote', salary: { min: 100000, max: 140000, currency: 'USD', period: 'year' }, skills: ['Node.js', 'Python', 'MongoDB', 'AWS', 'Docker'], applyLink: 'https://example.com/apply/2', logo: 'SX', category: 'Engineering', experience: '3-5 years', matchScore: 85 },
  { title: 'Full Stack Developer', company: 'InnovateLabs', location: 'New York, NY', type: 'full-time', salary: { min: 110000, max: 160000, currency: 'USD', period: 'year' }, skills: ['React', 'Node.js', 'PostgreSQL', 'GraphQL', 'TypeScript'], applyLink: 'https://example.com/apply/3', logo: 'IL', category: 'Engineering', experience: '3-6 years', matchScore: 88 },
  { title: 'Software Engineer Intern', company: 'BigTech Inc', location: 'Seattle, WA', type: 'internship', salary: { min: 6000, max: 8000, currency: 'USD', period: 'month' }, skills: ['Python', 'Java', 'Data Structures', 'Algorithms', 'Git'], applyLink: 'https://example.com/apply/4', logo: 'BT', category: 'Engineering', experience: '0-1 years', matchScore: 78 },
  { title: 'React Developer', company: 'WebAgency', location: 'Austin, TX', type: 'full-time', salary: { min: 80000, max: 110000, currency: 'USD', period: 'year' }, skills: ['React', 'Redux', 'JavaScript', 'HTML', 'CSS'], applyLink: 'https://example.com/apply/5', logo: 'WA', category: 'Engineering', experience: '1-3 years', matchScore: 95 },
  { title: 'DevOps Engineer', company: 'CloudSys', location: 'Remote', type: 'remote', salary: { min: 120000, max: 160000, currency: 'USD', period: 'year' }, skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux'], applyLink: 'https://example.com/apply/6', logo: 'CS', category: 'DevOps', experience: '3-5 years', matchScore: 70 },
  { title: 'Machine Learning Engineer', company: 'AI Startup', location: 'Boston, MA', type: 'full-time', salary: { min: 130000, max: 180000, currency: 'USD', period: 'year' }, skills: ['Python', 'TensorFlow', 'PyTorch', 'scikit-learn', 'MLOps'], applyLink: 'https://example.com/apply/7', logo: 'AS', category: 'AI/ML', experience: '2-5 years', matchScore: 65 },
  { title: 'Mobile Developer (React Native)', company: 'AppVentures', location: 'Chicago, IL', type: 'full-time', salary: { min: 95000, max: 130000, currency: 'USD', period: 'year' }, skills: ['React Native', 'JavaScript', 'iOS', 'Android', 'Firebase'], applyLink: 'https://example.com/apply/8', logo: 'AV', category: 'Mobile', experience: '2-4 years', matchScore: 80 },
];

exports.getJobs = async (req, res) => {
  try {
    const { search, category, type, page = 1, limit = 12 } = req.query;
    let jobs;
    try {
      const dbJobs = await Job.find({ isActive: true }).limit(limit * 1).skip((page - 1) * limit);
      jobs = dbJobs.length > 0 ? dbJobs : MOCK_JOBS;
    } catch {
      jobs = MOCK_JOBS;
    }

    if (search) {
      jobs = jobs.filter(j => j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase()));
    }
    if (category) {
      jobs = jobs.filter(j => j.category === category);
    }
    if (type) {
      jobs = jobs.filter(j => j.type === type);
    }

    res.json({ success: true, jobs, total: jobs.length, page: Number(page) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getRecommendedJobs = async (req, res) => {
  try {
    const userSkills = req.user.skills || [];
    let recommended = MOCK_JOBS;

    if (userSkills.length > 0) {
      recommended = MOCK_JOBS.map(job => {
        const skillMatch = job.skills.filter(s => userSkills.some(us => us.toLowerCase().includes(s.toLowerCase())));
        const matchScore = Math.round((skillMatch.length / job.skills.length) * 100);
        return { ...job, matchScore, matchedSkills: skillMatch, missingSkills: job.skills.filter(s => !skillMatch.includes(s)) };
      }).sort((a, b) => b.matchScore - a.matchScore);
    }

    res.json({ success: true, jobs: recommended.slice(0, 6) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.saveJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const existing = await SavedJob.findOne({ userId: req.user._id, jobId });
    if (existing) return res.status(400).json({ success: false, message: 'Job already saved' });
    const savedJob = await SavedJob.create({ userId: req.user._id, jobId });
    res.status(201).json({ success: true, message: 'Job saved', savedJob });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSavedJobs = async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({ userId: req.user._id }).populate('jobId').sort('-createdAt');
    res.json({ success: true, savedJobs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.unsaveJob = async (req, res) => {
  try {
    await SavedJob.findOneAndDelete({ userId: req.user._id, jobId: req.params.jobId });
    res.json({ success: true, message: 'Job removed from saved' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
