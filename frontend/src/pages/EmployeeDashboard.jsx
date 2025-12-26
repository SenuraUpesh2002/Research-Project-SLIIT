'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useActiveEmployees } from '../hooks/useEmployeeData';
import { toast } from 'sonner';
import { attendanceService } from '../services/api';
import { motion } from 'framer-motion';
import { QrCode, Clock, MapPin, CheckCircle, Fuel, LogOut } from 'lucide-react';
import Navbar from '../components/Navbar';
import { formatDate } from '../utils/date';

const EmployeeDashboard = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const { data: activeEmployees = [], isLoading: employeesLoading } = useActiveEmployees();
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleCheckOut = async () => {
        try {
            await attendanceService.checkOut();
            toast.success('Checked out successfully');
            setTimeout(() => window.location.reload(), 1000);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Check-out failed');
        }
    };

    if (authLoading || employeesLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const isActive = activeEmployees.some(emp => emp.id === user?.id || emp.email === user?.email);
    const activeSession = activeEmployees.find(emp => emp.id === user?.id || emp.email === user?.email);

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 pt-24 pb-12">
                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-gray-900">
                        Hello, {user?.name?.split(' ')[0]}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Here's your activity overview for today.
                    </p>
                </motion.div>

                {/* Status Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8"
                >
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'
                                }`}>
                                {isActive ? <CheckCircle className="w-8 h-8" /> : <Clock className="w-8 h-8" />}
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Current Status
                                </h2>
                                <p className={`text-lg font-medium ${isActive ? 'text-emerald-600' : 'text-gray-500'}`}>
                                    {isActive ? 'Active Shift' : 'Not Checked In'}
                                </p>
                            </div>
                        </div>

                        {isActive && activeSession && (
                            <div className="bg-gray-50 rounded-2xl p-4 flex gap-8">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Check-in Time</p>
                                    <p className="font-semibold text-gray-900">
                                        {new Date(activeSession.checkin_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Shift</p>
                                    <p className="font-semibold text-gray-900 capitalize">
                                        {activeSession.shift_type}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Actions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Check In / Out Card */}
                    {isActive ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            onClick={handleCheckOut}
                            className="group cursor-pointer relative overflow-hidden bg-gradient-to-br from-red-600 to-rose-700 rounded-3xl p-8 text-white shadow-xl shadow-red-500/20 hover:shadow-2xl hover:shadow-red-500/30 transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full translate-y-12 -translate-x-8" />

                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6">
                                    <LogOut className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Check Out</h3>
                                <p className="text-red-100">End your current shift</p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            onClick={() => navigate('/mobile-checkin')}
                            className="group cursor-pointer relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full translate-y-12 -translate-x-8" />

                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6">
                                    <QrCode className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Mobile Check-In</h3>
                                <p className="text-blue-100">Scan QR code to start your shift</p>
                            </div>
                        </motion.div>
                    )}

                    {/* Quick Stats / Info Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm"
                    >
                        <div className="flex items-start justify-between mb-8">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Today's Date</p>
                                <h3 className="text-xl font-bold text-gray-900 mt-1">
                                    {formatDate(currentTime)}
                                </h3>
                            </div>
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                <Fuel className="w-5 h-5 text-orange-600" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                <MapPin className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Assigned Station</p>
                                    <p className="text-sm font-medium text-gray-900">GAM-0001-07</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default EmployeeDashboard;
