const db = require('../config/database');

class FuelStock {
  // Get all fuel stocks by station
  static async getByStation(stationId) {
    const [rows] = await db.query(
      `SELECT 
        fi.id,
        fi.stationId,
        fi.fuel_type,
        fi.tank_index,
        fi.tank_capacity,
        COALESCE(j.reading, 0) as current_level,
        j.reading_time as last_updated,
        ROUND((COALESCE(j.reading, 0) / fi.tank_capacity) * 100, 2) as fill_percentage
      FROM fs_fuel_information fi
      LEFT JOIN (
        SELECT reading, reading_time 
        FROM jsnsr04t 
        ORDER BY reading_time DESC 
        LIMIT 1
      ) j ON 1=1
      WHERE fi.stationId = ?
      ORDER BY fi.fuel_type, fi.tank_index`,
      [stationId]
    );
    return rows;
  }

  // Get latest sensor reading
  static async getLatestReading() {
    const [rows] = await db.query(
      `SELECT * FROM jsnsr04t 
       ORDER BY reading_time DESC 
       LIMIT 1`
    );
    return rows[0];
  }

  // Get sensor readings for last N hours
  static async getReadingHistory(hours = 24) {
    const [rows] = await db.query(
      `SELECT 
        id,
        reading,
        reading_time,
        DATE_FORMAT(reading_time, '%H:%i') as time_label
      FROM jsnsr04t
      WHERE reading_time >= DATE_SUB(NOW(), INTERVAL ? HOUR)
      ORDER BY reading_time ASC`,
      [hours]
    );
    return rows;
  }

  // Save new sensor reading
  static async saveReading(reading) {
    const [result] = await db.query(
      'INSERT INTO jsnsr04t (reading) VALUES (?)',
      [reading]
    );
    return result;
  }

  // Get tank information by station
  static async getTankInfo(stationId) {
    const [rows] = await db.query(
      `SELECT 
        fuel_type,
        COUNT(*) as number_of_tanks,
        SUM(tank_capacity) as total_capacity
      FROM fs_fuel_information
      WHERE stationId = ?
      GROUP BY fuel_type`,
      [stationId]
    );
    return rows;
  }

  // Get station general info
  static async getStationInfo(stationId) {
    const [rows] = await db.query(
      `SELECT * FROM fs_general_information WHERE Id = ?`,
      [stationId]
    );
    return rows[0];
  }
}

module.exports = FuelStock;
