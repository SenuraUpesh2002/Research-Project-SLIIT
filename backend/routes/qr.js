const express = require('express');
const router = express.Router();
const { generateDailyQR, getTodayQR } = require('../controllers/qrController');
const auth = require('../middleware/authMiddleware');

// @route   POST api/qr/generate
// @desc    Generate daily QR
// @access  Private (Admin only - TODO: Add role check)
router.post('/generate', auth, generateDailyQR);

// @route   GET api/qr/today
// @desc    Get today's QR
// @access  Private
router.get('/today', auth, getTodayQR);

module.exports = router;
