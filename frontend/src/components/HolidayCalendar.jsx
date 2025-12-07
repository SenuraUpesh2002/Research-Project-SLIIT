import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, MapPin, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { format, isSameDay, parseISO } from 'date-fns';

const HolidayCalendar = () => {
    const [holidays, setHolidays] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHolidays = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3001/api/holidays/upcoming', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setHolidays(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching holidays:', err);
                // Mock data for demo if backend fails or empty
                setHolidays([
                    { date: '2024-12-25', holiday_name: 'Christmas Day', holiday_type: 'public', is_long_weekend: 0 },
                    { date: '2025-01-01', holiday_name: 'New Year\'s Day', holiday_type: 'public', is_long_weekend: 0 },
                    { date: '2025-01-14', holiday_name: 'Thai Pongal', holiday_type: 'public', is_long_weekend: 0 },
                    { date: '2025-02-04', holiday_name: 'Independence Day', holiday_type: 'public', is_long_weekend: 1 }
                ]);
                setLoading(false);
            }
        };

        fetchHolidays();
    }, []);

    const getTypeColor = (type) => {
        switch (type) {
            case 'public': return 'bg-red-100 text-red-700 border-red-200';
            case 'school': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'festival': return 'bg-purple-100 text-purple-700 border-purple-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    if (loading) return <div className="h-48 bg-white rounded-xl shadow-sm animate-pulse"></div>;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2 text-indigo-600" />
                Upcoming Events
            </h3>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {holidays.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">No upcoming holidays found.</p>
                ) : (
                    holidays.map((holiday, index) => (
                        <div key={index} className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                            <div className="flex-shrink-0 w-12 text-center mr-3">
                                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                    {format(parseISO(holiday.date), 'MMM')}
                                </div>
                                <div className="text-xl font-bold text-gray-800">
                                    {format(parseISO(holiday.date), 'dd')}
                                </div>
                            </div>

                            <div className="flex-1">
                                <h4 className="text-sm font-medium text-gray-800 leading-tight mb-1">
                                    {holiday.holiday_name}
                                </h4>
                                <div className="flex items-center space-x-2">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${getTypeColor(holiday.holiday_type)}`}>
                                        {holiday.holiday_type}
                                    </span>
                                    {holiday.is_long_weekend ? (
                                        <span className="text-[10px] flex items-center text-green-600 font-medium">
                                            <AlertCircle className="w-3 h-3 mr-1" />
                                            Long Weekend
                                        </span>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default HolidayCalendar;
