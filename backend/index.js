require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { connectDB } = require('./config/db');
const { PythonShell } = require('python-shell');

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
// Prediction Route
// --------------------------------------------------
app.post('/api/predict', async (req, res) => {
  try {
    const stationData = req.body;

    // Save station data to a temporary file
    const tempFilePath = path.join(__dirname, 'temp_input.json');
    fs.writeFileSync(tempFilePath, JSON.stringify(stationData));

    // Run Python prediction script
    const options = {
      mode: 'text',
      pythonPath: 'python', // Use 'python' on Windows
      scriptPath: path.join(__dirname, 'model', 'predict.py'), // Correct path to predict.py
      args: [tempFilePath]
    };

    PythonShell.run('predict.py', options, (err, results) => {
      if (err) {
        console.error('Prediction error:', err);
        return res.status(500).json({ error: 'Prediction failed' });
      }

      // Clean up temporary file
      fs.unlinkSync(tempFilePath);

      const score = parseFloat(results[0]);
      res.json({ score });
    });
  } catch (error) {
    console.error('Request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

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