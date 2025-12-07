const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');

const User = {
  async create(name, email, password, role = 'user') {
    const hashedPassword = await bcrypt.hash(password, 10);
    const connection = await connectDB();
    try {
      const [result] = await connection.execute(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, role]
      );
      return { id: result.insertId, name, email, role };
    } finally {
      connection.end();
    }
  },

  async findByEmail(email) {
    const connection = await connectDB();
    try {
      const [rows] = await connection.execute(
        'SELECT id, name, email, password, role FROM users WHERE email = ?',
        [email]
      );
      return rows[0];
    } finally {
      connection.end();
    }
  },

  async findById(id) {
    const connection = await connectDB();
    try {
      const [rows] = await connection.execute(
        'SELECT id, name, email, password, role FROM users WHERE id = ?',
        [id]
      );
      return rows[0];
    } finally {
      connection.end();
    }
  },

  async comparePassword(enteredPassword, hashedPassword) {
    return await bcrypt.compare(enteredPassword, hashedPassword);
  },
};

module.exports = User;