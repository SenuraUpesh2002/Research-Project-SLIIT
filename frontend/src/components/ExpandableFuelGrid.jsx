'use client';

import { motion } from 'framer-motion';

const ExpandableFuelGrid = ({ stocks = [] }) => {
    // Safely convert to number (fixes toFixed error)
    const toNumber = (val) => {
        const num = parseFloat(val);
        return isNaN(num) ? 0 : num;
    };

    const getColorScheme = (percentage) => {
        const p = toNumber(percentage);
        if (p < 25)
            return { accent: 'from-rose-500 to-red-600', glow: 'shadow-rose-500/50', text: 'text-rose-600' };
        if (p < 60)
            return { accent: 'from-amber-500 to-orange-600', glow: 'shadow-amber-500/50', text: 'text-amber-600' };
        return { accent: 'from-emerald-500 to-teal-600', glow: 'shadow-emerald-500/50', text: 'text-emerald-600' };
    };

    const formatFuelType = (type) => (type || 'Fuel').replace('_', ' ').toUpperCase();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stocks.map((stock) => {
                const currentLevel = toNumber(stock.current_level);
                const capacity = toNumber(stock.capacity);
                const percentage = capacity > 0 ? Math.round((currentLevel / capacity) * 100) : 0;
                const colors = getColorScheme(percentage);

                return (
                    <motion.div
                        key={stock.id}
                        className="relative h-full overflow-hidden rounded-3xl bg-white/85 backdrop-blur-3xl border border-white/60 shadow-2xl ring-1 ring-white/50"
                        whileHover={{ y: -8 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Glow orb */}
                        <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br ${colors.accent} blur-3xl opacity-30`} />

                        <div className="relative z-10 h-full flex flex-col p-8">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-light tracking-tight text-[#1D1D1F] text-3xl">
                                        {formatFuelType(stock.fuel_type)}
                                    </h3>
                                    <p className="text-[#515154] font-light mt-2 text-lg">
                                        {capacity.toLocaleString()}L Capacity
                                    </p>
                                </div>

                                <div className={`px-5 py-3 rounded-full bg-gradient-to-r ${colors.accent} text-white font-bold shadow-lg ${colors.glow}`}>
                                    {percentage}%
                                </div>
                            </div>

                            <div className="mt-8">
                                <div className="flex items-end gap-3 mb-3">
                                    <span className="text-6xl font-extralight text-[#1D1D1F] tracking-tighter">
                                        {Math.round(currentLevel).toLocaleString()}
                                    </span>
                                    <span className="text-2xl text-[#515154] mb-2">L</span>
                                </div>
                                <p className="text-sm text-[#86868B] uppercase tracking-wider">
                                    Available
                                </p>
                            </div>

                            <div className="mt-8">
                                <div className="h-3 bg-white/60 rounded-full overflow-hidden shadow-inner">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percentage}%` }}
                                        transition={{ duration: 1.4, ease: 'easeOut' }}
                                        className={`h-full bg-gradient-to-r ${colors.accent} rounded-full ${colors.glow}`}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default ExpandableFuelGrid;