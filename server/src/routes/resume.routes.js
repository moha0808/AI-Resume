const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const { uploadResume, getResumes, getResume, analyzeResume, improveResume, deleteResume } = require('../controllers/resume.controller');

router.use(protect);
router.post('/upload', upload.single('resume'), uploadResume);
router.get('/', getResumes);
router.get('/:id', getResume);
router.post('/:id/analyze', analyzeResume);
router.post('/:id/improve', improveResume);
router.delete('/:id', deleteResume);

module.exports = router;
