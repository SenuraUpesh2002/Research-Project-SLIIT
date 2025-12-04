const express = require('express');
const router = express.Router();
const { createSubmission, getSubmissions, getSubmissionById, updateSubmission, deleteSubmission } = require('../controllers/submissionController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, createSubmission).get(protect, admin, getSubmissions);
router.route('/:id').get(protect, getSubmissionById).put(protect, admin, updateSubmission).delete(protect, admin, deleteSubmission);

module.exports = router;
