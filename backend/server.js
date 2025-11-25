const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
require('dotenv').config();

const db = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const fuelStockRoutes = require('./routes/fuelStockRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const predictionRoutes = require('./routes/predictionRoutes');

// Initialize express app
const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'FuelWatch API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/fuel-stocks', fuelStockRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/predictions', predictionRoutes);

// 404 handler for all unmatched routes
// -----------------------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found`,
    available_endpoints: [
      'GET /api/health',
      'GET /api/fuel-stocks',
      'GET /api/fuel-stocks/latest',
      'GET /api/fuel-stocks/history',
      'POST /api/fuel-stocks/reading',
      'GET /api/fuel-stocks/tanks',
      'POST /api/employees/login',
      'GET /api/employees',
      'GET /api/employees/:email',
      'POST /api/employees',
      'PUT /api/employees/:email',
      'DELETE /api/employees/:email',
      'POST /api/attendance/check-in',
      'POST /api/attendance/check-out',
      'GET /api/attendance/active',
      'GET /api/attendance',
      'GET /api/attendance/statistics',
      'GET /api/predictions/demand',
      'GET /api/predictions/refill'
    ]
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
  console.log('========================================');
  console.log(`🚀 FuelWatch Backend Server`);
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log('========================================');

  try {
    // Parent table first
    const Registration = require('./models/Registration');
    await Registration.createTable();
    console.log('✅ Registration table checked/created');

    // Then Attendance table
    const Attendance = require('./models/Attendance');
    await Attendance.createTable();
    console.log('✅ Attendance table checked/created');
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
  }
});


// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

module.exports = app;
