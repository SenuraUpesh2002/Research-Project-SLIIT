'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useActiveEmployees, useMyAttendance } from '../hooks/useEmployeeData';
import { toast } from 'sonner';
import { attendanceService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    QrCode,
    Clock,
    MapPin,
    CheckCircle,
    LogOut,
    History,
    Timer,
    Calendar,
    ChevronRight,
    Users,
    TrendingUp,
    Shield,
    Sparkles,
    Coffee,
    Briefcase,
    Zap,
    Target
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { formatDate, calculateDuration } from '../utils/date';

// StatCard Component
const StatCard = ({ icon, title, value, description, color = 'blue' }) => {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600 border-blue-100',
        purple: 'bg-purple-50 text-purple-600 border-purple-100',
        emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        orange: 'bg-orange-50 text-orange-600 border-orange-100',
        gray: 'bg-gray-50 text-gray-600 border-gray-100'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
        >
            <div className="flex items-start justify-between" >
                <div>
                    <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center mb-4`}>
                        {icon}
                    </div>
                    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                    <p className="text-xs text-gray-400 mt-2">{description}</p>
                </div>
            </div>
        </motion.div>
    );
};

// SessionTimer Component
const SessionTimer = ({ startTime }) => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (time) => {
        const diff = currentTime - new Date(startTime);
        const hours = Math.floor(diff / 1000 / 60 / 60);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="font-mono text-2xl font-bold text-emerald-700">
            {formatTime(startTime)}
        </div>
    );
};

// AttendanceHistory Component
const AttendanceHistory = ({ records, currentDuration }) => {
    const getStatusColor = (record) => {
        if (!record.check_out_time) return 'bg-blue-50 text-blue-700 border-blue-100';
        return 'bg-gray-50 text-gray-700 border-gray-100';
    };

    const getStatusText = (record) => {
        if (!record.check_out_time) return 'In Progress';
        return 'Completed';
    };

    return (
        <div className="divide-y divide-gray-100">
            {records.length > 0 ? (
                records.slice(0, 5).map((record) => (
                    <motion.div
                        key={record.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-6 hover:bg-gray-50/50 transition-colors"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getStatusColor(record)}`}>
                                        {!record.check_out_time ? (
                                            <Timer className="w-4 h-4" />
                                        ) : (
                                            <CheckCircle className="w-4 h-4" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {new Date(record.check_in_time).toLocaleDateString('en-US', {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(record.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {' '}
                                            {record.check_out_time
                                                ? new Date(record.check_out_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                : 'Now'
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(record)}`}>
                                    {getStatusText(record)}
                                </span>
                                <p className="text-lg font-bold text-gray-900 mt-1">
                                    {!record.check_out_time && currentDuration
                                        ? <SessionTimer startTime={currentDuration} />
                                        : record.check_out_time
                                            ? calculateDuration(record.check_in_time, record.check_out_time)
                                            : '--:--:--'
                                    }
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))
            ) : (
                <div className="p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                        <Coffee className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">No attendance history yet</p>
                    <p className="text-gray-400 text-sm mt-1">Start your first shift to see records here</p>
                </div>
            )}
        </div>
    );
};

// Main Dashboard Component
const EmployeeDashboard = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const { data: activeEmployees = [], isLoading: employeesLoading } = useActiveEmployees();
    const { data: attendanceHistory = [], isLoading: historyLoading, refetch } = useMyAttendance();
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleCheckOut = async () => {
        try {
            await attendanceService.checkOut();
            toast.success('Checked out successfully!', {
                icon: '👋',
                description: 'See you tomorrow!'
            });
            setTimeout(() => {
                refetch();
            }, 500);
        } catch (error) {
            toast.error('Check-out failed', {
                description: error.response?.data?.message || 'Please try again'
            });
        }
    };

    if (authLoading || employeesLoading || historyLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin"></div>
                        <div className="w-16 h-16 border-4 border-transparent border-t-blue-500 rounded-full absolute top-0 left-0 animate-spin"></div>
                    </div>
                    <p className="mt-4 text-gray-600 font-medium">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    const isActive = activeEmployees.some(emp => emp.id === user?.id || emp.email === user?.email);
    const activeSession = activeEmployees.find(emp => emp.id === user?.id || emp.email === user?.email);

    // Calculate stats
    const todayAttendance = attendanceHistory.find(record =>
        new Date(record.check_in_time).toDateString() === currentTime.toDateString()
    );

    const totalSessions = attendanceHistory.length;
    const totalHours = attendanceHistory.reduce((acc, record) => {
        if (record.check_out_time) {
            const [hours, minutes] = calculateDuration(record.check_in_time, record.check_out_time).split(':');
            return acc + parseInt(hours) + (parseInt(minutes) / 60);
        }
        return acc;
    }, 0);

    // Calculate this month's hours
    const thisMonthHours = attendanceHistory.reduce((acc, record) => {
        if (record.check_out_time) {
            const recordDate = new Date(record.check_in_time);
            const currentDate = new Date();
            if (recordDate.getMonth() === currentDate.getMonth() && recordDate.getFullYear() === currentDate.getFullYear()) {
                const [hours, minutes] = calculateDuration(record.check_in_time, record.check_out_time).split(':');
                return acc + parseInt(hours) + (parseInt(minutes) / 60);
            }
        }
        return acc;
    }, 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 font-sans">
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 pt-20 pb-12 mt-6">
                {/* Header with Greeting */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between ">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                {/* <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                    {user?.name?.charAt(0)}
                                </div> */}
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mt-12">
                                        Welcome back, {user?.name?.split(' ')[0]}! 👋
                                    </h1>
                                    <p className="text-gray-500 mt-1 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {formatDate(currentTime)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-500">Current Time</div>
                            <div className="text-2xl font-bold text-gray-900 font-mono">
                                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Status Banner */}
                <AnimatePresence mode="wait">
                    {isActive && activeSession ? (
                        <motion.div
                            key="active"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-white mb-8 p-6 shadow-lg"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
                            <div className="relative z-10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                            <CheckCircle className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold">Active Shift</h2>
                                            <p className="text-emerald-100">You're currently working</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-emerald-100">Started at</div>
                                        <div className="text-2xl font-bold">
                                            {new Date(activeSession.checkin_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                        <div className="flex items-center gap-2 text-sm mb-2">
                                            <Timer className="w-4 h-4" />
                                            Time Elapsed
                                        </div>
                                        <SessionTimer startTime={activeSession.checkin_time} />
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                        <div className="text-sm mb-2">Shift Type</div>
                                        <div className="text-xl font-bold capitalize">
                                            {activeSession.shift_type}
                                        </div>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                        <div className="text-sm mb-2">Station</div>
                                        <div className="text-xl font-bold">GAM-0001-07</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="inactive"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-700 to-gray-800 text-white mb-8 p-6 shadow-lg"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
                            <div className="relative z-10 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                        <Clock className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">Ready to Start?</h2>
                                        <p className="text-gray-300">Check in to begin your shift</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate('/mobile-checkin')}
                                    className="px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                                >
                                    Start Shift
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard
                        icon={<Users className="w-6 h-6" />}
                        title="Active Colleagues"
                        value={activeEmployees.length}
                        description="Currently working"
                        color="blue"
                    />
                    <StatCard
                        icon={<TrendingUp className="w-6 h-6" />}
                        title="Total Sessions"
                        value={totalSessions}
                        description="All time"
                        color="purple"
                    />
                    <StatCard
                        icon={<Shield className="w-6 h-6" />}
                        title="Hours Worked"
                        value={`${thisMonthHours.toFixed(1)}h`}
                        description="This month"
                        color="emerald"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Quick Actions */}
                    <div className="lg:col-span-2">
                        {/* Primary Action Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="mb-8"
                        >
                            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl overflow-hidden shadow-xl">
                                <div className="p-6 text-white">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h3 className="text-2xl font-bold mb-2">
                                                {isActive ? 'Ready to finish?' : 'Start your shift'}
                                            </h3>
                                            <p className="text-blue-100">
                                                {isActive
                                                    ? 'End your workday and check out'
                                                    : 'Scan QR code to begin working'
                                                }
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                            {isActive ? (
                                                <LogOut className="w-6 h-6" />
                                            ) : (
                                                <QrCode className="w-6 h-6" />
                                            )}
                                        </div>
                                    </div>

                                    {isActive ? (
                                        <button
                                            onClick={handleCheckOut}
                                            className="w-full py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            Check Out Now
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => navigate('/mobile-checkin')}
                                            className="w-full py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                                        >
                                            <QrCode className="w-5 h-5" />
                                            Check In with QR
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* Attendance History */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                            <History className="w-5 h-5 text-blue-500" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900">Attendance History</h2>
                                            <p className="text-gray-500 text-sm">Your recent work sessions</p>
                                        </div>
                                    </div>
                                    <button className="text-sm text-blue-600 font-medium flex items-center gap-1 hover:text-blue-700">
                                        View All
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <AttendanceHistory
                                records={attendanceHistory}
                                currentDuration={isActive ? activeSession?.checkin_time : null}
                            />
                        </motion.div>
                    </div>

                    {/* Right Column - Quick Info */}
                    <div className="space-y-6">
                        {/* Station Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-orange-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Assigned Station</h3>
                                    <p className="text-sm text-gray-500">Your workplace location</p>
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
                                <div className="text-sm text-orange-600 font-medium mb-1">Current Station</div>
                                <div className="text-2xl font-bold text-gray-900">GAM-0001-07</div>
                                <div className="text-sm text-gray-500 mt-2">Floor 2, Zone A</div>
                            </div>
                        </motion.div>

                        {/* Today's Summary */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 text-purple-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Today's Summary</h3>
                                    <p className="text-sm text-gray-500">Your daily overview</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Status</span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
                                        {isActive ? 'Active' : 'Not Started'}
                                    </span>
                                </div>
                                {todayAttendance && (
                                    <>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Check-in</span>
                                            <span className="font-medium">
                                                {new Date(todayAttendance.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        {todayAttendance.check_out_time && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Check-out</span>
                                                <span className="font-medium">
                                                    {new Date(todayAttendance.check_out_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        )}
                                    </>
                                )}
                                <div className="pt-4 border-t border-gray-100">
                                    <div className="text-sm text-gray-500 mb-1">Work Hours Today</div>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {todayAttendance && todayAttendance.check_out_time
                                            ? calculateDuration(todayAttendance.check_in_time, todayAttendance.check_out_time)
                                            : isActive
                                                ? <SessionTimer startTime={activeSession.checkin_time} />
                                                : '--:--:--'
                                        }
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Quick Tips */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <Zap className="w-4 h-4 text-blue-600" />
                                </div>
                                <h3 className="font-bold text-gray-900">Quick Tips</h3>
                            </div>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-2 text-sm text-gray-600">
                                    <Target className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                    Remember to check in when arriving at your station
                                </li>
                                <li className="flex items-start gap-2 text-sm text-gray-600">
                                    <Briefcase className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                    Always check out at the end of your shift
                                </li>
                                <li className="flex items-start gap-2 text-sm text-gray-600">
                                    <MapPin className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                    Ensure you're at the correct station location
                                </li>
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EmployeeDashboard;