import React, { useCallback } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { getDayLabel } from '../utils/date';

// Extracted CustomDot component to prevent re-creation on every render
const CustomDot = ({ cx, cy, index, selectedDayIndex, payload }) => {
    const isSelected = index === selectedDayIndex;

    // Use payload if needed for specific logic, but index comparison is sufficient here
    return (
        <circle
            cx={cx}
            cy={cy}
            r={isSelected ? 10 : 5}
            fill={isSelected ? '#3B82F6' : '#fff'}
            stroke="#3B82F6"
            strokeWidth={isSelected ? 4 : 2}
            style={{
                cursor: 'pointer',
                filter: isSelected ? 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))' : 'none',
                transition: 'all 0.3s ease'
            }}
        />
    );
};

const PredictionChart = React.memo(({ data, onDayClick, selectedDayIndex = 0 }) => {
    // Handle chart click
    const handleClick = useCallback((chartData) => {
        if (chartData && chartData.activeTooltipIndex !== undefined && onDayClick) {
            onDayClick(chartData.activeTooltipIndex);
        }
    }, [onDayClick]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }} // Reduced duration slightly for snappier feel
            className="relative w-full"
        >
            {/* Premium Glass Container */}
            <div className="relative bg-white/75 backdrop-blur-2xl rounded-3xl border border-white/60 shadow-2xl overflow-hidden ring-1 ring-white/50 p-8">

                {/* Subtle Floating Orb – Tesla Touch */}
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
                    className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-blue-400/20 via-cyan-400/10 to-transparent blur-3xl"
                />

                {/* Chart Title */}
                <div className="mb-8">
                    <h3 className="text-3xl font-light tracking-tight text-[#1D1D1F]">
                        AI Demand Forecast
                    </h3>
                    <p className="text-sm text-[#86868B] mt-2 tracking-wide">
                        Next 7 days • Neural prediction engine
                    </p>
                </div>

                {/* Ultra-Premium Area Chart */}
                <div className="h-[420px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={data}
                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                            onClick={handleClick}
                            style={{ cursor: 'pointer' }}
                        >
                            {/* Gradient Definition */}
                            <defs>
                                <linearGradient id="premiumDemand" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.9} />
                                    <stop offset="50%" stopColor="#60A5FA" stopOpacity={0.6} />
                                    <stop offset="100%" stopColor="#93BBFC" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="glowStroke" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#3B82F6" />
                                    <stop offset="50%" stopColor="#60A5FA" />
                                    <stop offset="100%" stopColor="#93BBFC" />
                                </linearGradient>
                            </defs>

                            {/* Minimal Grid */}
                            <CartesianGrid
                                strokeDasharray="6 8"
                                vertical={false}
                                stroke="rgba(148, 163, 184, 0.1)"
                            />

                            {/* X Axis – Clean & Minimal */}
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                stroke="#94A3B8"
                                fontSize={13}
                                tick={{ fill: '#64748B', fontWeight: 500 }}
                                tickFormatter={(date) =>
                                    new Date(date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })
                                }
                            />

                            {/* Y Axis – Elegant */}
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                stroke="#94A3B8"
                                fontSize={13}
                                tick={{ fill: '#64748B' }}
                                tickFormatter={(value) => `${value.toLocaleString()}L`}
                            />

                            {/* Premium Tooltip */}
                            <Tooltip
                                cursor={{ stroke: '#3B82F6', strokeWidth: 2, strokeDasharray: '8 8' }}
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.6)',
                                    borderRadius: '20px',
                                    padding: '16px',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                                    fontSize: '14px',
                                }}
                                labelStyle={{ color: '#1D1D1F', fontWeight: 600 }}
                                itemStyle={{ color: '#3B82F6', fontWeight: 500 }}
                                formatter={(value) => [`${value.toLocaleString()} Liters`, 'Predicted Demand']}
                                labelFormatter={(label) => getDayLabel(label)}
                            />

                            {/* Glowing Area Fill + Animated Stroke */}
                            <Area
                                type="monotone"
                                dataKey="demand"
                                stroke="url(#glowStroke)"
                                strokeWidth={4}
                                fillOpacity={1}
                                fill="url(#premiumDemand)"
                                dot={(props) => (
                                    <CustomDot
                                        key={props.index}
                                        {...props}
                                        selectedDayIndex={selectedDayIndex}
                                    />
                                )}
                                activeDot={{
                                    r: 8,
                                    stroke: '#3B82F6',
                                    strokeWidth: 4,
                                    fill: '#fff',
                                    shadow: '0 0 20px rgba(59, 130, 246, 0.5)',
                                }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend / Footer */}
                <div className="mt-6 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 shadow-lg" />
                        <span className="text-[#64748B] font-medium">AI Prediction</span>
                    </div>
                    <span className="text-[#94A3B8] font-light">
                        Updated {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </div>
        </motion.div>
    );
});

export default PredictionChart;