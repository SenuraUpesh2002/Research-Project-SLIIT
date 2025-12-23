const axios = require('axios');

const ML_API_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:5001';

// Force port 5001 if it's set to 5000 (common misconfiguration with AirPlay)
const SAFE_ML_API_URL = ML_API_URL.replace(':5000', ':5001');

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

// Helper to get weather description from WMO code
const getWeatherDescription = (code) => {
    if (code === 0) return { desc: 'Clear sky', impact: 'high' };
    if (code >= 1 && code <= 3) return { desc: 'Partly cloudy', impact: 'normal' };
    if (code >= 45 && code <= 48) return { desc: 'Foggy', impact: 'low' };
    if (code >= 51 && code <= 67) return { desc: 'Rainy', impact: 'low' };
    if (code >= 71 && code <= 77) return { desc: 'Snowy', impact: 'low' };
    if (code >= 80 && code <= 82) return { desc: 'Heavy Rain', impact: 'very_low' };
    if (code >= 95) return { desc: 'Thunderstorm', impact: 'very_low' };
    return { desc: 'Normal', impact: 'normal' };
};

exports.getStaffingRecommendation = async (req, res) => {
    try {
        // Get date and shift from request, default to tomorrow morning if not provided
        const date = req.body.date || new Date(Date.now() + 86400000).toISOString().split('T')[0];
        const shift = req.body.shift || 'morning';

        console.log(`[Prediction] Generating insights for Date=${date}, Shift=${shift}, InputDemand=${req.body.predicted_demand}`);

        let predictedDemand = 0;
        let breakdown = {};

        // 1. Get Total Station Demand
        // Prioritize usage of the demand passed from the frontend (which matches the chart)
        // to ensure consistency between the Forecast Chart and Staffing Recommendation.
        if (req.body.predicted_demand) {
            predictedDemand = req.body.predicted_demand;
            // Optionally still fetch random variation or breakdown if needed, but demand is fixed
            // For now, let's trust the frontend's figure as the "Scenario" we are solving for.
        } else {
            // If not provided (e.g. standalone API call), calculate it.
            try {
                const demandResponse = await axios.post(`${SAFE_ML_API_URL}/predict-station-demand`, {
                    date: date,
                    shift: shift,
                    station_id: 'Station_A'
                });

                if (demandResponse.data && demandResponse.data.total_predicted_demand) {
                    predictedDemand = demandResponse.data.total_predicted_demand;
                    breakdown = demandResponse.data.breakdown;
                }
            } catch (mlError) {
                console.error('Error fetching station demand from ML service:', mlError.message);
                predictedDemand = 6000; // Default fallback
            }
        }

        // 2. Get Staffing Recommendation using Total Demand
        const response = await axios.post(`${SAFE_ML_API_URL}/predict-staffing`, {
            predicted_demand: predictedDemand,
            date: date,
            shift: shift
        });

        // 3. Generate Dynamic Insights (Weather + Context + Traffic + ML)
        const insights = [];

        // A. Weather Insight (Open-Meteo API)
        try {
            const lat = process.env.DEFAULT_STATION_LAT || 7.2083;
            const lng = process.env.DEFAULT_STATION_LNG || 79.8358;

            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=weathercode,temperature_2m_max,precipitation_sum&timezone=auto&start_date=${date}&end_date=${date}`;

            const weatherRes = await axios.get(weatherUrl);
            if (weatherRes.data.daily && weatherRes.data.daily.weathercode) {
                const code = weatherRes.data.daily.weathercode[0];
                const temp = weatherRes.data.daily.temperature_2m_max[0];
                const weather = getWeatherDescription(code);

                if (weather.impact === 'high') {
                    insights.push(`☀ Real-time Weather: Clear skies (${temp}°C)`);
                    insights.push('📈 Impact: +5% customer traffic expected');
                } else if (weather.impact === 'low' || weather.impact === 'very_low') {
                    insights.push(`🌧 Real-time Weather: ${weather.desc} (${temp}°C)`);
                    insights.push('📉 Impact: -10% traffic expected');
                } else {
                    insights.push(`☁ Weather: ${weather.desc}, ${temp}°C`);
                }
            }
        } catch (weatherError) {
            console.error('Weather API Error:', weatherError.message);
            insights.push('⚠ Weather data unavailable (API Connection Failed)');
        }

        // B. Real-time Traffic Estimate (Heuristic based on Time/Day)
        const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
        const isWeekend = ['Saturday', 'Sunday'].includes(dayName);

        if (shift.toLowerCase() === 'morning') {
            if (isWeekend) {
                insights.push('🚗 Traffic: Moderate weekend flow');
            } else {
                insights.push('🚗 Traffic: Heavy morning rush (School/Work)');
            }
        } else if (shift.toLowerCase() === 'evening') {
            if (isWeekend) {
                insights.push('🚗 Traffic: High evening leisure traffic');
            } else {
                insights.push('🚗 Traffic: Peak commute hours (5PM - 7PM)');
            }
        } else {
            insights.push('🚗 Traffic: Standard flow');
        }

        // C. ML Model Confidence
        if (response.data.confidence) {
            const conf = response.data.confidence === 'high' ? 'High' : 'Medium';
            insights.push(`🤖 ML Confidence: ${conf} (${response.data.model || 'Random Forest'})`);
        }

        // D. Demand/Inventory Insight
        if (predictedDemand > 8000) {
            insights.push('⛽ Inventory Alert: Peak demand >8000L');
        } else {
            insights.push(`✅ Inventory: Sufficient for ${Math.round(predictedDemand)}L`);
        }

        res.json({
            ...response.data,
            breakdown: breakdown, // Include fuel breakdown
            insights: insights    // Include dynamic insights
        });

    } catch (error) {
        console.error('Error getting staffing recommendation:', error.message);

        // Fallback logic if ML service fails completely
        const fallbackDemand = req.body.predicted_demand || 6000;
        const fallbackStaff = Math.max(3, Math.min(8, Math.floor(fallbackDemand / 2000) + 1));

        res.json({
            recommended_staff: fallbackStaff,
            confidence: 'low',
            expected_wait_time: '5-10 minutes',
            model: 'Backend Fallback',
            predicted_demand: fallbackDemand,
            reasoning: {
                message: 'ML Service unavailable, using fallback estimation'
            },
            insights: [
                'System offline: Using fallback estimates',
                'Weather data unavailable',
                'Standard staffing protocols apply'
            ]
        });
    }
};

// Get 7-day forecast (Real ML Predictions)
exports.getForecast = async (req, res) => {
    try {
        const forecast = [];
        const today = new Date();
        const promises = [];

        // Generate dates for the next 7 days
        for (let i = 0; i < 7; i++) {
            const dateObj = new Date(today);
            dateObj.setDate(today.getDate() + i + 1); // Start from tomorrow
            const dateStr = dateObj.toISOString().split('T')[0];

            // Create a promise for each day's prediction
            promises.push(
                axios.post(`${SAFE_ML_API_URL}/predict-station-demand`, {
                    date: dateStr,
                    shift: 'morning', // Default to morning for daily peak estimation
                    station_id: 'Station_A'
                }).then(response => ({
                    date: dateStr,
                    demand: response.data.total_predicted_demand || 0,
                    confidence: 0.95 // High confidence for ML model
                })).catch(err => {
                    console.error(`Error fetching forecast for ${dateStr}:`, err.message);

                    // Enhanced fallback with variation
                    const dateObj = new Date(dateStr);
                    const dayOfWeek = dateObj.getDay();
                    const dayOfMonth = dateObj.getDate();

                    // Base demand varies by day of week
                    const weekdayDemands = [5800, 5500, 5200, 5900, 6200, 7100, 6800]; // Sun-Sat
                    const baseDemand = weekdayDemands[dayOfWeek];

                    // Add variation based on date (±10%)
                    const variation = 0.9 + (dayOfMonth % 20) / 100; // 0.9 to 1.1
                    const finalDemand = Math.round(baseDemand * variation);

                    return {
                        date: dateStr,
                        demand: finalDemand,
                        confidence: 0.7
                    };
                })
            );
        }

        // Wait for all predictions
        const results = await Promise.all(promises);
        res.json(results);

    } catch (error) {
        console.error('Error generating forecast:', error);
        res.status(500).json({ message: 'Server error generating forecast' });
    }
};
