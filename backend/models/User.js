const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');

const User = {
  // ------------------------------------------------------
  // Create User
  // ------------------------------------------------------
  async create(name, email, password, role = 'user') {
    if (!name || !email || !password) {
      throw new Error("Name, email, and password are required");
    }

    // Fallback safety check
    const safeRole = role || 'user';

    const hashedPassword = await bcrypt.hash(password, 10);
    const connection = await connectDB();

    try {
      const [result] = await connection.execute(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, safeRole]
      );

      return {
        id: result.insertId,
        name,
        email,
        role: safeRole
      };
    } finally {
      connection.end();
    }
  },

  // ------------------------------------------------------
  // Find user by email
  // ------------------------------------------------------
  async findByEmail(email) {
    if (!email) return null;

    const connection = await connectDB();

    try {
      const [rows] = await connection.execute(
        'SELECT id, name, email, password, role FROM users WHERE email = ?',
        [email]
      );
      return rows[0] || null;
    } finally {
      connection.end();
    }
  },

  // ------------------------------------------------------
  // Find user by id
  // ------------------------------------------------------
  async findById(id) {
    if (!id) return null;

    const connection = await connectDB();

    try {
      const [rows] = await connection.execute(
        'SELECT id, name, email, password, role FROM users WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } finally {
      connection.end();
    }
  },

  // ------------------------------------------------------
  // Compare passwords
  // ------------------------------------------------------
  async comparePassword(enteredPassword, hashedPassword) {
    if (!enteredPassword || !hashedPassword) return false;
    return await bcrypt.compare(enteredPassword, hashedPassword);
  },
};

module.exports = User;
