// // src/components/predictions/RefillTable.jsx
// import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

// // Mock prediction data (LK-realistic)
// const mockPredictions = [
//   {
//     type: 'Diesel',
//     currentStock: 1800,
//     dailyAvg: 450,
//     daysUntilEmpty: 4,
//     refillNeeded: true,
//     suggestedQty: 3200,
//   },
//   {
//     type: 'Petrol 95',
//     currentStock: 3200,
//     dailyAvg: 380,
//     daysUntilEmpty: 8,
//     refillNeeded: false,
//     suggestedQty: 1800,
//   },
//   {
//     type: 'Petrol 92',
//     currentStock: 3900,
//     dailyAvg: 520,
//     daysUntilEmpty: 7,
//     refillNeeded: false,
//     suggestedQty: 1100,
//   },
// ];

// export const RefillTable = () => {
//   // Sort by urgency: lowest daysUntilEmpty first
//   const sortedPredictions = [...mockPredictions].sort((a, b) => a.daysUntilEmpty - b.daysUntilEmpty);

//   return (
//     <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border border-gray-700">
//       {/* Header */}
//       <h3 className="text-xl font-semibold text-white mb-6">Fuel Type Predictions</h3>

//       {/* Responsive Table */}
//       <div className="overflow-x-auto">
//         <table className="w-full text-sm">
//           <thead>
//             <tr className="border-b border-gray-700">
//               <th className="text-left py-3 px-4 text-gray-400 font-medium">Fuel Type</th>
//               <th className="text-right py-3 px-4 text-gray-400 font-medium">Current Stock</th>
//               <th className="text-right py-3 px-4 text-gray-400 font-medium">Daily Avg</th>
//               <th className="text-right py-3 px-4 text-gray-400 font-medium">Days Until Empty</th>
//               <th className="text-center py-3 px-4 text-gray-400 font-medium">Refill Needed?</th>
//               <th className="text-right py-3 px-4 text-gray-400 font-medium">Suggested Qty</th>
//             </tr>
//           </thead>
//           <tbody>
//             {sortedPredictions.map(pred => {
//               const isCritical = pred.daysUntilEmpty <= 3;
//               const isWarning = pred.daysUntilEmpty <= 5 && pred.daysUntilEmpty > 3;
//               const isSafe = pred.daysUntilEmpty > 5;

//               return (
//                 <tr
//                   key={pred.type}
//                   className={`border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors duration-200 ${
//                     isCritical
//                       ? 'bg-red-500/10'
//                       : isWarning
//                       ? 'bg-yellow-500/10'
//                       : 'bg-green-500/5'
//                   }`}
//                 >
//                   {/* Fuel Type + Icon */}
//                   <td className="py-4 px-4">
//                     <div className="flex items-center gap-2">
//                       {isCritical ? (
//                         <AlertCircle className="text-red-400" size={16} />
//                       ) : isWarning ? (
//                         <Clock className="text-yellow-400" size={16} />
//                       ) : (
//                         <CheckCircle className="text-green-400" size={16} />
//                       )}
//                       <span className="text-white font-medium">{pred.type}</span>
//                     </div>
//                   </td>

//                   {/* Current Stock */}
//                   <td className="py-4 px-4 text-right text-white font-medium">
//                     {pred.currentStock.toLocaleString()} L
//                   </td>

//                   {/* Daily Avg */}
//                   <td className="py-4 px-4 text-right text-gray-300">
//                     {pred.dailyAvg} L/day
//                   </td>

//                   {/* Days Until Empty */}
//                   <td className="py-4 px-4 text-right">
//                     <span
//                       className={`font-semibold ${
//                         isCritical
//                           ? 'text-red-400'
//                           : isWarning
//                           ? 'text-yellow-400'
//                           : 'text-green-400'
//                       }`}
//                     >
//                       {pred.daysUntilEmpty} days
//                     </span>
//                   </td>

//                   {/* Refill Needed */}
//                   <td className="py-4 px-4 text-center">
//                     <span
//                       className={`px-3 py-1 rounded-full text-xs font-medium ${
//                         pred.refillNeeded
//                           ? 'bg-red-500/20 text-red-400'
//                           : 'bg-green-500/20 text-green-400'
//                       }`}
//                     >
//                       {pred.refillNeeded ? 'Yes' : 'No'}
//                     </span>
//                   </td>

