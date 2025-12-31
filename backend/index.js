require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');

// --------------------------------------------------
// Initialize App
// --------------------------------------------------
const app = express();

// --------------------------------------------------
// Connect Database (ONLY ONCE)
// --------------------------------------------------
connectDB();

// --------------------------------------------------
// Middlewares
// --------------------------------------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --------------------------------------------------
// Routes
// --------------------------------------------------
const authRoutes = require('./routes/authRoutes');
const reportRoutes = require('./routes/reportRoutes');
const stationRoutes = require('./routes/stationRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const alertRoutes = require('./routes/alertRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/stations', stationRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/alerts', alertRoutes);

// --------------------------------------------------
// Root Route
// --------------------------------------------------
app.get('/', (req, res) => {
  res.status(200).json({ message: 'API is running...' });
});

// --------------------------------------------------
// 404 Handler (IMPORTANT)
// --------------------------------------------------
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// --------------------------------------------------
// Global Error Handler
// --------------------------------------------------
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

// --------------------------------------------------
// Start Server
// --------------------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
