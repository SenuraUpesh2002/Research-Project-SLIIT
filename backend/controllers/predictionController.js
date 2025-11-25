const axios = require('axios');

const ML_API_URL = process.env.ML_API_URL || 'http://localhost:5001';

exports.getDemandPrediction = async (req, res) => {
    try {
        // In a real app, you'd fetch historical data from DB here to send to ML model
        const payload = {
            date: new Date().toISOString().slice(0, 10),
            shift: 'morning',
            historical_data: [] // Placeholder
        };

        const response = await axios.post(`${ML_API_URL}/predict-demand`, payload);
        res.json(response.data);
    } catch (error) {
        console.error('ML Service Error:', error.message);
        // Fallback/Mock data if ML service is down
        res.json({
            predicted_demand: 1500,
            confidence: 0.85,
            is_fallback: true
        });
    }
};

exports.getStaffingRecommendation = async (req, res) => {
    try {
        const payload = {
            predicted_demand: 520, // This would come from the demand prediction
            day_of_week: new Date().getDay(),
            shift_type: 1
        };

        const response = await axios.post(`${ML_API_URL}/predict-staffing`, payload);
        res.json(response.data);
    } catch (error) {
        console.error('ML Service Error:', error.message);
        res.json({
            recommended_staff: 4,
            confidence: 'medium',
            is_fallback: true
        });
    }
};

// Get 7-day forecast (Mocked for now, or loop through ML calls)
exports.getForecast = async (req, res) => {
    try {
        // Mocking a 7-day forecast
        const forecast = [];
        const today = new Date();

        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            forecast.push({
                date: date.toISOString().slice(0, 10),
                demand: Math.floor(Math.random() * (2000 - 1200) + 1200), // Random between 1200-2000
                confidence: 0.8 + (Math.random() * 0.15)
            });
        }

        res.json(forecast);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
