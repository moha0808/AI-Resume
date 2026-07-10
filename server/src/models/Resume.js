const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  originalName: String,
  fileUrl: String,
  fileType: {
    type: String,
    enum: ['pdf', 'docx'],
  },
  fileSize: Number,
  rawText: String,
  parsedData: {
    name: String,
    email: String,
    phone: String,
    skills: [String],
    experience: [{
      title: String,
      company: String,
      duration: String,
      description: String,
    }],
    education: [{
      degree: String,
      institution: String,
      year: String,
      gpa: String,
    }],
    projects: [{
      name: String,
      description: String,
      technologies: [String],
      link: String,
    }],
    certifications: [String],
    summary: String,
  },
  analysis: {
    atsScore: { type: Number, default: 0 },
    formatting: { score: Number, feedback: [String] },
    keywords: { score: Number, found: [String], missing: [String] },
    experience: { score: Number, feedback: [String] },
    skills: { score: Number, feedback: [String] },
    education: { score: Number, feedback: [String] },
    projects: { score: Number, feedback: [String] },
    suggestions: [String],
    strengths: [String],
    weaknesses: [String],
    overallFeedback: String,
  },
  improvements: {
    summary: String,
    skills: String,
    experience: [String],
    projects: [String],
    generated: { type: Boolean, default: false },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);
