const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const User = require('../models/User');

// GET all users (admin only)
router.get('/users', protect, admin, async (req, res) => {
  try {
    const connection = await require('../config/db')();
    const [rows] = await connection.execute(
      'SELECT id, name, email, role, "active" as status FROM users'
    );
    connection.end();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

module.exports = router;
