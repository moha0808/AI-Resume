const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const { getProfile, updateProfile, getDashboardStats } = require('../controllers/user.controller');

router.use(protect);
router.get('/profile', getProfile);
router.put('/profile', upload.single('photo'), updateProfile);
router.get('/dashboard-stats', getDashboardStats);

module.exports = router;
