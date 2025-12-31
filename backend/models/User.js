const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');

const User = {
  // ------------------------------------------------------
  // Create User
  // ------------------------------------------------------
  async create(name, email, password, role = 'user') {
    if (!name || !email || !password) {
      throw new Error('Name, email, and password are required');
    }

    const safeRole = role || 'user';
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, safeRole]
    );

    return {
      id: result.insertId,
      name,
      email,
      role: safeRole,
    };
  },

  // ------------------------------------------------------
  // Find user by email
  // ------------------------------------------------------
  async findByEmail(email) {
    if (!email) return null;

    const [rows] = await pool.execute(
      'SELECT id, name, email, password, role FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    return rows[0] || null;
  },

  // ------------------------------------------------------
  // Find user by id
  // ------------------------------------------------------
  async findById(id) {
    if (!id) return null;

    const [rows] = await pool.execute(
      'SELECT id, name, email, role FROM users WHERE id = ? LIMIT 1',
      [id]
    );

    return rows[0] || null;
  },

  // ------------------------------------------------------
  // Compare passwords
  // ------------------------------------------------------
  async comparePassword(enteredPassword, hashedPassword) {
    if (!enteredPassword || !hashedPassword) return false;
    return bcrypt.compare(enteredPassword, hashedPassword);
  },
};

module.exports = User;
