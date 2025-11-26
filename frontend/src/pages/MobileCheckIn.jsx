'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Fingerprint, ArrowLeft, CheckCircle2, XCircle, Fuel } from 'lucide-react';

const MobileCheckIn = () => {
    const [scanning, setScanning] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [scannerInstance, setScannerInstance] = useState(null); // ← Fixed: no TS syntax!
    const navigate = useNavigate();

    // Safe user parsing
    let user = null;
    try {
        const userJson = localStorage.getItem('user');
        if (userJson && userJson !== 'null' && userJson !== 'undefined') {
            user = JSON.parse(userJson);
        }
    } catch (e) {
        console.warn('Invalid user data in localStorage');
    }

    // Redirect if not logged in
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    if (!user) return null;

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
                // Ignore scan errors (they're noisy)
            }
        );

        setScannerInstance(scanner); // Save instance for cleanup
    };

    const handleCheckIn = async (qrData) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:3001/api/attendance/checkin',
                {
                    qr_data: qrData,
                    location: { lat: 7.2083, lng: 79.8358 },
                    device_id: 'mobile-' + Date.now(),
                },
                { headers: { 'x-auth-token': token } }
            );

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-6 relative overflow-hidden">
            {/* Animated Background Orbs */}
            <div className="absolute inset-0">
                <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 15 }}
                    className="absolute top-0 left-0 w-96 h-96 rounded-full bg-gradient-to-br from-emerald-500/30 to-teal-500/20 blur-3xl"
                />
                <motion.div
                    animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.7, 0.4] }}
                    transition={{ repeat: Infinity, duration: 18 }}
                    className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-gradient-to-tl from-purple-500/30 to-pink-500/20 blur-3xl"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-lg"
            >
                <div className="bg-white/80 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
                    {/* Header */}
                    <div className="p-10 text-center border-b border-white/30">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                            className="w-28 h-28 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-black to-gray-800 flex items-center justify-center shadow-2xl"
                        >
                            <Fuel className="w-16 h-16 text-white" />
                        </motion.div>
                        <h1 className="text-4xl font-light tracking-tight text-[#1D1D1F] mb-2">
                            Mobile Check-In
                        </h1>
                        <p className="text-xl text-[#515154]">
                            Welcome, <span className="font-medium text-[#1D1D1F]">{user.name}</span>
                        </p>
                    </div>

                    {/* Messages */}
                    <AnimatePresence mode="wait">
                        {message && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="mx-10 mt-8 p-6 bg-emerald-50/90 backdrop-blur-xl rounded-2xl border border-emerald-200 flex items-center gap-4"
                            >
                                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                                <div>
                                    <p className="text-lg font-medium text-emerald-800">{message}</p>
                                    <p className="text-sm text-emerald-600">Redirecting...</p>
                                </div>
                            </motion.div>
                        )}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mx-10 mt-8 p-6 bg-rose-50/90 backdrop-blur-xl rounded-2xl border border-rose-200 flex items-center gap-4"
                            >
                                <XCircle className="w-10 h-10 text-rose-600" />
                                <p className="text-lg font-medium text-rose-800">{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Actions */}
                    {!scanning && !message && (
                        <div className="p-10 space-y-6">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={startScanning}
                                className="w-full bg-black text-white py-6 rounded-2xl font-medium text-lg shadow-2xl flex items-center justify-center gap-4"
                            >
                                <QrCode className="w-7 h-7" />
                                Scan QR Code
                            </motion.button>

                            <div className="text-center text-[#86868B] font-medium">OR</div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleManualCheckIn}
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-6 rounded-2xl font-medium text-lg shadow-2xl flex items-center justify-center gap-4"
                            >
                                <Fingerprint className="w-7 h-7" />
                                Manual Check-In
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/dashboard')}
                                className="w-full bg-white/70 backdrop-blur-xl border border-white/60 text-[#1D1D1F] py-5 rounded-2xl font-medium flex items-center justify-center gap-3"
                            >
                                <ArrowLeft className="w-6 h-6" />
                                Back to Dashboard
                            </motion.button>
                        </div>
                    )}

                    {/* QR Scanner View */}
                    {scanning && (
                        <div className="p-10">
                            <div id="qr-reader" className="rounded-2xl overflow-hidden shadow-2xl border-8 border-white/60" />
                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    scannerInstance?.clear();
                                    setScanning(false);
                                }}
                                className="w-full mt-6 bg-rose-600 text-white py-5 rounded-2xl font-medium shadow-xl"
                            >
                                Cancel Scanning
                            </motion.button>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="px-10 pb-8 text-center">
                        <p className="text-sm text-[#86868B]">
                            Station: <span className="font-medium">GAM-0001-07</span>
                        </p>
                        <p className="text-xs text-[#86868B] mt-2">
                            {new Date().toLocaleString()}
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default MobileCheckIn;