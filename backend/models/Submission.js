const connectDB = require('../config/db');

const Submission = {
  async create(userId, stationId, submissionType, data, status = 'pending') {
    const connection = await connectDB();
    try {
      const [result] = await connection.execute(
        'INSERT INTO submissions (user_id, station_id, submission_type, data, status) VALUES (?, ?, ?, ?, ?)',
        [userId, stationId, submissionType, JSON.stringify(data), status]
      );
      return { id: result.insertId, userId, stationId, submissionType, data, status };
    } finally {
      connection.end();
    }
  },

  async findById(id) {
    const connection = await connectDB();
    try {
      const [rows] = await connection.execute(
        'SELECT id, user_id, station_id, submission_type, data, status, createdAt, updatedAt FROM submissions WHERE id = ?',
        [id]
      );
      if (rows[0]) {
        rows[0].data = JSON.parse(rows[0].data);
      }
      return rows[0];
    } finally {
      connection.end();
    }
  },

  async findByUserId(userId) {
    const connection = await connectDB();
    try {
      const [rows] = await connection.execute(
        'SELECT id, user_id, station_id, submission_type, data, status, createdAt, updatedAt FROM submissions WHERE user_id = ?',
        [userId]
      );
      return rows.map(row => ({ ...row, data: JSON.parse(row.data) }));
    } finally {
      connection.end();
    }
  },

  async findByStationId(stationId) {
    const connection = await connectDB();
    try {
      const [rows] = await connection.execute(
        'SELECT id, user_id, station_id, submission_type, data, status, createdAt, updatedAt FROM submissions WHERE station_id = ?',
        [stationId]
      );
      return rows.map(row => ({ ...row, data: JSON.parse(row.data) }));
    } finally {
      connection.end();
    }
  },

  async updateStatus(id, status) {
    const connection = await connectDB();
    try {
      await connection.execute(
        'UPDATE submissions SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
        [status, id]
      );
      return this.findById(id);
    } finally {
      connection.end();
    }
  },

  async delete(id) {
    const connection = await connectDB();
    try {
      const [result] = await connection.execute(
        'DELETE FROM submissions WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } finally {
      connection.end();
    }
  },

  async findAll() {
    const connection = await connectDB();
    try {
      const [rows] = await connection.execute(
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
    } finally {
      connection.end();
    }
  },
};

module.exports = Submission;
