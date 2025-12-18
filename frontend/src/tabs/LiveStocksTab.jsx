'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import ExpandableFuelGrid from '../components/ExpandableFuelGrid';
import { Fuel, RefreshCw } from 'lucide-react';

const LiveStocksTab = () => {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchStocks = async () => {
        setIsRefreshing(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:3001/api/fuel/stocks', {
                headers: { 'x-auth-token': token },
            });
            setStocks(res.data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Failed to load fuel stocks');
            if (err.response && err.response.status === 401) {
                setError('Session expired. Please login again.');
            }
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchStocks();
        const interval = setInterval(fetchStocks, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading && !isRefreshing) {
        return (
            <div className="flex items-center justify-center h-96">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                    className="w-16 h-16 rounded-full border-4 border-t-emerald-500 border-r-teal-500 border-b-cyan-500 border-l-transparent"
                />
                <p className="ml-6 text-xl font-light text-[#515154]">Syncing fuel levels...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20 bg-white/50 backdrop-blur-xl rounded-3xl border border-white/60">
                <Fuel className="w-20 h-20 mx-auto text-rose-500/30 mb-6" />
                <p className="text-xl font-light text-[#515154]">{error}</p>
                {error.includes('Session expired') ? (
                    <button
                        onClick={() => window.location.href = '/'}
                        className="mt-6 px-8 py-4 bg-black text-white rounded-2xl font-medium hover:shadow-2xl transition-all hover:scale-105"
                    >
                        Login Again
                    </button>
                ) : (
                    <button
                        onClick={fetchStocks}
                        className="mt-6 px-8 py-4 bg-black text-white rounded-2xl font-medium hover:shadow-2xl transition-all hover:scale-105"
                    >
                        Try Again
                    </button>
                )}
            </div>
        );
    }

    return (
        <>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-5xl font-light tracking-tight text-[#1D1D1F]">
                            Live Fuel Intelligence
                        </h2>
                        <p className="text-xl text-[#515154] mt-3">
                            Real-time tank monitoring • 30-second sync • AI-driven alerts
                        </p>
                    </div>

                    {/* Refresh Button – Tesla-style */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={fetchStocks}
                        disabled={isRefreshing}
                        className="group relative overflow-hidden rounded-2xl bg-black px-8 py-5 shadow-xl transition-all hover:shadow-2xl"
                    >
                        <span className="relative z-10 flex items-center gap-3 text-white font-medium">
                            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                            {isRefreshing ? 'Syncing...' : 'Refresh Now'}
                        </span>
                        {/* Shine sweep */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                    </motion.button>
                </div>
            </motion.div>

            {/* Expandable Fuel Grid */}
            <ExpandableFuelGrid stocks={stocks} />

            {/* Live Indicator Footer */}
            <div className="mt-16 flex items-center justify-center gap-4 text-sm text-[#86868B]">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50" />
                    <span>Live Sync Active</span>
                </div>
                <span>•</span>
                <span>Last updated {new Date().toLocaleTimeString()}</span>
            </div>
        </>
    );
};

export default LiveStocksTab;