// backend/models/Station.js
const { pool } = require('../config/db');

const Station = {
  // ------------------------------------------------------
  // Create a station
  // ------------------------------------------------------
  async create(name, location, fuelTypesAvailable) {
    try {
      const [result] = await pool.execute(
        'INSERT INTO stations (name, location, fuel_types_available) VALUES (?, ?, ?)',
        [name, location, JSON.stringify(fuelTypesAvailable)]
      );
      return { id: result.insertId, name, location, fuelTypesAvailable };
    } catch (error) {
      throw error;
    }
  },

  // ------------------------------------------------------
  // Find station by ID
  // ------------------------------------------------------
  async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, name, location, fuel_types_available, last_updated, createdAt, updatedAt FROM stations WHERE id = ? LIMIT 1',
        [id]
      );
      if (rows[0]) {
        rows[0].fuel_types_available = JSON.parse(rows[0].fuel_types_available);
      }
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  },

  // ------------------------------------------------------
  // Find station by name
  // ------------------------------------------------------
  async findByName(name) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, name, location, fuel_types_available, last_updated, createdAt, updatedAt FROM stations WHERE name = ? LIMIT 1',
        [name]
      );
      if (rows[0]) {
        rows[0].fuel_types_available = JSON.parse(rows[0].fuel_types_available);
      }
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  },

  // ------------------------------------------------------
  // Get all stations
  // ------------------------------------------------------
  async findAll() {
    try {
      const [rows] = await pool.execute(
        'SELECT id, name, location, fuel_types_available, last_updated, createdAt, updatedAt FROM stations'
      );
      return rows.map(row => ({
        ...row,
        fuel_types_available: JSON.parse(row.fuel_types_available)
      }));
    } catch (error) {
      throw error;
    }
  },

  // ------------------------------------------------------
  // Update a station
  // ------------------------------------------------------
  async update(id, name, location, fuelTypesAvailable) {
    try {
      await pool.execute(
        'UPDATE stations SET name = ?, location = ?, fuel_types_available = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
        [name, location, JSON.stringify(fuelTypesAvailable), id]
      );
      return this.findById(id);
    } catch (error) {
      throw error;
    }
  },

  // ------------------------------------------------------
  // Delete a station
  // ------------------------------------------------------
  async delete(id) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM stations WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = Station;
