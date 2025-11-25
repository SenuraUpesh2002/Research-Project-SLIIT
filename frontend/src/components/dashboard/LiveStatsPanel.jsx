// import { RefreshCw, Activity, TrendingDown, Clock as ClockIcon } from 'lucide-react';
// import { FuelStockCard } from './FuelStockCard';
// import { StockChart } from './StockChart';
// import { LoadingSpinner } from '../common/LoadingSpinner';
// import { useFuelData } from '../../hooks/useFuelData';
// import { getTimeAgo } from '../../utils/helpers';

// export const LiveStatsPanel = () => {
//   const { fuelData, chartData, loading, lastUpdate, refreshData } = useFuelData();

//   const totalCapacity = fuelData.reduce((sum, stock) => sum + stock.capacity, 0);
//   const totalLevel = fuelData.reduce((sum, stock) => sum + stock.level, 0);
//   const avgConsumption = 450; // Liters per hour

//   return (
//     <div className="space-y-6">
//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-4 text-white">
//           <div className="flex items-center gap-2 mb-2">
//             <Activity size={20} />
//             <span className="text-sm opacity-80">Total Stations</span>
//           </div>
//           <p className="text-3xl font-bold">1</p>
//           <p className="text-xs opacity-70 mt-1">Central Station Active</p>
//         </div>

//         <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg p-4 text-white">
//           <div className="flex items-center gap-2 mb-2">
//             <TrendingDown size={20} />
//             <span className="text-sm opacity-80">Avg Consumption</span>
//           </div>
//           <p className="text-3xl font-bold">{avgConsumption}L</p>
//           <p className="text-xs opacity-70 mt-1">Per hour (all fuels)</p>
//         </div>

//         <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-lg p-4 text-white">
//           <div className="flex items-center gap-2 mb-2">
//             <ClockIcon size={20} />
//             <span className="text-sm opacity-80">Est. Runtime</span>
//           </div>
//           <p className="text-3xl font-bold">
//             {Math.round(totalLevel / avgConsumption)}h
//           </p>
//           <p className="text-xs opacity-70 mt-1">Until refill needed</p>
//         </div>

//         <div className="bg-gradient-to-br from-orange-900 to-orange-800 rounded-lg p-4 text-white">
//           <div className="flex items-center gap-2 mb-2">
//             <Activity size={20} className="animate-pulse" />
//             <span className="text-sm opacity-80">Live Monitoring</span>
//           </div>
//           <p className="text-lg font-bold">{getTimeAgo(lastUpdate)}</p>
//           <button
//             onClick={refreshData}
//             disabled={loading}
//             className="mt-2 flex items-center gap-1 text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded transition-colors disabled:opacity-50"
//           >
//             <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
//             Refresh
//           </button>
//         </div>
//       </div>

//       {/* Loading State */}
//       {loading && (
//         <div className="flex justify-center py-8">
//           <LoadingSpinner size={32} text="Updating fuel levels..." />
//         </div>
//       )}

//       {/* Fuel Stock Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {fuelData.map(stock => (
//           <FuelStockCard key={stock.id} stock={stock} />
//         ))}
//       </div>

//       {/* Chart */}
//       <StockChart data={chartData} />
//     </div>
//   );
// };
// src/components/dashboard/LiveStatsPanel.jsx

import { Activity, TrendingDown, Clock as ClockIcon, RefreshCw } from 'lucide-react';
import { FuelStockCard } from './FuelStockCard';
import { StockChart } from './StockChart';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { useFuelData } from '../../hooks/useFuelData';
import { getTimeAgo } from '../../utils/helpers';

export const LiveStatsPanel = () => {
  const { fuelData, chartData, loading, lastUpdate, refreshData } = useFuelData();

  const totalCapacity = fuelData.reduce((sum, s) => sum + s.capacity, 0);
  const totalLevel = fuelData.reduce((sum, s) => sum + s.level, 0);
  const avgConsumption = 450; // L/h

  const stats = [
    { label: "Total Stations", value: "1", subtitle: "Central Station Active", icon: Activity, gradient: "from-cyan-500 to-blue-600" },
    { label: "Avg Consumption", value: "450L", subtitle: "Per hour (all fuels)", icon: TrendingDown, gradient: "from-purple-500 to-pink-600" },
    { label: "Est. Runtime", value: `${Math.round(totalLevel / avgConsumption)}h`, subtitle: "Until refill needed", icon: ClockIcon, gradient: "from-emerald-500 to-teal-600" },
    { label: "Live Status", value: getTimeAgo(lastUpdate), subtitle: loading ? "Updating..." : "Real-time", icon: Activity, gradient: "from-orange-500 to-red-600", pulse: true },
  ];

  return (
    <div className="space-y-10">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="group relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 transition-all duration-500 hover:border-white/30 hover:-translate-y-2 hover:shadow-2xl"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-20 group-hover:opacity-40 transition-opacity duration-700`} />
            
            <div className="relative">
              <div className="flex items-center gap-4 mb-5">
                <div className={`p-3 rounded-2xl bg-white/10 backdrop-blur-md ${stat.pulse && 'animate-pulse'}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-400 tracking-wider">{stat.label}</span>
              </div>
              
              <p className="text-4xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.subtitle}</p>
            </div>

            {stat.label === "Live Status" && (
              <button
                onClick={refreshData}
                disabled={loading}
                className="mt-6 w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-sm font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                Refresh Now
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner size={40} text="Updating fuel levels..." />
        </div>
      )}

      {/* Fuel Stock Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {fuelData.map(stock => (
          <FuelStockCard key={stock.id} stock={stock} />
        ))}
      </div>

      {/* Chart */}
      <StockChart data={chartData} />
    </div>
  );
};