const express = require('express');
const router = express.Router();
const { scanQR, checkout, getTodayCheckIns } = require('../controllers/checkinController');
const auth = require('../middleware/authMiddleware');

// @route   POST api/checkin/scan
// @desc    Scan QR to check in
// @access  Private
router.post('/scan', auth, scanQR);

// @route   POST api/checkin/checkout
// @desc    Check out
// @access  Private
router.post('/checkout', auth, checkout);

// @route   GET api/checkin/active
// @desc    Get all active check-ins for today
// @access  Private
router.get('/active', auth, getTodayCheckIns);

module.exports = router;
