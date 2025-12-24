'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { attendanceService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatTime, formatDate } from '../utils/date';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Fingerprint, ArrowLeft, CheckCircle2, XCircle, Fuel, MapPin, Clock } from 'lucide-react';

const MobileCheckIn = () => {
    const [scanning, setScanning] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [scannerInstance, setScannerInstance] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const navigate = useNavigate();
    const { user } = useAuth();


    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);



    const startScanning = () => {
        setScanning(true);
        setMessage('');
        setError('');

        const scanner = new Html5QrcodeScanner(
            'qr-reader',
            {
                qrbox: { width: 280, height: 280 },
                fps: 10,
                aspectRatio: 1,
                showZoomSliderIfSupported: true,
                showTorchButtonIfSupported: true,
            },
            false
        );

        scanner.render(
            (decodedText) => {
                scanner.clear();
                setScanning(false);
                handleCheckIn(decodedText);
            },
            () => {
                // Ignore scan errors
            }
        );

        setScannerInstance(scanner);
    };

    const handleCheckIn = async (qrData) => {
        try {
            await attendanceService.checkIn({
                qr_data: qrData,
                location: { lat: 7.2083, lng: 79.8358 },
                device_id: 'mobile-' + Date.now(),
            });

            setMessage('Check-in successful!');
            setTimeout(() => navigate('/dashboard'), 2500);
        } catch (err) {
            setError(err.response?.data?.message || 'Check-in failed');
        }
    };

    const handleManualCheckIn = () => handleCheckIn('MANUAL_CHECKIN');

    // Cleanup scanner on unmount
    useEffect(() => {
        return () => {
            if (scannerInstance) {
                scannerInstance.clear().catch(() => { });
            }
        };
    }, [scannerInstance]);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
            {/* Professional Background Pattern */}
            <div className="absolute inset-0">
                {/* Subtle gradient overlays */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/5 via-transparent to-violet-600/5" />

                {/* Geometric patterns */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `
                            linear-gradient(30deg, transparent 48%, rgba(255,255,255,0.05) 48%, rgba(255,255,255,0.05) 52%, transparent 52%),
                            linear-gradient(-30deg, transparent 48%, rgba(255,255,255,0.05) 48%, rgba(255,255,255,0.05) 52%, transparent 52%)
                        `,
                        backgroundSize: '50px 50px'
                    }}
                />

                {/* Grid overlay */}
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '100px 100px'
                    }}
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">

                    {/* Header Section */}
                    <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-center">
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl" />

                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 20,
                                delay: 0.2
                            }}
                            className="relative inline-block mb-6"
                        >
                            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                                <Fuel className="w-10 h-10 text-slate-900" />
                            </div>
                            {/* Pulse effect */}
                            <div className="absolute inset-0 bg-white rounded-2xl animate-ping opacity-20" />
                        </motion.div>

                        <h1 className="text-2xl font-bold text-white mb-2">
                            Employee Check-In
                        </h1>
                        <p className="text-slate-300 text-sm">
                            Welcome back, <span className="font-semibold text-white">{user.name}</span>
                        </p>
                    </div>

                    {/* Time & Location Info Bar */}
                    <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-slate-600">
                                <Clock className="w-4 h-4" />
                                <span className="font-medium">{formatTime(currentTime)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                                <MapPin className="w-4 h-4" />
                                <span className="font-medium">GAM-0001-07</span>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 text-center">
                            {formatDate(currentTime)}
                        </p>
                    </div>

                    {/* Status Messages */}
                    <AnimatePresence mode="wait">
                        {message && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="mx-6 mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-emerald-900">{message}</p>
                                        <p className="text-xs text-emerald-700 mt-0.5">Redirecting to dashboard...</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-red-900">Check-in Failed</p>
                                        <p className="text-xs text-red-700 mt-0.5">{error}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Action Buttons */}
                    {!scanning && !message && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="p-6 space-y-4"
                        >
                            {/* Primary Action - QR Scan */}
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={startScanning}
                                aria-label="Start QR Code Scan"
                                className="w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 group"
                            >
                                <QrCode className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                <span>Scan QR Code</span>
                            </motion.button>

                            {/* Divider */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-3 text-slate-500 font-medium">Or</span>
                                </div>
                            </div>

                            {/* Secondary Action - Manual */}
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleManualCheckIn}
                                aria-label="Manual Check-In"
                                className="w-full bg-white border-2 border-slate-300 text-slate-700 py-4 rounded-xl font-semibold hover:border-slate-400 hover:bg-slate-50 transition-all duration-300 flex items-center justify-center gap-3 group"
                            >
                                <Fingerprint className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                <span>Manual Check-In</span>
                            </motion.button>

                            {/* Back Button */}
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/dashboard')}
                                className="w-full bg-slate-100 text-slate-600 py-3 rounded-xl font-medium hover:bg-slate-200 transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Back to Dashboard</span>
                            </motion.button>
                        </motion.div>
                    )}

                    {/* QR Scanner View */}
                    {scanning && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-6"
                        >
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-slate-900 mb-1">Position QR Code</h3>
                                <p className="text-sm text-slate-600">Align the QR code within the frame</p>
                            </div>

                            <div id="qr-reader" className="rounded-xl overflow-hidden shadow-lg border-2 border-slate-200 mb-4" />

                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    scannerInstance?.clear();
                                    setScanning(false);
                                }}
                                className="w-full bg-red-600 text-white py-4 rounded-xl font-semibold hover:bg-red-700 transition-colors duration-200 shadow-lg"
                            >
                                Cancel Scan
                            </motion.button>
                        </motion.div>
                    )}

                    {/* Footer */}
                    <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
                        <p className="text-xs text-center text-slate-500">
                            Secure check-in system • All activities are logged
                        </p>
                    </div>
                </div>

                {/* Help Text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-center text-slate-400 text-xs mt-4 px-4"
                >
                    Need assistance? Contact your supervisor or IT support
                </motion.p>
            </motion.div>
        </div>
    );
};

export default MobileCheckIn;