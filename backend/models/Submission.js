// backend/models/Submission.js
const { pool } = require('../config/db');

const Submission = {
  async create(submissionData) {
    try {
      const { user_id, station_id, submission_type, data } = submissionData;
      const [result] = await pool.execute(
        'INSERT INTO submissions (user_id, station_id, submission_type, data, createdAt, updatedAt) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
        [user_id, station_id, submission_type, JSON.stringify(data)]
      );
      return { id: result.insertId, user_id, station_id, submission_type, data };
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
      if (rows[0]) {
        rows[0].data = JSON.parse(rows[0].data);
      }
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
          s.id, 
          s.user_id, 
          u.name AS user_name, 
          s.station_id, 
          st.name AS station_name, 
          s.submission_type, 
          s.data, 
          s.createdAt, 
          s.updatedAt 
         FROM submissions s
         LEFT JOIN users u ON s.user_id = u.id
         LEFT JOIN stations st ON s.station_id = st.id`
      );
      return rows.map(row => ({
        id: row.id,
        user_id: row.user_id,
        user_name: row.user_name,
        station_id: row.station_id,
        station_name: row.station_name,
        submission_type: row.submission_type,
        data: JSON.parse(row.data),
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      }));
    } catch (error) {
      throw error;
    }
  },
};

module.exports = Submission;
