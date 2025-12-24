'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import LiveStocksTab from '../tabs/LiveStocksTab';
import EmployeeDetailsTab from '../tabs/EmployeeDetailsTab';
import PredictionsTab from '../tabs/PredictionsTab';
import QRCodeDisplay from '../components/QRCodeDisplay';
import { formatDate } from '../utils/date';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('stocks');

    const tabs = [
        { id: 'stocks', label: 'Live Stocks' },
        { id: 'employees', label: 'Employee Details' },
        { id: 'predictions', label: 'AI Predictions' },
    ];

    return (
        <>
            {/* Global Smooth Scroll & Font */}
            <div className="min-h-screen bg-gradient-to-b from-white to-[#F5F5F7] font-['-apple-system',_system-ui,_BlinkMacSystemFont,'Segoe_UI',_Roboto,_sans-serif] antialiased">

                <Navbar />

                <main className="max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-32">

                    {/* HERO SECTION – Equal Height Cards */}
                    <AnimatePresence>
                        {activeTab === 'stocks' && (
                            <motion.div
                                key="hero"
                                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginBottom: 96 }}
                                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                style={{ overflow: 'hidden' }}
                                className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:h-[420px]"
                            >

                                {/* Dashboard Overview Card – Full Height */}
                                <div className="lg:col-span-2 h-full">
                                    <div className="relative h-full overflow-hidden rounded-3xl bg-white/75 backdrop-blur-2xl border border-white/50 shadow-2xl flex items-center">
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent" />
                                        <div className="relative p-12 lg:p-16 w-full">
                                            <h1 className="text-5xl lg:text-7xl font-black text-[#1D1D1F] tracking-tight leading-none">
                                                Dashboard Overview
                                            </h1>
                                            <p className="mt-6 text-lg lg:text-2xl text-[#515154] leading-relaxed max-w-4xl">
                                                Welcome back. Real-time insights, intelligent predictions, and full control — all in one place.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* QR Code Card – Full Height & Perfectly Aligned */}
                                <div className="h-full flex items-center justify-center">
                                    <div className="w-full h-full max-w-sm flex flex-col justify-center items-center p-10 bg-white/70 backdrop-blur-2xl rounded-3xl border border-white/60 shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all duration-700">

                                        <div className="p-8 bg-white/90 backdrop-blur-xl rounded-2xl shadow-inner border border-white/70 mb-8">
                                            <QRCodeDisplay />
                                        </div>

                                        <div className="text-center space-y-3">
                                            <p className="text-sm font-semibold text-[#1D1D1F]/90 tracking-wide">
                                                Daily Staff Check-in
                                            </p>
                                            <p className="text-xs text-[#86868B] uppercase tracking-wider">
                                                Scan to Access Station
                                            </p>
                                            <p className="text-xs font-mono text-[#515154] bg-[#F2F2F7] px-3 py-1 rounded-full inline-block">
                                                {formatDate(new Date(), { year: 'numeric', month: 'numeric', day: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Elegant Floating Tab Navigation */}
                    <div className="flex justify-center mb-16">
                        <nav className="inline-flex bg-white/70 backdrop-blur-2xl rounded-full border border-white/50 shadow-2xl p-3">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className="relative px-10 py-5 rounded-full text-lg font-medium transition-all duration-300"
                                >
                                    {activeTab === tab.id && (
                                        <motion.div
                                            layoutId="activePill"
                                            className="absolute inset-0 bg-black rounded-full"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <span
                                        className={`relative z-10 transition-colors duration-300 ${activeTab === tab.id ? 'text-white' : 'text-[#1D1D1F]'
                                            }`}
                                    >
                                        {tab.label}
                                    </span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content – Glass Container */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                            <div className="bg-white/75 backdrop-blur-2xl rounded-3xl border border-white/50 shadow-2xl overflow-hidden">
                                <div className="p-10 lg:p-16 min-h-[500px]">
                                    {activeTab === 'stocks' && <LiveStocksTab />}
                                    {activeTab === 'employees' && <EmployeeDetailsTab />}
                                    {activeTab === 'predictions' && <PredictionsTab />}
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                </main>
            </div>
        </>
    );
};

export default Dashboard;