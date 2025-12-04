require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

connectDB();

const app = express();

// Routes
const authRoutes = require('./routes/authRoutes');
const reportRoutes = require('./routes/reportRoutes');
const stationRoutes = require('./routes/stationRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/stations', stationRoutes);
app.use('/api/submissions', submissionRoutes);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
