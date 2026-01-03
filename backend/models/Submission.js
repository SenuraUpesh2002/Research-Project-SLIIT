// backend/models/Submission.js
const { pool } = require('../config/db');

const Submission = {
  async create(userId, stationId, submissionType, data, status = 'pending') {
    try {
      const [result] = await pool.execute(
        'INSERT INTO submissions (user_id, station_id, submission_type, data, status) VALUES (?, ?, ?, ?, ?)',
        [userId, stationId, submissionType, JSON.stringify(data), status]
      );
      return { id: result.insertId, userId, stationId, submissionType, data, status };
    } catch (error) {
      throw error;
    }
  },

  async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, user_id, station_id, submission_type, data, status, createdAt, updatedAt FROM submissions WHERE id = ? LIMIT 1',
        [id]
      );
      if (rows[0]) rows[0].data = JSON.parse(rows[0].data);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  },

  async findByUserId(userId) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, user_id, station_id, submission_type, data, status, createdAt, updatedAt FROM submissions WHERE user_id = ?',
        [userId]
      );
      return rows.map(row => ({ ...row, data: JSON.parse(row.data) }));
    } catch (error) {
      throw error;
    }
  },

  async findByStationId(stationId) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, user_id, station_id, submission_type, data, status, createdAt, updatedAt FROM submissions WHERE station_id = ?',
        [stationId]
      );
      return rows.map(row => ({ ...row, data: JSON.parse(row.data) }));
    } catch (error) {
      throw error;
    }
  },

  async updateStatus(id, status) {
    try {
      await pool.execute(
        'UPDATE submissions SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
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
        'DELETE FROM submissions WHERE id = ?',
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
          s.id, s.submission_type, s.data, s.status, s.createdAt, s.updatedAt,
          u.id AS user_id, u.name AS user_name, u.email AS user_email,
          st.id AS station_id, st.name AS station_name, st.location AS station_location
        FROM submissions s
        JOIN users u ON s.user_id = u.id
        JOIN stations st ON s.station_id = st.id`
      );
      return rows.map(row => ({
        id: row.id,
        submissionType: row.submission_type,
        data: JSON.parse(row.data),
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

module.exports = Submission;
