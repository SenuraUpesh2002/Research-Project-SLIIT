// backend/models/Report.js
const { pool } = require('../config/db');

const Report = {
  async create(userId, stationId, reportType, description, status = 'pending') {
    try {
      const [result] = await pool.execute(
        'INSERT INTO reports (user_id, station_id, report_type, description, status) VALUES (?, ?, ?, ?, ?)',
        [userId, stationId, reportType, description, status]
      );
      return { id: result.insertId, userId, stationId, reportType, description, status };
    } catch (error) {
      throw error;
    }
  },

  async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, user_id, station_id, report_type, description, status, createdAt, updatedAt FROM reports WHERE id = ? LIMIT 1',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  },

  async findByUserId(userId) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, user_id, station_id, report_type, description, status, createdAt, updatedAt FROM reports WHERE user_id = ?',
        [userId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async findByStationId(stationId) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, user_id, station_id, report_type, description, status, createdAt, updatedAt FROM reports WHERE station_id = ?',
        [stationId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async updateStatus(id, status) {
    try {
      await pool.execute(
        'UPDATE reports SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
        [status, id]
      );
      return this.findById(id);
    } catch (error) {
      throw error;
    }
  },

  async delete(id) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM reports WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  },

  async findAll() {
    try {
      const [rows] = await pool.execute(
        `SELECT
          r.id, r.report_type, r.description, r.status, r.createdAt, r.updatedAt,
          u.id AS user_id, u.name AS user_name, u.email AS user_email,
          st.id AS station_id, st.name AS station_name, st.location AS station_location
        FROM reports r
        JOIN users u ON r.user_id = u.id
        JOIN stations st ON r.station_id = st.id`
      );
      return rows.map(row => ({
        id: row.id,
        reportType: row.report_type,
        description: row.description,
        status: row.status,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        user: {
          id: row.user_id,
          name: row.user_name,
          email: row.user_email,
        },
        station: {
          id: row.station_id,
          name: row.station_name,
          location: row.station_location,
        },
      }));
    } catch (error) {
      throw error;
    }
  },
};

module.exports = Report;
