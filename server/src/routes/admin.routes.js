const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth.middleware');
const User = require('../models/User');
const Resume = require('../models/Resume');
const { Job } = require('../models/Job');

router.use(protect, adminOnly);

router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalResumes, totalJobs] = await Promise.all([
      User.countDocuments(),
      Resume.countDocuments(),
      Job.countDocuments(),
    ]);
    res.json({ success: true, stats: { totalUsers, totalResumes, totalJobs } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const users = await User.find().sort('-createdAt').limit(limit * 1).skip((page - 1) * limit);
    const total = await User.countDocuments();
    res.json({ success: true, users, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
