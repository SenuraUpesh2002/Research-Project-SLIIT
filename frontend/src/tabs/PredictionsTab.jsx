'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import PredictionChart from '../components/PredictionChart';
// import PredictionChart from '../components/PredictionChart';
import StaffingRecommendation from '../components/StaffingRecommendation';
import WeatherWidget from '../components/WeatherWidget';
import HolidayCalendar from '../components/HolidayCalendar';
import BusyTimeHeatmap from '../components/BusyTimeHeatmap';
import { Activity } from 'lucide-react';

const PredictionsTab = () => {
    const [forecast, setForecast] = useState([]);
    const [staffing, setStaffing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);
    const [loadingStaffing, setLoadingStaffing] = useState(false);

    // Generate day label from date string
    const getDayLabel = (dateStr) => {
        if (!dateStr) return 'Morning Shift';
        const date = new Date(dateStr);
        return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) + ' Morning';
    };

    // Fetch staffing recommendation for a specific day
    const fetchStaffingForDay = async (dayIndex) => {
        if (!forecast[dayIndex]) return;

        setLoadingStaffing(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            const selectedDay = forecast[dayIndex];

            const staffingRes = await axios.post(
                'http://localhost:3001/api/predictions/staffing',
                {
                    predicted_demand: selectedDay.demand,
                    date: selectedDay.date,
                    shift: 'morning', // default
                    include_weather: true,
                    include_holidays: true,
                    include_busy_times: true
                },
                config
            );

            setStaffing({
                ...staffingRes.data,
                shift: getDayLabel(selectedDay.date),
                predicted_demand: selectedDay.demand,
            });
        } catch (error) {
            console.error('Error fetching staffing:', error);
        } finally {
            setLoadingStaffing(false);
        }
    };

    // Handle day click
    const handleDayClick = (index) => {
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
                    shift: firstDay ? getDayLabel(firstDay.date) : 'Tomorrow Morning',
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
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/20 flex items-center justify-center">
                        <Activity className="w-8 h-8 text-blue-600 animate-pulse" />
                    </div>
                    <p className="text-lg font-light text-[#515154]">AI Engine is thinking...</p>
                </div>
            </div>
        );
    }

    const tomorrowDemand = forecast[0]?.demand || 0;
    const weeklyAvg = forecast.length > 0
        ? Math.round(forecast.reduce((a, b) => a + b.demand, 0) / forecast.length)
        : 0;
    const maxDemand = forecast.length > 0 ? Math.max(...forecast.map(d => d.demand)) : 0;
    const minDemand = forecast.length > 0 ? Math.min(...forecast.map(d => d.demand)) : 0;
    const trend = forecast.length > 1 ? forecast[forecast.length - 1].demand - forecast[0].demand : 0;

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-end justify-between"
            >
                <div>
                    <h2 className="text-4xl font-semibold tracking-tight text-[#1D1D1F]">
                        AI Demand Intelligence
                    </h2>
                    <p className="text-lg text-[#86868B] mt-2 font-light">
                        Predictive insights for smarter station management.
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/60 text-xs font-medium text-gray-500 shadow-sm flex items-center">
                        <Activity className="w-3 h-3 mr-1.5 text-blue-500" />
                        Model Accuracy: 94%
                    </div>
                </div>
            </motion.div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* 1. Main Prediction Chart (Span 3) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-3 bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col justify-between"
                >
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-xl font-medium text-[#1D1D1F]">Weekly Forecast</h3>
                            <p className="text-sm text-gray-500 mt-1">Projected fuel demand for the next 7 days</p>
                        </div>
                        {/* Integrated Stats */}
                        <div className="flex gap-8">
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Tommorow</p>
                                <p className="text-2xl font-light text-[#1D1D1F] mt-1">{tomorrowDemand.toLocaleString()} L</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Trend</p>
                                <p className={`text-2xl font-light mt-1 ${trend >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {trend >= 0 ? '+' : ''}{trend}%
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 min-h-[300px]">
                        <PredictionChart
                            data={forecast}
                            onDayClick={handleDayClick}
                            selectedDayIndex={selectedDayIndex}
                        />
                    </div>
                </motion.div>

                {/* 2. Staffing Recommendation (Span 1, Row 1-2 Vertical) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-1 bg-gradient-to-b from-blue-50/50 to-white rounded-[32px] p-1 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-blue-100/50 flex flex-col"
                >
                    <div className="h-full bg-white/60 backdrop-blur-xl rounded-[28px] p-6 flex flex-col">
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-[#1D1D1F] flex items-center gap-2">
                                <span className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
                                    <Activity className="w-4 h-4" />
                                </span>
                                Staffing
                            </h3>
                            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                                Recommended staff allocation for {getDayLabel(forecast[selectedDayIndex]?.date)}
                            </p>
                        </div>

                        <div className="flex-1 flex flex-col justify-end">
                            {staffing ? (
                                <StaffingRecommendation recommendation={staffing} />
                            ) : (
                                <div className="animate-pulse bg-gray-100 rounded-2xl h-48 w-full" />
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* 3. Weather Widget (Span 1) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-1 overflow-hidden rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                >
                    <WeatherWidget />
                </motion.div>

                {/* 4. Busy Time Heatmap (Span 2) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-2 bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100"
                >
                    <div className="h-full">
                        <BusyTimeHeatmap />
                    </div>
                </motion.div>

                {/* 5. Holiday Calendar (Span 1) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="lg:col-span-1 bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden"
                >
                    <HolidayCalendar />
                </motion.div>

            </div>
        </div>
    );
};

export default PredictionsTab;