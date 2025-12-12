const express = require('express');
const router = express.Router();
const { checkIn, checkOut, getMyAttendance, getActiveAttendance } = require('../controllers/attendanceController');
const auth = require('../middleware/authMiddleware');

router.post('/checkin', auth, checkIn);
router.post('/checkout', auth, checkOut);
router.get('/my-attendance', auth, getMyAttendance);
router.get('/active', auth, getActiveAttendance);

module.exports = router;
