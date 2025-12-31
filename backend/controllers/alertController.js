const { pool } = require('../config/db');

// GET all alerts
exports.getAllAlerts = async (req, res) => {
  try {
    const [alerts] = await pool.query(
      'SELECT * FROM alerts ORDER BY created_at DESC'
    );
    res.status(200).json(alerts);
  } catch (error) {
    console.error('❌ Error fetching alerts:', error);
    res.status(500).json({
      message: 'Failed to fetch alerts',
      error: error.message,
    });
  }
};

// CREATE alert
exports.createAlert = async (req, res) => {
  const { message, type } = req.body;

  if (!message || !type) {
    return res.status(400).json({ message: 'Message and type are required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO alerts (message, type) VALUES (?, ?)',
      [message, type]
    );

    const [rows] = await pool.query(
      'SELECT * FROM alerts WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('❌ Error creating alert:', error);
    res.status(500).json({
      message: 'Failed to create alert',
      error: error.message,
    });
  }
};

// DELETE alert
exports.deleteAlert = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM alerts WHERE id = ?', [id]);
    res.status(200).json({ message: 'Alert deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting alert:', error);
    res.status(500).json({
      message: 'Failed to delete alert',
      error: error.message,
    });
  }
};

// SSE stream (safe version)
exports.alertStream = (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  res.write(
    `data: ${JSON.stringify({ message: 'Connected to alert stream' })}\n\n`
  );

  req.on('close', () => {
    res.end();
  });
};
