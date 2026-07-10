const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { getJobs, getRecommendedJobs, saveJob, getSavedJobs, unsaveJob } = require('../controllers/job.controller');

router.get('/', protect, getJobs);
router.get('/recommend', protect, getRecommendedJobs);
router.get('/saved', protect, getSavedJobs);
router.post('/save', protect, saveJob);
router.delete('/save/:jobId', protect, unsaveJob);

module.exports = router;
