'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import PredictionChart from '../components/PredictionChart';
import StaffingRecommendation from '../components/StaffingRecommendation';
import { Activity, TrendingUp } from 'lucide-react';

const PredictionsTab = () => {
    const [forecast, setForecast] = useState([]);
    const [staffing, setStaffing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);

    // Generate day label from date string
    const getDayLabel = (dateStr) => {
        if (!dateStr) return 'Morning Shift';
        return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    };

    // Fetch staffing recommendation for a specific day
    const fetchStaffingForDay = async (dayIndex) => {
        if (!forecast[dayIndex]) return;

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            const selectedDay = forecast[dayIndex];
            console.log('Fetching staffing for:', selectedDay.date, 'Demand:', selectedDay.demand);

            const staffingRes = await axios.post(
                'http://localhost:3001/api/predictions/staffing',
                {
                    predicted_demand: selectedDay.demand,
                    date: selectedDay.date,
                    shift: 'morning',
                    include_weather: true,
                    include_holidays: true,
                    include_busy_times: true
                },
                config
            );

            console.log('Staffing response:', staffingRes.data);

            setStaffing({
                ...staffingRes.data,
                shift: getDayLabel(selectedDay.date),
                predicted_demand: selectedDay.demand,
            });
        } catch (error) {
            console.error('Error fetching staffing:', error);
        }
    };

    // Handle day click
    const handleDayClick = (index) => {
        console.log('Day clicked index:', index);
        setSelectedDayIndex(index);
        fetchStaffingForDay(index);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'x-auth-token': token } };

                const [forecastRes, staffingRes] = await Promise.all([
                    axios.get('http://localhost:3001/api/predictions/forecast', config),
                    axios.post('http://localhost:3001/api/predictions/staffing', {
                        include_weather: true
                    }, config),
                ]);

                setForecast(forecastRes.data);

                const firstDay = forecastRes.data[0];
                setStaffing({
                    ...staffingRes.data,
                    shift: firstDay ? getDayLabel(firstDay.date) : 'Tomorrow',
                    predicted_demand: firstDay?.demand || 520,
                });
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                        className="w-16 h-16 mx-auto mb-6 rounded-full border-4 border-t-blue-600 border-r-purple-600 border-b-pink-600 border-l-transparent"
                    />
                    <p className="text-lg font-light text-gray-500">Loading predictions...</p>
                </div>
            </div>
        );
    }

    const tomorrowDemand = forecast[0]?.demand || 0;
    const trend = forecast.length > 1 ? forecast[forecast.length - 1].demand - forecast[0].demand : 0;

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-5xl font-light tracking-tight text-gray-900">AI Demand Intelligence</h1>
                <p className="text-xl text-gray-500 mt-3">
                    Predictive insights for smarter station management
                </p>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                            <Activity className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-sm text-blue-600 font-medium">Tomorrow's Demand</p>
                            <p className="text-2xl font-semibold text-gray-900">{tomorrowDemand.toLocaleString()} L</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className={`bg-gradient-to-br ${trend >= 0 ? 'from-emerald-50 to-emerald-100 border-emerald-200' : 'from-rose-50 to-rose-100 border-rose-200'} border rounded-2xl p-6`}
                >
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${trend >= 0 ? 'bg-emerald-500' : 'bg-rose-500'} flex items-center justify-center`}>
                            <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className={`text-sm ${trend >= 0 ? 'text-emerald-600' : 'text-rose-600'} font-medium`}>Weekly Trend</p>
                            <p className={`text-2xl font-semibold ${trend >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {trend >= 0 ? '+' : ''}{trend}%
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Forecast Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-lg border border-gray-200"
                >
                    <div className="mb-6">
                        <h3 className="text-2xl font-semibold text-gray-900">7-Day Forecast</h3>
                        <p className="text-sm text-gray-500 mt-1">Projected fuel demand for the next week</p>
                    </div>
                    <div className="min-h-[350px]">
                        <PredictionChart
                            data={forecast}
                            onDayClick={handleDayClick}
                            selectedDayIndex={selectedDayIndex}
                        />
                    </div>
                </motion.div>

                {/* Staffing Recommendation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-br from-purple-50 to-white rounded-3xl p-8 shadow-lg border border-purple-200"
                >
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-gray-900">Staffing Recommendation</h3>
                        <p className="text-sm text-gray-500 mt-2">
                            For {getDayLabel(forecast[selectedDayIndex]?.date)}
                        </p>
                    </div>
                    <div>
                        {staffing ? (
                            <StaffingRecommendation recommendation={staffing} />
                        ) : (
                            <div className="animate-pulse bg-gray-100 rounded-2xl h-48 w-full" />
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default PredictionsTab;