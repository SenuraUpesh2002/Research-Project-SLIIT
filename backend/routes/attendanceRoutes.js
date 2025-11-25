const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// POST /api/attendance/check-in - Check in employee
router.post('/check-in', attendanceController.checkIn);

// POST /api/attendance/check-out - Check out employee
router.post('/check-out', attendanceController.checkOut);

// GET /api/attendance/active - Get currently checked-in employees
router.get('/active', attendanceController.getCurrentlyCheckedIn);

// GET /api/attendance - Get attendance by date range
router.get('/', attendanceController.getAttendanceByDateRange);

// GET /api/attendance/statistics - Get attendance statistics
router.get('/statistics', attendanceController.getStatistics);

// GET /api/attendance/weekly - Get weekly breakdown
router.get('/weekly', attendanceController.getWeeklyBreakdown);


module.exports = router;
