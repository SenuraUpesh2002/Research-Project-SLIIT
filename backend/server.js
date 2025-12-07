const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/employees', require('./routes/employee'));
app.use('/api/qr', require('./routes/qr'));
app.use('/api/checkin', require('./routes/checkin'));
app.use('/api/fuel', require('./routes/fuelStock'));
app.use('/api/predictions', require('./routes/prediction'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/weather', require('./routes/weather'));
app.use('/api/holidays', require('./routes/holidays'));
app.use('/api/busy-times', require('./routes/busyTimes'));

// Test DB Connection
db.getConnection()
    .then(conn => {
        console.log('Database connected successfully');
        conn.release();
    })
    .catch(err => {
        console.error('Database connection failed:', err);
    });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
