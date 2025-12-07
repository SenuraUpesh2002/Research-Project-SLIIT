import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets } from 'lucide-react';
import axios from 'axios';

const WeatherWidget = () => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3001/api/weather/current', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setWeather(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching weather:', err);
                setError('Failed to load weather data');
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);

    if (loading) return <div className="p-4 bg-white rounded-lg shadow animate-pulse h-32"></div>;
    if (error) return <div className="p-4 bg-red-50 text-red-500 rounded-lg shadow">{error}</div>;
    if (!weather) return null;

    const getWeatherIcon = (condition) => {
        const cond = condition.toLowerCase();
        if (cond.includes('rain')) return <CloudRain className="w-8 h-8 text-blue-500" />;
        if (cond.includes('cloud')) return <Cloud className="w-8 h-8 text-gray-500" />;
        if (cond.includes('clear') || cond.includes('sun')) return <Sun className="w-8 h-8 text-yellow-500" />;
        return <Cloud className="w-8 h-8 text-blue-400" />;
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <Sun className="w-5 h-5 mr-2 text-indigo-600" />
                Live Weather (Negombo)
            </h3>

            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    {getWeatherIcon(weather.condition)}
                    <div>
                        <div className="text-3xl font-bold text-gray-800">{weather.temperature}°C</div>
                        <div className="text-sm text-gray-500">{weather.condition}</div>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                        <Droplets className="w-4 h-4 mr-2 text-blue-400" />
                        Humidity: {weather.humidity}%
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <Wind className="w-4 h-4 mr-2 text-gray-400" />
                        Wind: {weather.wind_speed} km/h
                    </div>
                    {weather.rainfall_prob > 0 && (
                        <div className="flex items-center text-sm text-blue-600 font-medium">
                            <CloudRain className="w-4 h-4 mr-2" />
                            Rain Chance: {weather.rainfall_prob}%
                        </div>
                    )}
                </div>
            </div>

            {weather.is_fallback && (
                <div className="mt-3 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                    ⚠ Using simulated data (API Key missing)
                </div>
            )}
        </div>
    );
};

export default WeatherWidget;
