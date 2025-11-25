import { useState, useEffect } from 'react';
import axios from 'axios';
import PredictionChart from '../components/PredictionChart';
import StaffingRecommendation from '../components/StaffingRecommendation';

const PredictionsTab = () => {
    const [forecast, setForecast] = useState([]);
    const [staffing, setStaffing] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'x-auth-token': token } };

                const [forecastRes, staffingRes] = await Promise.all([
                    axios.get('http://localhost:3001/api/predictions/forecast', config),
                    axios.post('http://localhost:3001/api/predictions/staffing', {}, config)
                ]);

                setForecast(forecastRes.data);
                setStaffing({
                    ...staffingRes.data,
                    shift: 'Tomorrow Morning', // Mocked context
                    predicted_demand: 520 // Mocked context
                });
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="text-center py-10 text-slate-500">Loading AI predictions...</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chart Section */}
            <div className="lg:col-span-2">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-slate-800">Fuel Demand Forecast</h2>
                    <p className="text-sm text-slate-500">Predicted fuel consumption for the next 7 days.</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <PredictionChart data={forecast} />
                </div>

                <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <p className="text-xs text-blue-600 font-semibold uppercase">Tomorrow</p>
                        <p className="text-2xl font-bold text-slate-800">{forecast[0]?.demand}L</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                        <p className="text-xs text-green-600 font-semibold uppercase">Weekly Avg</p>
                        <p className="text-2xl font-bold text-slate-800">
                            {Math.round(forecast.reduce((a, b) => a + b.demand, 0) / forecast.length)}L
                        </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                        <p className="text-xs text-purple-600 font-semibold uppercase">Trend</p>
                        <p className="text-2xl font-bold text-slate-800">↗ +5%</p>
                    </div>
                </div>
            </div>

            {/* Recommendation Section */}
            <div>
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-slate-800">Staffing</h2>
                    <p className="text-sm text-slate-500">AI-optimized resource allocation.</p>
                </div>

                {staffing && <StaffingRecommendation recommendation={staffing} />}

                <div className="mt-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h4 className="font-semibold text-slate-700 mb-2">Why this recommendation?</h4>
                    <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
                        <li>High demand expected between 8:00 AM - 10:00 AM</li>
                        <li>Historical data shows 20% increase on Tuesdays</li>
                        <li>Weather forecast: Clear skies (Higher traffic)</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PredictionsTab;
