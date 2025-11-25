import { useState } from 'react';

const LiveStockCard = ({ stock }) => {
    const { fuel_type, current_level, capacity, percentage, last_updated } = stock;
    const [isHovered, setIsHovered] = useState(false);

    // Premium color scheme - minimal and elegant
    let gradientClass = 'from-emerald-400/20 to-teal-400/20';
    let accentColor = 'bg-gradient-to-r from-emerald-400 to-teal-400';
    let glowColor = 'shadow-emerald-500/20';
    let textAccent = 'text-emerald-600';
    let ringColor = 'ring-emerald-500/10';

    if (percentage < 20) {
        gradientClass = 'from-rose-400/20 to-red-400/20';
        accentColor = 'bg-gradient-to-r from-rose-400 to-red-400';
        glowColor = 'shadow-rose-500/20';
        textAccent = 'text-rose-600';
        ringColor = 'ring-rose-500/10';
    } else if (percentage < 50) {
        gradientClass = 'from-amber-400/20 to-orange-400/20';
        accentColor = 'bg-gradient-to-r from-amber-400 to-orange-400';
        glowColor = 'shadow-amber-500/20';
        textAccent = 'text-amber-600';
        ringColor = 'ring-amber-500/10';
    }

    const formatFuelType = (type) => {
        return type.replace('_', ' ').toUpperCase();
    };

    return (
        <div
            className="group relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Glass-morphism card with premium shadows */}
            <div className={`
                relative overflow-hidden
                bg-white/80 backdrop-blur-xl
                rounded-3xl
                border border-gray-100/50
                shadow-[0_8px_30px_rgb(0,0,0,0.04)]
                hover:shadow-[0_20px_60px_rgb(0,0,0,0.08)]
                transition-all duration-700 ease-out
                ${isHovered ? 'scale-[1.02] -translate-y-1' : 'scale-100'}
                ring-1 ${ringColor}
                p-8
            `}>
                {/* Subtle gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>

                {/* Content */}
                <div className="relative z-10">
                    {/* Header Section */}
                    <div className="flex justify-between items-start mb-8">
                        <div className="space-y-2">
                            <h3 className="font-light text-2xl tracking-tight text-gray-900 transition-all duration-300">
                                {formatFuelType(fuel_type)}
                            </h3>
                            <p className="text-sm font-light text-gray-400 tracking-wide">
                                Capacity {capacity}L
                            </p>
                        </div>

                        {/* Premium percentage badge */}
                        <div className={`
                            relative px-4 py-2 rounded-full
                            bg-gradient-to-br ${gradientClass}
                            backdrop-blur-sm
                            border border-white/40
                            shadow-lg ${glowColor}
                            transition-all duration-500
                            ${isHovered ? 'scale-110 rotate-3' : 'scale-100'}
                        `}>
                            <span className={`text-sm font-medium ${textAccent} tracking-tight`}>
                                {percentage}%
                            </span>
                        </div>
                    </div>

                    {/* Current Level Display */}
                    <div className="mb-6 space-y-3">
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-extralight text-gray-900 tracking-tight">
                                {current_level}
                            </span>
                            <span className="text-lg font-light text-gray-400">L</span>
                        </div>
                        <p className="text-xs font-light text-gray-400 tracking-wide uppercase">
                            Available
                        </p>
                    </div>

                    {/* Premium Progress Bar */}
                    <div className="relative mb-8">
                        {/* Track */}
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden backdrop-blur-sm">
                            {/* Animated fill with gradient */}
                            <div
                                style={{ width: `${percentage}%` }}
                                className={`
                                    h-full ${accentColor} rounded-full
                                    shadow-lg ${glowColor}
                                    transition-all duration-1000 ease-out
                                    relative overflow-hidden
                                `}
                            >
                                {/* Shimmer effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                            </div>
                        </div>

                        {/* Percentage markers */}
                        <div className="flex justify-between mt-2 px-1">
                            <span className="text-[10px] font-light text-gray-300">0%</span>
                            <span className="text-[10px] font-light text-gray-300">50%</span>
                            <span className="text-[10px] font-light text-gray-300">100%</span>
                        </div>
                    </div>

                    {/* Footer Section */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100/50">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-pulse"></div>
                            <span className="text-xs font-light text-gray-400 tracking-wide">
                                {new Date(last_updated).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                        </div>

                        {/* Low stock warning with smooth animation */}
                        {percentage < 20 && (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-100 animate-pulse-subtle">
                                <svg className="w-3.5 h-3.5 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span className="text-xs font-medium text-rose-600 tracking-tight">
                                    Low Stock
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Decorative corner accent */}
                <div className={`
                    absolute -top-12 -right-12 w-24 h-24 
                    bg-gradient-to-br ${gradientClass}
                    rounded-full blur-3xl
                    opacity-0 group-hover:opacity-60
                    transition-opacity duration-700
                `}></div>
            </div>
        </div>
    );
};

export default LiveStockCard;
