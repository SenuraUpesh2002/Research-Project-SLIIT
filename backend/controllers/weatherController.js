const axios = require('axios');

const ML_API_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:5001';
const SAFE_ML_API_URL = ML_API_URL.replace(':5000', ':5001');

// Get current weather
exports.getCurrentWeather = async (req, res) => {
    try {
        const response = await axios.get(`${SAFE_ML_API_URL}/weather/current`);
        res.json(response.data);
    } catch (error) {
        console.error('Weather Service Error:', error.message);
        // Fallback mock response in case ML service is down
        res.json({
            temperature: 30.0,
            condition: 'Sunny (Fallback)',
            humidity: 70,
            is_fallback: true
        });
    }
};

// Get weather forecast for a specific date
exports.getForecast = async (req, res) => {
    try {
        const { date } = req.params;
        const response = await axios.get(`${SAFE_ML_API_URL}/weather/forecast`, {
            params: { date }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Forecast Service Error:', error.message);
        res.status(500).json({
            message: 'Error fetching forecast',
            is_fallback: true
        });
    }
};

// Store historical weather (called by scheduler or admin)
exports.storeHistoricalWeather = async (req, res) => {
    try {
        const response = await axios.post(`${SAFE_ML_API_URL}/weather/historical`, req.body);
        res.json(response.data);
    } catch (error) {
        console.error('Error storing historical weather:', error.message);
        res.status(500).json({ message: 'Error storing weather data' });
    }
};
