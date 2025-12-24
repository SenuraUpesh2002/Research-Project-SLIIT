'use client';

import { useState, useEffect } from 'react';
import { predictionService } from '../services/api';
import { getDayLabel } from '../utils/date';
import { useForecast } from '../hooks/usePredictionData';
import { motion } from 'framer-motion';
import PredictionChart from '../components/PredictionChart';
import StaffingRecommendation from '../components/StaffingRecommendation';
import { Activity, TrendingUp } from 'lucide-react';

const PredictionsTab = () => {
    const { data: forecast = [], isLoading: loadingForecast } = useForecast();
    const [staffing, setStaffing] = useState(null);
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);
    const [loadingStaffing, setLoadingStaffing] = useState(false);

    // Fetch staffing recommendation for a specific day
    const fetchStaffingForDay = async (dayIndex) => {
        if (!forecast[dayIndex]) return;

        try {
            const selectedDay = forecast[dayIndex];
            console.log('Fetching staffing for:', selectedDay.date, 'Demand:', selectedDay.demand);

            const staffingRes = await predictionService.getStaffing({
                predicted_demand: selectedDay.demand,
                date: selectedDay.date,
                shift: 'morning',
                include_weather: true,
                include_holidays: true,
                include_busy_times: true
            });

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

    // Initial staffing fetch
    useEffect(() => {
        if (forecast.length > 0 && !staffing) {
            const fetchInitialStaffing = async () => {
                setLoadingStaffing(true);
                try {
                    const firstDay = forecast[0];
                    const staffingRes = await predictionService.getStaffing({
                        include_weather: true,
                        predicted_demand: firstDay.demand,
                        date: firstDay.date
                    });

                    setStaffing({
                        ...staffingRes.data,
                        shift: getDayLabel(firstDay.date),
                        predicted_demand: firstDay.demand,
                    });
                } catch (error) {
                    console.error('Error fetching initial staffing:', error);
                } finally {
                    setLoadingStaffing(false);
                }
            };
            fetchInitialStaffing();
        }
    }, [forecast, staffing]);

    if (loadingForecast) {
        return (
            <div className="flex items-center justify-center min-h-[500px]">
                <div className="text-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                        className="w-16 h-16 mx-auto mb-6 rounded-full border-4 border-t-blue-500 border-r-indigo-500 border-b-purple-500 border-l-transparent"
                    />
                    <p className="text-lg font-light text-gray-500">Generating predictions...</p>
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