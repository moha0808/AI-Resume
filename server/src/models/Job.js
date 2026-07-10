const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: String,
  type: { type: String, enum: ['full-time', 'part-time', 'contract', 'internship', 'remote'], default: 'full-time' },
  salary: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'USD' },
    period: { type: String, default: 'year' },
  },
  description: String,
  requirements: [String],
  skills: [String],
  applyLink: String,
  logo: String,
  category: String,
  experience: String,
  education: String,
  postedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  source: { type: String, default: 'internal' },
}, { timestamps: true });

const savedJobSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  notes: String,
  status: {
    type: String,
    enum: ['saved', 'applied', 'interview', 'offer', 'rejected'],
    default: 'saved',
  },
}, { timestamps: true });

savedJobSchema.index({ userId: 1, jobId: 1 }, { unique: true });

const interviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
  jobRole: String,
  questions: [{
    question: String,
    type: { type: String, enum: ['technical', 'hr', 'behavioral', 'project'] },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
    sampleAnswer: String,
    tips: String,
  }],
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate' },
}, { timestamps: true });

module.exports = {
  Job: mongoose.model('Job', jobSchema),
  SavedJob: mongoose.model('SavedJob', savedJobSchema),
  Interview: mongoose.model('Interview', interviewSchema),
};
