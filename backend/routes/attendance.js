const express = require('express');
const router = express.Router();
const { checkIn, checkOut, getMyAttendance } = require('../controllers/attendanceController');
const auth = require('../middleware/authMiddleware');

router.post('/checkin', auth, checkIn);
router.post('/checkout', auth, checkOut);
router.get('/my-attendance', auth, getMyAttendance);

module.exports = router;
