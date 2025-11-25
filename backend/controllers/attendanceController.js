const Attendance = require('../models/Attendance');
const moment = require('moment');

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

// Check in employee
exports.checkIn = async (req, res) => {
  try {
    const { employee_email, location_lat, location_lng, device_id } = req.body;

    // Validation
    if (!employee_email || !location_lat || !location_lng || !device_id) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    // Check if already checked in
    const lastCheckIn = await Attendance.getLastCheckIn(employee_email);
    if (lastCheckIn && !lastCheckIn.check_out_time) {
      return res.status(400).json({
        success: false,
        error: 'Employee is already checked in'
      });
    }

    // Validate location
    const stationLat = parseFloat(process.env.DEFAULT_STATION_LAT);
    const stationLng = parseFloat(process.env.DEFAULT_STATION_LNG);
    const maxDistance = parseInt(process.env.LOCATION_RADIUS_METERS);

    const distance = calculateDistance(
      location_lat, location_lng,
      stationLat, stationLng
    );

    const location_verified = distance <= maxDistance;

    // Validate device (check if device_id matches last check-in)
    let device_verified = true;
    if (lastCheckIn && lastCheckIn.device_id) {
      device_verified = lastCheckIn.device_id === device_id;
    }

    // Save check-in
    const result = await Attendance.checkIn({
      employee_email,
      location_lat,
      location_lng,
      device_id,
      location_verified,
      device_verified
    });

    res.json({
      success: true,
      data: {
        id: result.insertId,
        employee_email,
        check_in_time: new Date(),
        location_verified,
        device_verified,
        distance: Math.round(distance)
      },
      message: 'Check-in successful'
    });
  } catch (error) {
    console.error('Error checking in:', error);
    res.status(500).json({
      success: false,
      error: 'Check-in failed'
    });
  }
};

// Check out employee
exports.checkOut = async (req, res) => {
  try {
    const { employee_email } = req.body;

    if (!employee_email) {
      return res.status(400).json({
        success: false,
        error: 'Employee email is required'
      });
    }

    // Check if employee is checked in
    const lastCheckIn = await Attendance.getLastCheckIn(employee_email);
    if (!lastCheckIn || lastCheckIn.check_out_time) {
      return res.status(400).json({
        success: false,
        error: 'Employee is not checked in'
      });
    }

    await Attendance.checkOut(employee_email);

    res.json({
      success: true,
      message: 'Check-out successful'
    });
  } catch (error) {
    console.error('Error checking out:', error);
    res.status(500).json({
      success: false,
      error: 'Check-out failed'
    });
  }
};

// Get currently checked in employees
exports.getCurrentlyCheckedIn = async (req, res) => {
  try {
    const employees = await Attendance.getCurrentlyCheckedIn();

    res.json({
      success: true,
      data: employees
    });
  } catch (error) {
    console.error('Error fetching checked-in employees:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch checked-in employees'
    });
  }
};

// Get attendance by date range
exports.getAttendanceByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Start date and end date are required'
      });
    }

    const attendance = await Attendance.getByDateRange(startDate, endDate);

    res.json({
      success: true,
      data: attendance
    });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch attendance'
    });
  }
};

// Get attendance statistics
exports.getStatistics = async (req, res) => {
  try {
    const date = req.query.date || moment().format('YYYY-MM-DD');

    const stats = await Attendance.getStatistics(date);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    });
  }
};
// Get weekly breakdown
exports.getWeeklyBreakdown = async (req, res) => {
  try {
    const { start, end } = req.query; // Changed from startDate/endDate to match API call

    if (!start || !end) {
      return res.status(400).json({
        success: false,
        error: 'Start date and end date are required'
      });
    }

    const breakdown = await Attendance.getWeeklyBreakdown(start, end);

    res.json({
      success: true,
      data: breakdown
    });
  } catch (error) {
    console.error('Error fetching weekly breakdown:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch weekly breakdown'
    });
  }
};
