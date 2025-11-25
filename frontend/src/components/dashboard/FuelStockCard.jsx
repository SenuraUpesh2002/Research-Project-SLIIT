// import { Fuel, Clock, AlertCircle } from 'lucide-react';
// import { getTimeAgo, getStatusFromLevel, getProgressColor } from '../../utils/helpers';

// export const FuelStockCard = ({ stock }) => {
//   const percentage = (stock.level / stock.capacity) * 100;
//   const status = getStatusFromLevel(stock.level, stock.capacity);
//   const progressColor = getProgressColor(percentage);

//   return (
//     <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border border-gray-700 hover:border-blue-500 transition-all">
//       {/* Header: Icon + Type + Status */}
//       <div className="flex items-start justify-between mb-4">
//         <div className="flex items-center gap-3">
//           <div className="p-3 bg-blue-500/20 rounded-lg">
//             <Fuel className="text-blue-400" size={24} />
//           </div>
//           <div>
//             <h3 className="text-lg font-semibold text-white">{stock.type}</h3>
//             <p className="text-sm text-gray-400">Tank {stock.id}</p>
//           </div>
//         </div>

//         <span
//           className={`px-3 py-1 rounded-full text-xs font-medium ${
//             status === 'Available'
//               ? 'bg-green-500/20 text-green-400'
//               : status === 'Low Stock'
//               ? 'bg-yellow-500/20 text-yellow-400'
//               : 'bg-red-500/20 text-red-400'
//           }`}
//         >
//           {status}
//         </span>
//       </div>

//       {/* Level & Progress */}
//       <div className="space-y-2">
//         <div className="flex items-baseline gap-2">
//           <span className="text-3xl font-bold text-white">
//             {Math.round(stock.level).toLocaleString('en-US')}
//           </span>
//           <span className="text-sm text-gray-400">
//             / {stock.capacity.toLocaleString('en-US')} L
//           </span>
//         </div>

//         <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
//           <div
//             className={`${progressColor} h-full rounded-full transition-all duration-500`}
//             style={{ width: `${percentage}%` }}
//           />
//         </div>

//         <div className="flex items-center justify-between text-sm">
//           <span className="text-gray-400">{percentage.toFixed(1)}% Full</span>
//           <div className="flex items-center gap-1 text-gray-400">
//             <Clock size={14} />
//             <span>{getTimeAgo(stock.lastUpdated)}</span>
//           </div>
//         </div>
//       </div>

//       {/* Low Stock Alert */}
//       {percentage < 20 && (
//         <div className="mt-4 flex items-center gap-2 text-sm text-yellow-400 bg-yellow-500/10 rounded-lg p-3">
//           <AlertCircle size={16} />
//           <span>Refill recommended soon</span>
//         </div>
//       )}
//     </div>
//   );
// };

// src/components/dashboard/FuelStockCard.jsx

import { Fuel, Clock, AlertCircle } from 'lucide-react';
import { getTimeAgo } from '../../utils/helpers';

export const FuelStockCard = ({ stock }) => {
  const percentage = (stock.level / stock.capacity) * 100;
  const isLow = percentage < 20;
  const isCritical = percentage < 10;

  return (
    <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900/80 to-black/40 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-500 hover:border-white/20 hover:shadow-3xl hover:-translate-y-2">
      {/* Subtle glass overlay on hover */}
      <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-all duration-700" />

      <div className="relative p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-blue-500/10 backdrop-blur-md border border-blue-500/20">
              <Fuel className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white tracking-tight">{stock.type}</h3>
              <p className="text-sm text-gray-500 mt-1">Tank {stock.id}</p>
            </div>
          </div>

          <span
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider border ${
              percentage > 50
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                : percentage > 20
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
            }`}
          >
            {percentage > 50 ? 'Healthy' : percentage > 20 ? 'Low' : 'Critical'}
          </span>
        </div>

        {/* Big Level */}
        <div className="mb-6">
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-bold text-white tabular-nums">
              {Math.round(stock.level).toLocaleString()}
            </span>
            <span className="text-xl text-gray-500">L</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            of {stock.capacity.toLocaleString()} L capacity
          </p>
        </div>

        {/* Smooth CSS-only animated progress bar */}
        <div className="relative h-4 bg-black/40 rounded-full overflow-hidden border border-white/10 mb-4">
          <div
            className={`absolute inset-y-0 left-0 transition-all duration-1000 ease-out ${
              percentage > 50
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                : percentage > 20
                ? 'bg-gradient-to-r from-amber-500 to-orange-400'
                : 'bg-gradient-to-r from-rose-600 to-rose-500'
            } shadow-lg`}
            style={{
              width: `${percentage}%`,
              boxShadow: `0 0 30px 5px ${
                percentage > 50 ? '#10b98180' : percentage > 20 ? '#f59e0b80' : '#ef444480'
              }`,
            }}
          />
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="font-semibold text-white">{percentage.toFixed(1)}% Full</span>
          <div className="flex items-center gap-2 text-gray-500">
            <Clock className="w-4 h-4" />
            <span>{getTimeAgo(stock.lastUpdated)}</span>
          </div>
        </div>

        {/* Alerts */}
        {isCritical && (
          <div className="mt-6 flex items-center gap-3 text-rose-400 bg-rose-500/10 backdrop-blur-md border border-rose-500/30 rounded-2xl px-4 py-3 animate-pulse">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Immediate refill required</span>
          </div>
        )}
        {isLow && !isCritical && (
          <div className="mt-5 text-amber-400 text-sm font-medium opacity-90">
            Refill recommended soon
          </div>
        )}
      </div>
    </div>
  );
};