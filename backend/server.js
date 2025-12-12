const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const winston = require('winston');
const db = require('./config/db');

dotenv.config();

// Logger Configuration
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'fuelwatch-backend' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

const app = express();

// Security Middleware
app.use(helmet()); // Security Headers

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use('/api', limiter); // Apply to all API routes

// Middleware
app.use(cors());
app.use(express.json());

// Request Logger Middleware
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

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
        logger.info('Database connected successfully');
        conn.release();
    })
    .catch(err => {
        logger.error('Database connection failed:', err);
    });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});

