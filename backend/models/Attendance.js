const db = require('../config/database');

class Attendance {
  // Note: We need to create attendance table first
  // This is based on your requirements, not in the SQL dump

  static async createTable() {
    await db.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id INT PRIMARY KEY AUTO_INCREMENT,
        employee_email VARCHAR(100) NOT NULL,
        check_in_time DATETIME NOT NULL,
        check_out_time DATETIME DEFAULT NULL,
        location_lat DECIMAL(10, 8),
        location_lng DECIMAL(11, 8),
        device_id VARCHAR(255),
        location_verified BOOLEAN DEFAULT FALSE,
        device_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (employee_email) REFERENCES registration(email) ON DELETE CASCADE
      )
    `);
  }

  // Check in employee
  static async checkIn(checkInData) {
    const { employee_email, location_lat, location_lng, device_id, location_verified, device_verified } = checkInData;

    const [result] = await db.query(
      `INSERT INTO attendance 
       (employee_email, check_in_time, location_lat, location_lng, device_id, location_verified, device_verified)
       VALUES (?, NOW(), ?, ?, ?, ?, ?)`,
      [employee_email, location_lat, location_lng, device_id, location_verified, device_verified]
    );

    return result;
  }

  // Check out employee
  static async checkOut(employee_email) {
    const [result] = await db.query(
      `UPDATE attendance 
       SET check_out_time = NOW() 
       WHERE employee_email = ? 
       AND check_out_time IS NULL
       ORDER BY check_in_time DESC 
       LIMIT 1`,
      [employee_email]
    );

    return result;
  }

  // Get currently checked in employees
  static async getCurrentlyCheckedIn() {
    const [rows] = await db.query(
      `SELECT 
        a.id,
        a.employee_email,
        r.role,
        a.check_in_time,
        a.location_verified,
        a.device_verified,
        TIMESTAMPDIFF(HOUR, a.check_in_time, NOW()) as hours_worked
      FROM attendance a
      JOIN employees r ON a.employee_email = r.email
      WHERE a.check_out_time IS NULL
      ORDER BY a.check_in_time DESC`
    );

    return rows;
  }

  // Get attendance by date range
  static async getByDateRange(startDate, endDate) {
    const [rows] = await db.query(
      `SELECT 
        a.id,
        a.employee_email,
        r.role,
        a.check_in_time,
        a.check_out_time,
        a.location_verified,
        a.device_verified,
        TIMESTAMPDIFF(HOUR, a.check_in_time, COALESCE(a.check_out_time, NOW())) as hours_worked,
        CASE 
          WHEN TIME(a.check_in_time) <= '09:00:00' THEN 'On-Time'
          ELSE 'Late'
        END as status
      FROM attendance a
      JOIN employees r ON a.employee_email = r.email
      WHERE DATE(a.check_in_time) BETWEEN ? AND ?
      ORDER BY a.check_in_time DESC`,
      [startDate, endDate]
    );

    return rows;
  }

  // Get employee's last check-in
  static async getLastCheckIn(employee_email) {
    const [rows] = await db.query(
      `SELECT * FROM attendance 
       WHERE employee_email = ? 
       ORDER BY check_in_time DESC 
       LIMIT 1`,
      [employee_email]
    );

    return rows[0];
  }

  // Get attendance statistics
  static async getStatistics(date) {
    const [rows] = await db.query(
      `SELECT 
        COUNT(DISTINCT employee_email) as total_checked_in,
        COUNT(CASE WHEN TIME(check_in_time) <= '09:00:00' THEN 1 END) as on_time_count,
        COUNT(CASE WHEN TIME(check_in_time) > '09:00:00' THEN 1 END) as late_count,
        AVG(TIMESTAMPDIFF(HOUR, check_in_time, COALESCE(check_out_time, NOW()))) as avg_hours
      FROM attendance
      WHERE DATE(check_in_time) = ?`,
      [date]
    );

    return rows[0];
  }
  // Get weekly attendance breakdown
  static async getWeeklyBreakdown(startDate, endDate) {
    const [rows] = await db.query(
      `SELECT 
        DATE(check_in_time) as date,
        COUNT(CASE WHEN TIME(check_in_time) <= '09:00:00' THEN 1 END) as on_time,
        COUNT(CASE WHEN TIME(check_in_time) > '09:00:00' THEN 1 END) as late
      FROM attendance
      WHERE DATE(check_in_time) BETWEEN ? AND ?
      GROUP BY DATE(check_in_time)
      ORDER BY date ASC`,
      [startDate, endDate]
    );

    return rows;
  }
}

module.exports = Attendance;
