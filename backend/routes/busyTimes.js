const express = require('express');
const router = express.Router();
const busyTimeController = require('../controllers/busyTimeController');
const authMiddleware = require('../middleware/authMiddleware');

// Get busy time patterns
router.get('/patterns', authMiddleware, busyTimeController.getBusyPatterns);

// Analyze busy times
router.post('/analyze', authMiddleware, busyTimeController.analyzeBusyTimes);

module.exports = router;
