const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { generateInterviewQuestions, getInterviews } = require('../controllers/interview.controller');

router.use(protect);
router.post('/generate', generateInterviewQuestions);
router.get('/', getInterviews);

module.exports = router;
