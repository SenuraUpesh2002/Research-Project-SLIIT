import React, { useState, useEffect } from 'react';
import { Clock, TrendingUp } from 'lucide-react';
import axios from 'axios';

const BusyTimeHeatmap = () => {
    const [patterns, setPatterns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatterns = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3001/api/busy-times/patterns', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.length > 0) {
                    setPatterns(response.data);
                } else {
                    throw new Error("No data");
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching busy patterns:', err);
                // Mock data
                const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                const mock = [];
                days.forEach(day => {
                    for (let h = 6; h <= 22; h++) {
                        // Simulate busy-ness
                        let intensity = 1;
                        if ((h >= 7 && h <= 9) || (h >= 17 && h <= 19)) intensity = 3; // Rush hour
                        if (h >= 12 && h <= 13) intensity = 2; // Lunch
                        if (day === 'Saturday' || day === 'Sunday') intensity = Math.max(1, intensity - 1); // Less busy weekends? or more?

                        mock.push({
                            day_of_week: day,
                            hour: h,
                            avg_busy_score: intensity * Math.random() * 25
                        });
                    }
                });
                setPatterns(mock);
                setLoading(false);
            }
        };

        fetchPatterns();
    }, []);

    // Process data for grid: Rows = Days, Cols = Hours (6AM - 10PM)
    const hours = Array.from({ length: 17 }, (_, i) => i + 6); // 6 to 22
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const getIntensityColor = (score) => {
        if (score > 60) return 'bg-red-500';
        if (score > 40) return 'bg-orange-400';
        if (score > 20) return 'bg-yellow-300';
        return 'bg-green-200';
    };

    const getCellData = (day, hour) => {
        return patterns.find(p => p.day_of_week === day && p.hour === hour);
    };

    if (loading) return <div className="h-64 bg-white rounded-xl shadow-sm animate-pulse"></div>;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-700 mb-6 flex items-center justify-between">
                <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-indigo-600" />
                    Busy Time Analysis
                </div>
                <div className="flex items-center space-x-4 text-xs font-medium text-gray-500">
                    <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-green-200 mr-1"></span> Low</div>
                    <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-yellow-300 mr-1"></span> Moderate</div>
                    <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-orange-400 mr-1"></span> High</div>
                    <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-red-500 mr-1"></span> Peak</div>
                </div>
            </h3>

            <div className="overflow-x-auto">
                <div className="min-w-[600px]">
                    {/* Header Row */}
                    <div className="flex mb-2">
                        <div className="w-20"></div>
                        {hours.map(h => (
                            <div key={h} className="flex-1 text-center text-xs text-gray-400 font-medium">
                                {h}:00
                            </div>
                        ))}
                    </div>

                    {/* Day Rows */}
                    <div className="space-y-2">
                        {days.map(day => (
                            <div key={day} className="flex items-center">
                                <div className="w-24 text-xs font-semibold text-gray-600">{day}</div>
                                <div className="flex-1 flex space-x-1">
                                    {hours.map(h => {
                                        const data = getCellData(day, h);
                                        const score = data ? data.avg_busy_score : 0;
                                        return (
                                            <div
                                                key={h}
                                                className={`h-8 flex-1 rounded-sm transition-all hover:scale-110 hover:shadow-md cursor-pointer group relative ${getIntensityColor(score)}`}
                                            >
                                                {/* Tooltip */}
                                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-[10px] p-2 rounded z-10 whitespace-nowrap">
                                                    {day} {h}:00<br />
                                                    Busy Score: {Math.round(score)}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusyTimeHeatmap;
