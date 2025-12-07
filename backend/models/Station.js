const connectDB = require('../config/db');

const Station = {
  async create(name, location, fuelTypesAvailable) {
    const connection = await connectDB();
    try {
      const [result] = await connection.execute(
        'INSERT INTO stations (name, location, fuel_types_available) VALUES (?, ?, ?)',
        [name, location, JSON.stringify(fuelTypesAvailable)]
      );
      return { id: result.insertId, name, location, fuelTypesAvailable };
    } finally {
      connection.end();
    }
  },

  async findById(id) {
    const connection = await connectDB();
    try {
      const [rows] = await connection.execute(
        'SELECT id, name, location, fuel_types_available, last_updated, createdAt, updatedAt FROM stations WHERE id = ?',
        [id]
      );
      if (rows[0]) {
        rows[0].fuel_types_available = JSON.parse(rows[0].fuel_types_available);
      }
      return rows[0];
    } finally {
      connection.end();
    }
  },

  async findByName(name) {
    const connection = await connectDB();
    try {
      const [rows] = await connection.execute(
        'SELECT id, name, location, fuel_types_available, last_updated, createdAt, updatedAt FROM stations WHERE name = ?',
        [name]
      );
      if (rows[0]) {
        rows[0].fuel_types_available = JSON.parse(rows[0].fuel_types_available);
      }
      return rows[0];
    } finally {
      connection.end();
    }
  },

  async findAll() {
    const connection = await connectDB();
    try {
      const [rows] = await connection.execute(
        'SELECT id, name, location, fuel_types_available, last_updated, createdAt, updatedAt FROM stations'
      );
      return rows.map(row => ({ ...row, fuel_types_available: JSON.parse(row.fuel_types_available) }));
    } finally {
      connection.end();
    }
  },

  async update(id, name, location, fuelTypesAvailable) {
    const connection = await connectDB();
    try {
      await connection.execute(
        'UPDATE stations SET name = ?, location = ?, fuel_types_available = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
        [name, location, JSON.stringify(fuelTypesAvailable), id]
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
        'DELETE FROM stations WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } finally {
      connection.end();
    }
  },
};

module.exports = Station;
