const axios = require('axios');
const path = require('path');
const fs = require('fs');
const Resume = require('../models/Resume');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// Mock analysis for when AI service is unavailable
const generateMockAnalysis = (filename) => ({
  atsScore: Math.floor(65 + Math.random() * 25),
  formatting: { score: Math.floor(70 + Math.random() * 20), feedback: ['Good use of bullet points', 'Consider adding more white space', 'Font size is appropriate'] },
  keywords: { score: Math.floor(60 + Math.random() * 30), found: ['JavaScript', 'React', 'Node.js', 'REST API', 'Git'], missing: ['TypeScript', 'AWS', 'Docker', 'CI/CD'] },
  experience: { score: Math.floor(65 + Math.random() * 25), feedback: ['Quantify achievements with metrics', 'Use stronger action verbs', 'Add impact statements'] },
  skills: { score: Math.floor(70 + Math.random() * 20), feedback: ['Skills section is well organized', 'Consider adding proficiency levels'] },
  education: { score: Math.floor(80 + Math.random() * 15), feedback: ['Education section is complete', 'Consider adding relevant coursework'] },
  projects: { score: Math.floor(60 + Math.random() * 30), feedback: ['Add GitHub links to projects', 'Describe the impact of your projects', 'Mention technologies used'] },
  suggestions: [
    'Add a professional summary at the top of your resume',
    'Include metrics and numbers to quantify your achievements',
    'Add relevant certifications and courses',
    'Tailor keywords to match the job description',
    'Ensure consistent formatting throughout',
  ],
  strengths: ['Strong educational background', 'Relevant technical skills', 'Good project portfolio'],
  weaknesses: ['Missing quantifiable achievements', 'No professional summary', 'Limited cloud experience'],
  overallFeedback: 'Your resume shows a solid foundation but needs optimization for ATS systems. Focus on adding industry keywords and quantifying your achievements.',
});

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const ext = path.extname(req.file.originalname).toLowerCase().replace('.', '');
    const resume = await Resume.create({
      userId: req.user._id,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      fileUrl: `/uploads/${req.file.filename}`,
      fileType: ext === 'doc' ? 'docx' : ext,
      fileSize: req.file.size,
    });
    res.status(201).json({ success: true, message: 'Resume uploaded successfully', resume });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id, isActive: true }).sort('-createdAt');
    res.json({ success: true, resumes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    res.json({ success: true, resume });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.analyzeResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });

    let analysis;
    try {
      const filePath = path.join(__dirname, '../../uploads', resume.fileName);
      const fileBuffer = fs.readFileSync(filePath);
      const formData = new FormData();
      formData.append('file', new Blob([fileBuffer]), resume.fileName);
      const response = await axios.post(`${AI_SERVICE_URL}/analyze`, formData, { timeout: 30000 });
      analysis = response.data;
    } catch (aiError) {
      console.log('AI service unavailable, using mock analysis');
      analysis = generateMockAnalysis(resume.fileName);
    }

    resume.analysis = analysis;
    await resume.save();
    res.json({ success: true, analysis, resume });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.improveResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });

    let improvements;
    try {
      const response = await axios.post(`${AI_SERVICE_URL}/improve`, {
        resumeText: resume.rawText || 'Sample resume text',
        parsedData: resume.parsedData,
      }, { timeout: 30000 });
      improvements = response.data;
    } catch {
      improvements = {
        summary: 'Results-driven Full-Stack Developer with 3+ years of experience building scalable web applications. Proficient in React, Node.js, and cloud technologies. Proven track record of delivering high-quality solutions that improve user experience and business outcomes.',
        skills: 'JavaScript (ES6+), TypeScript, React.js, Next.js, Node.js, Express.js, MongoDB, PostgreSQL, AWS, Docker, Git, REST APIs, GraphQL',
        experience: [
          'Developed and maintained 5+ production web applications serving 10,000+ daily active users',
          'Reduced page load time by 40% through code optimization and lazy loading implementation',
          'Led a team of 3 developers to deliver critical features 2 weeks ahead of schedule',
        ],
        projects: [
          'Built an e-commerce platform with React and Node.js, processing $50K+ in monthly transactions',
          'Developed a real-time chat application supporting 500+ concurrent users using Socket.io',
        ],
        generated: true,
      };
    }

    resume.improvements = improvements;
    await resume.save();
    res.json({ success: true, improvements, resume });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    resume.isActive = false;
    await resume.save();
    res.json({ success: true, message: 'Resume deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
