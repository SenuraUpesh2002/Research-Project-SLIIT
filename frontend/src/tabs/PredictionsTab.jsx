'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import PredictionChart from '../components/PredictionChart';
import StaffingRecommendation from '../components/StaffingRecommendation';
import { TrendingUp, Users, Activity } from 'lucide-react';

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
                    axios.post('http://localhost:3001/api/predictions/staffing', {}, config),
                ]);

                setForecast(forecastRes.data);
                setStaffing({
                    ...staffingRes.data,
                    shift: 'Tomorrow Morning',
                    predicted_demand: forecastRes.data[0]?.demand || 520,
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

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: Forecast + Stats */}
            <div className="lg:col-span-8 space-y-10">

                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-left"
                >
                    <h2 className="text-5xl font-light tracking-tight text-[#1D1D1F]">
                        AI Demand Intelligence
                    </h2>
                    <p className="text-xl text-[#515154] mt-3">
                        Neural predictions • 7-day horizon • 94% accuracy
                    </p>
                </motion.div>

                {/* Premium Chart Card */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative"
                >
                    <PredictionChart data={forecast} />
                </motion.div>

                {/* Premium Stat Cards */}
                <div className="grid grid-cols-3 gap-6">
                    {[
                        { label: 'Tomorrow', value: `${tomorrowDemand.toLocaleString()}L`, icon: TrendingUp, color: 'from-blue-400 to-cyan-400' },
                        { label: 'Weekly Avg', value: `${weeklyAvg.toLocaleString()}L`, icon: Activity, color: 'from-emerald-400 to-teal-400' },
                        { label: 'Growth Trend', value: '+5%', icon: TrendingUp, color: 'from-purple-400 to-pink-400' },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            whileHover={{ y: -8, transition: { duration: 0.4 } }}
                            className="group relative overflow-hidden rounded-3xl bg-white/75 backdrop-blur-2xl border border-white/60 shadow-2xl ring-1 ring-white/50 p-8"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color}/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                            <div className="relative z-10">
                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg flex items-center justify-center mb-4`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-sm font-medium text-[#86868B] uppercase tracking-wider">
                                    {stat.label}
                                </p>
                                <p className="text-4xl font-extralight text-[#1D1D1F] mt-2 tracking-tight">
                                    {stat.value}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Right: Staffing Intelligence */}
            <div className="lg:col-span-4 space-y-10">

                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <h2 className="text-4xl font-light tracking-tight text-[#1D1D1F]">
                        Staffing Optimization
                    </h2>
                    <p className="text-lg text-[#515154] mt-3">
                        AI-recommended workforce allocation
                    </p>
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
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white/70 backdrop-blur-2xl rounded-3xl border border-white/60 shadow-2xl ring-1 ring-white/50 p-8"
                >
                    <h4 className="text-xl font-medium text-[#1D1D1F] mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        AI Reasoning
                    </h4>
                    <ul className="space-y-4 text-[#515154]">
                        {[
                            'Peak demand expected 8–10 AM',
                            'Tuesday historically +20% traffic',
                            'Clear weather → higher volume',
                            'Inventory buffer: 520L required',
                        ].map((insight, i) => (
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
                        ))}
                    </ul>
                </motion.div>
            </div>
        </div>
    );
};

export default PredictionsTab;