//                   {/* Suggested Qty */}
//                   <td className="py-4 px-4 text-right text-white font-medium">
//                     {pred.suggestedQty.toLocaleString()} L
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>

//       {/* Footer Note */}
//       <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
//         <div className="flex items-center gap-4">
//           <span className="flex items-center gap-1">
//             <div className="w-2 h-2 rounded-full bg-red-500" />
//             Critical (less than or equal to 3 days)
//           </span>
//           <span className="flex items-center gap-1">
//             <div className="w-2 h-2 rounded-full bg-yellow-500" />
//             Warning (4–5 days)
//           </span>
//           <span className="flex items-center gap-1">
//             <div className="w-2 h-2 rounded-full bg-green-500" />
//             Safe (greater than 5 days)
//           </span>
//         </div>
//         <span>
//           Updated: {new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Colombo' })}
//         </span>
//       </div>
//     </div>
//   );
// };
// src/components/predictions/RefillTable.jsx

import { AlertCircle, Clock, CheckCircle, Fuel } from 'lucide-react';

const mockPredictions = [
  { type: 'Diesel',    currentStock: 1800, dailyAvg: 450, daysUntilEmpty: 4, refillNeeded: true,  suggestedQty: 3200 },
  { type: 'Petrol 95', currentStock: 3200, dailyAvg: 380, daysUntilEmpty: 8, refillNeeded: false, suggestedQty: 1800 },
  { type: 'Petrol 92', currentStock: 3900, dailyAvg: 520, daysUntilEmpty: 7, refillNeeded: false, suggestedQty: 1100 },
];

export const RefillTable = () => {
  const sorted = [...mockPredictions].sort((a, b) => a.daysUntilEmpty - b.daysUntilEmpty);

  const getUrgency = (days) => {
    if (days <= 3) return { level: 'critical', icon: AlertCircle };
    if (days <= 5) return { level: 'warning',  icon: Clock };
    return { level: 'safe', icon: CheckCircle };
  };

  return (
    <div className="rounded-3xl bg-black/40 backdrop-blur-2xl border border-white/10 shadow-2xl p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-5">
          <div className="p-4 rounded-2xl bg-blue-500/20 border border-blue-500/30">
            <Fuel className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Refill Priority</h3>
            <p className="text-sm text-gray-500">Next 10 days</p>
          </div>
        </div>
        <span className="text-xs text-gray-500">
          {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Colombo' })}
        </span>
      </div>

      {/* Clean cards */}
      <div className="space-y-5">
        {sorted.map((fuel, i) => {
          const urgency = getUrgency(fuel.daysUntilEmpty);
          const Icon = urgency.icon;

          return (
            <div
              key={fuel.type}
              className="relative rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              {/* Rank */}
              <div className="absolute top-6 right-6 text-2xl font-bold text-white/30">
                #{i + 1}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Fuel Type + Icon */}
                <div className="md:col-span-3 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-white/10">
                    <Icon className={`w-7 h-7 ${
                      urgency.level === 'critical' ? 'text-rose-400' :
                      urgency.level === 'warning'  ? 'text-amber-400' :
                      'text-emerald-400'
                    }`} />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white">{fuel.type}</h4>
                    <p className="text-2xl font-bold text-white mt-1">
                      {fuel.daysUntilEmpty} <span className="text-sm text-gray-500 font-normal">days left</span>
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="md:col-span-5 grid grid-cols-2 gap-8 text-center">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Current</p>
                    <p className="text-2xl font-bold text-white">{fuel.currentStock.toLocaleString()} L</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Daily Avg</p>
                    <p className="text-2xl font-bold text-white">{fuel.dailyAvg} L</p>
                  </div>
                </div>

                {/* Suggested Refill */}
                <div className="md:col-span-4 text-right">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Suggested</p>
                  <p className="text-4xl font-bold text-white">
                    {fuel.suggestedQty.toLocaleString()} <span className="text-xl text-gray-500">L</span>
                  </p>
                  {fuel.refillNeeded && (
                    <span className="inline-block mt-2 px-4 py-1 rounded-full bg-rose-500/20 text-rose-400 text-xs font-medium">
                      Action Required
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Minimal legend */}
      <div className="mt-8 flex justify-center gap-8 text-xs text-gray-500">
        <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-400"></div> Critical</span>
        <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-400"></div> Warning</span>
        <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400"></div> Safe</span>
      </div>
    </div>
  );
};