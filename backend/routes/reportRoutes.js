const express = require('express');
const router = express.Router();
const { createReport, getReports, getReportById, updateReport, deleteReport } = require('../controllers/reportController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, createReport).get(protect, admin, getReports);
router.route('/:id').get(protect, getReportById).put(protect, admin, updateReport).delete(protect, admin, deleteReport);

module.exports = router;
