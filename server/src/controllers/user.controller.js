const User = require('../models/User');
const Resume = require('../models/Resume');
const { SavedJob } = require('../models/Job');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const resumeCount = await Resume.countDocuments({ userId: req.user._id, isActive: true });
    const savedJobCount = await SavedJob.countDocuments({ userId: req.user._id });
    res.json({ success: true, user: { ...user.toObject(), resumeCount, savedJobCount } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, college, degree, graduationYear, skills, github, linkedin, phone, location, bio } = req.body;
    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (college !== undefined) user.college = college;
    if (degree !== undefined) user.degree = degree;
    if (graduationYear !== undefined) user.graduationYear = graduationYear;
    if (skills !== undefined) user.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    if (github !== undefined) user.github = github;
    if (linkedin !== undefined) user.linkedin = linkedin;
    if (phone !== undefined) user.phone = phone;
    if (location !== undefined) user.location = location;
    if (bio !== undefined) user.bio = bio;
    if (req.file) user.photo = `/uploads/${req.file.filename}`;
    user.calculateProfileCompletion();
    await user.save({ validateBeforeSave: false });
    res.json({ success: true, message: 'Profile updated', user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const [resumeCount, savedJobCount, latestResume] = await Promise.all([
      Resume.countDocuments({ userId: req.user._id, isActive: true }),
      SavedJob.countDocuments({ userId: req.user._id }),
      Resume.findOne({ userId: req.user._id, isActive: true }).sort('-createdAt'),
    ]);

    const atsScore = latestResume?.analysis?.atsScore || 0;
    const skillsFound = latestResume?.analysis?.keywords?.found?.length || 0;
    const missingSkills = latestResume?.analysis?.keywords?.missing?.length || 0;

    res.json({
      success: true,
      stats: {
        resumeCount,
        savedJobCount,
        atsScore,
        skillsFound,
        missingSkills,
        profileCompletion: req.user.profileCompletion || 0,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
