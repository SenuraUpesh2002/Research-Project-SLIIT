'use client';

import { motion } from 'framer-motion';
import { Brain, Users, Zap } from 'lucide-react';

const StaffingRecommendation = ({ recommendation }) => {
    const { recommended_staff, confidence, shift, predicted_demand } = recommendation;

    return (
        <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            whileHover={{
                y: -8,
                transition: { duration: 0.5 }
            }}
            className="group relative overflow-hidden"
        >
            {/* Premium Glass Card */}
            <div className="relative bg-white/80 backdrop-blur-3xl rounded-3xl border border-white/70 shadow-2xl ring-1 ring-white/50 p-10 hover:shadow-3xl transition-all duration-700">

                {/* Floating Gradient Orb – Tesla DNA */}
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.4, 0.7, 0.4]
                    }}
                    transition={{ repeat: Infinity, duration: 10 }}
                    className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-400/30 via-purple-400/20 to-pink-400/10 blur-3xl"
                />

                {/* Header */}
                <div className="relative z-10 flex justify-between items-start mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl">
                                <Brain className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-3xl font-light tracking-tight text-[#1D1D1F]">
                                AI Staffing Intelligence
                            </h3>
                        </div>
                        <p className="text-lg text-[#515154] font-light">
                            Optimized for <span className="font-medium text-[#1D1D1F]">{shift}</span>
                        </p>
                    </div>

                    {/* Confidence Badge – Premium Pill */}
                    <div className="px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium text-sm shadow-lg backdrop-blur-xl border border-white/30">
                        {confidence} Confidence
                    </div>
                </div>

                {/* Recommended Staff – Hero Number */}
                <div className="mb-10">
                    <div className="flex items-end gap-4">
                        <motion.span
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                            className="text-8xl font-extralight tracking-tighter text-[#1D1D1F]"
                        >
                            {recommended_staff}
                        </motion.span>
                        <span className="text-3xl font-light text-[#515154] mb-4">Employees</span>
                    </div>
                    <p className="text-lg text-[#86868B] mt-3 font-light">
                        Recommended for peak efficiency
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-inner">
                        <div className="flex items-center gap-3 mb-2">
                            <Zap className="w-5 h-5 text-purple-600" />
                            <p className="text-sm font-medium text-[#515154] uppercase tracking-wider">Predicted Demand</p>
                        </div>
                        <p className="text-3xl font-extralight text-[#1D1D1F] tracking-tight">
                            {predicted_demand.toLocaleString()} <span className="text-xl text-[#86868B]">L</span>
                        </p>
                    </div>

                    <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-inner">
                        <div className="flex items-center gap-3 mb-2">
                            <Users className="w-5 h-5 text-emerald-600" />
                            <p className="text-sm font-medium text-[#515154] uppercase tracking-wider">Est. Wait Time</p>
                        </div>
                        <p className="text-3xl font-extralight text-[#1D1D1F] tracking-tight">
                            ~4 <span className="text-xl text-[#86868B]">min</span>
                        </p>
                    </div>
                </div>

                {/* Footer Insight */}
                <div className="pt-6 border-t border-white/40">
                    <p className="text-sm font-light text-[#64748B] text-center leading-relaxed">
                        Powered by neural forecasting • Historical trends • Weather • Traffic patterns
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default StaffingRecommendation;