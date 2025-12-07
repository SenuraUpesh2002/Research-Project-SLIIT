const express = require('express');
const router = express.Router();
const holidayController = require('../controllers/holidayController');
const authMiddleware = require('../middleware/authMiddleware');

// Get upcoming holidays
router.get('/upcoming', authMiddleware, holidayController.getUpcomingHolidays);

// Check if date is holiday
router.get('/check/:date', authMiddleware, holidayController.checkHoliday);

// Add new holiday
router.post('/add', authMiddleware, holidayController.addHoliday);

module.exports = router;
