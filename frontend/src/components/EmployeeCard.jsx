'use client';

import { motion } from 'framer-motion';

const EmployeeCard = ({ checkIn }) => {
    const { full_name, emp_code, role, check_in_time, shift_type, status } = checkIn;

    // Premium shift color system – soft, elegant, luxurious
    const shiftColors = {
        morning: { bg: 'from-orange-400/10 to-amber-400/10', border: 'border-orange-400/30', text: 'text-orange-700', glow: 'shadow-orange-500/10' },
        afternoon: { bg: 'from-blue-400/10 to-cyan-400/10', border: 'border-blue-400/30', text: 'text-blue-700', glow: 'shadow-blue-500/10' },
        evening: { bg: 'from-indigo-400/10 to-purple-400/10', border: 'border-indigo-400/30', text: 'text-indigo-700', glow: 'shadow-indigo-500/10' },
        default: { bg: 'from-gray-300/10 to-gray-400/10', border: 'border-gray-400/30', text: 'text-gray-700', glow: 'shadow-gray-500/10' },
    };

    const colors = shiftColors[shift_type] || shiftColors.default;

    const formatTime = (dateString) =>
        new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

    const getDuration = (startTime) => {
        const diff = Math.floor((Date.now() - new Date(startTime).getTime()) / 60000);
        const hours = Math.floor(diff / 60);
        const mins = diff % 60;
        return `${hours}h ${mins}m`;
    };

    return (
        <motion.div
            whileHover={{ y: -6, transition: { duration: 0.5, ease: "easeOut" } }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="group relative"
        >
            {/* Floating Glass Card */}
            <div className={`
        relative overflow-hidden
        bg-white/75 backdrop-blur-2xl
        rounded-3xl
        border border-white/60
        shadow-2xl hover:shadow-3xl
        ring-1 ring-white/50
        p-8
        transition-all duration-700 ease-out
        group-hover:scale-[1.02]
      `}>
                {/* Dynamic Shift Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-1000`} />

                {/* Floating Orb Accent */}
                <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
                    transition={{ repeat: Infinity, duration: 8 }}
                    className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl ${colors.bg} opacity-40`}
                />

                <div className="relative z-10 flex items-center justify-between">
                    {/* Left: Avatar + Info */}
                    <div className="flex items-center space-x-6">
                        {/* Premium Avatar */}
                        <div className="relative">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-inner border border-white/60">
                                <span className="text-2xl font-light text-[#1D1D1F]">
                                    {full_name.charAt(0)}
                                </span>
                            </div>
                            {/* Online Indicator */}
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-white shadow-lg">
                                <div className="absolute inset-1 bg-green-400 rounded-full animate-ping" />
                            </div>
                        </div>

                        {/* Name & Role */}
                        <div>
                            <h4 className="text-2xl font-light tracking-tight text-[#1D1D1F]">
                                {full_name}
                            </h4>
                            <p className="text-sm text-[#86868B] mt-1 tracking-wide">
                                {emp_code} • {role}
                            </p>
                        </div>
                    </div>

                    {/* Right: Status & Timing */}
                    <div className="flex items-center space-x-10">
                        {/* Check-in Time */}
                        <div className="text-right">
                            <p className="text-xs uppercase tracking-wider text-[#86868B]">Check-in</p>
                            <p className="text-2xl font-extralight text-[#1D1D1F] mt-1">
                                {formatTime(check_in_time)}
                            </p>
                        </div>

                        {/* Duration */}
                        <div className="text-right hidden lg:block">
                            <p className="text-xs uppercase tracking-wider text-[#86868B]">Duration</p>
                            <p className="text-2xl font-extralight text-[#1D1D1F] mt-1">
                                {getDuration(check_in_time)}
                            </p>
                        </div>

                        {/* Shift Badge – Premium Pill */}
                        <div className={`
              px-5 py-2.5 rounded-full
              bg-white/80 backdrop-blur-xl
              border ${colors.border}
              shadow-lg ${colors.glow}
              ring-1 ring-white/50
            `}>
                            <span className={`text-sm font-medium ${colors.text} capitalize tracking-wide`}>
                                {shift_type} Shift
                            </span>
                        </div>

                        {/* Live Status */}
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg shadow-green-500/50 animate-pulse" />
                                <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping" />
                            </div>
                            <span className="text-sm font-medium text-green-600 tracking-tight">
                                Active
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default EmployeeCard;