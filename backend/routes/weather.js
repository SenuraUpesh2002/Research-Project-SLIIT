const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');
const authMiddleware = require('../middleware/authMiddleware');

// Get current weather (public - weather data is non-sensitive)
router.get('/current', weatherController.getCurrentWeather);

// Get weather forecast (public - weather data is non-sensitive)
router.get('/forecast/:date', weatherController.getForecast);

// Store historical weather (protected - admin only)
router.post('/historical', authMiddleware, weatherController.storeHistoricalWeather);

module.exports = router;
