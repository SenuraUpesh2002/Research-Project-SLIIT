const connectDB = require('../config/db');

const Report = {
  async create(userId, stationId, reportType, description, status = 'pending') {
    const connection = await connectDB();
    try {
      const [result] = await connection.execute(
        'INSERT INTO reports (user_id, station_id, report_type, description, status) VALUES (?, ?, ?, ?, ?)',
        [userId, stationId, reportType, description, status]
      );
      return { id: result.insertId, userId, stationId, reportType, description, status };
    } finally {
      connection.end();
    }
  },

  async findById(id) {
    const connection = await connectDB();
    try {
      const [rows] = await connection.execute(
        'SELECT id, user_id, station_id, report_type, description, status, createdAt, updatedAt FROM reports WHERE id = ?',
        [id]
      );
      return rows[0];
    } finally {
      connection.end();
    }
  },

  async findByUserId(userId) {
    const connection = await connectDB();
    try {
      const [rows] = await connection.execute(
        'SELECT id, user_id, station_id, report_type, description, status, createdAt, updatedAt FROM reports WHERE user_id = ?',
        [userId]
      );
      return rows;
    } finally {
      connection.end();
    }
  },

  async findByStationId(stationId) {
    const connection = await connectDB();
    try {
      const [rows] = await connection.execute(
        'SELECT id, user_id, station_id, report_type, description, status, createdAt, updatedAt FROM reports WHERE station_id = ?',
        [stationId]
      );
      return rows;
    } finally {
      connection.end();
    }
  },

  async updateStatus(id, status) {
    const connection = await connectDB();
    try {
      await connection.execute(
        'UPDATE reports SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
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
        'DELETE FROM reports WHERE id = ?',
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
    } finally {
      connection.end();
    }
  },
};

module.exports = Report;
