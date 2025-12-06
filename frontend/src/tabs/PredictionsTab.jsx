'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import PredictionChart from '../components/PredictionChart';
import StaffingRecommendation from '../components/StaffingRecommendation';
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
                    date: selectedDay.date
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
                    axios.post('http://localhost:3001/api/predictions/staffing', {}, config),
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: Forecast + Stats */}
            <div className="lg:col-span-8 space-y-10">

                {/* Title with integrated stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-left space-y-8"
                >
                    <div>
                        <h2 className="text-5xl font-light tracking-tight text-[#1D1D1F]">
                            AI Demand Intelligence
                        </h2>
                        <p className="text-xl text-[#515154] mt-3">
                            7-day forecast with 94% accuracy
                        </p>
                    </div>

                    {/* Integrated stats grid */}
                    <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-2">
                            <div className="bg-gradient-to-r from-blue-400/5 to-blue-400/10 border border-blue-200/30 rounded-2xl p-6 backdrop-blur-sm">
                                <p className="text-sm text-blue-600 font-medium mb-2">TOMORROW'S PEAK</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-light text-[#1D1D1F]">
                                        {tomorrowDemand.toLocaleString()}
                                    </span>
                                    <span className="text-lg text-blue-600">liters</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="bg-gradient-to-r from-emerald-400/5 to-emerald-400/10 border border-emerald-200/30 rounded-2xl p-6 backdrop-blur-sm">
                                <p className="text-sm text-emerald-600 font-medium mb-2">WEEKLY AVG</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-light text-[#1D1D1F]">
                                        {weeklyAvg.toLocaleString()}
                                    </span>
                                    <span className="text-sm text-emerald-600">L</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className={`bg-gradient-to-r ${trend >= 0 ? 'from-green-400/5 to-green-400/10 border-green-200/30' : 'from-rose-400/5 to-rose-400/10 border-rose-200/30'} rounded-2xl p-6 backdrop-blur-sm border`}>
                                <p className="text-sm font-medium mb-2" style={{ color: trend >= 0 ? '#059669' : '#e11d48' }}>
                                    WEEKLY TREND
                                </p>
                                <div className="flex items-baseline gap-1">
                                    <span className={`text-3xl font-light ${trend >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                                        {trend >= 0 ? '+' : ''}{trend.toLocaleString()}
                                    </span>
                                    <span className="text-sm" style={{ color: trend >= 0 ? '#059669' : '#e11d48' }}>
                                        L
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Premium Chart Card */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative"
                >
                    <PredictionChart
                        data={forecast}
                        onDayClick={handleDayClick}
                        selectedDayIndex={selectedDayIndex}
                    />
                </motion.div>

                {/* Range indicators */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gradient-to-r from-slate-50 to-white border border-slate-100 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500 font-medium mb-1">PEAK DEMAND</p>
                                <p className="text-2xl font-light text-slate-800">
                                    {maxDemand.toLocaleString()} <span className="text-sm text-slate-400">liters</span>
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-500/10 border border-amber-200/30 flex items-center justify-center">
                                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-slate-50 to-white border border-slate-100 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500 font-medium mb-1">LOWEST DEMAND</p>
                                <p className="text-2xl font-light text-slate-800">
                                    {minDemand.toLocaleString()} <span className="text-sm text-slate-400">liters</span>
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400/20 to-blue-500/10 border border-blue-200/30 flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Staffing Intelligence */}
            <div className="lg:col-span-4 space-y-10">

                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-6"
                >
                    <div>
                        <h2 className="text-4xl font-light tracking-tight text-[#1D1D1F]">
                            Staffing Optimization
                        </h2>
                        <p className="text-lg text-[#515154] mt-3">
                            AI-recommended workforce allocation
                        </p>
                    </div>

                    {/* Selected Day Preview */}
                    <div className="bg-gradient-to-r from-violet-50 to-white border border-violet-100 rounded-2xl p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-violet-600 font-medium mb-1">SELECTED DAY</p>
                                <p className="text-lg font-medium text-[#1D1D1F]">
                                    {getDayLabel(forecast[selectedDayIndex]?.date)}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-slate-500">Predicted Demand</p>
                                <p className="text-2xl font-light text-violet-700">
                                    {forecast[selectedDayIndex]?.demand?.toLocaleString() || '0'}L
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Staffing Recommendation Card */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    {staffing && <StaffingRecommendation recommendation={staffing} />}
                </motion.div>

                {/* Insight Panel */}
                {/* <motion.div
                    key={selectedDayIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white/70 backdrop-blur-2xl rounded-3xl border border-white/60 shadow-2xl ring-1 ring-white/50 p-8"
                >
                    <h4 className="text-xl font-medium text-[#1D1D1F] mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        AI Reasoning
                        {staffing?.date && (
                            <span className="text-sm font-normal text-gray-500 ml-auto">
                                {new Date(staffing.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                        )}
                    </h4>
                    <ul className="space-y-4 text-[#515154]">
                        {staffing?.insights && staffing.insights.length > 0 ? (
                            staffing.insights.map((insight, i) => (
                                <motion.li
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + i * 0.1 }}
                                    className="flex items-start gap-3"
                                >
                                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 mt-2 flex-shrink-0" />
                                    <span className="text-sm font-light leading-relaxed">{insight}</span>
                                </motion.li>
                            ))
                        ) : (
                            <motion.li
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-sm text-gray-400 italic"
                            >
                                Analyzing real-time data...
                            </motion.li>
                        )}
                    </ul>
                </motion.div> */}
            </div>
        </div>
    );
};

export default PredictionsTab;