const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { pool } = require('../config/db'); // Import pool
const User = require('../models/User');

// GET all users (admin only)
router.get('/users', protect, admin, async (req, res) => {
  let connection; // Declare connection outside try block
  try {
    connection = await pool.getConnection(); // Get connection from pool
    const [rows] = await connection.execute(
      'SELECT id, name, email, role, "active" as status FROM users'
    );
    connection.release(); // Release connection
    res.json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  } finally {
    if (connection) connection.release(); // Ensure connection is released even if error occurs
  }
});

module.exports = router;
