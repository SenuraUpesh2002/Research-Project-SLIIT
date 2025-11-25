// // src/components/predictions/PredictionsPanel.jsx
// import { TrendingUp, Calendar, Droplet, DollarSign, Target, Clock } from 'lucide-react';
// import { MetricsCard } from './MetricsCard';
// import { PredictionChart } from './PredictionChart';
// import { RefillTable } from './RefillTable';
// import { generatePredictionData } from '../../services/mockData';

// export const PredictionsPanel = () => {
//   const chartData = generatePredictionData();

//   // LK current time
//   const now = new Date();
//   const today = now.toLocaleDateString('en-GB', { timeZone: 'Asia/Colombo' });
//   const nextRefill = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
//   const refillDate = nextRefill.toLocaleDateString('en-GB', {
//     weekday: 'long',
//     day: 'numeric',
//     month: 'short',
//     timeZone: 'Asia/Colombo',
//   });

//   return (
//     <div className="space-y-6">
//       {/* Metrics Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <MetricsCard
//           label="Predicted Consumption"
//           value="24,500 L"
//           subtext="Next 7 days (all fuels)"
//           icon={TrendingUp}
//           color="bg-purple-600"
//         />
//         <MetricsCard
//           label="Recommended Refill"
//           value="3 Days"
//           subtext={refillDate}
//           icon={Calendar}
//           color="bg-blue-600"
//         />
//         <MetricsCard
//           label="Optimal Refill Qty"
//           value="6,100 L"
//           subtext="Total across all tanks"
//           icon={Droplet}
//           color="bg-green-600"
//         />
//         <MetricsCard
//           label="Cost Savings"
//           value="Rs. 784,000"
//           subtext="From prediction accuracy"
//           icon={DollarSign}
//           color="bg-orange-600"
//         />
//       </div>

//       {/* Prediction Chart */}
//       <PredictionChart data={chartData} />

//       {/* Refill Table */}
//       <RefillTable />

//       {/* Prediction Accuracy + Refill Timeline */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Prediction Accuracy */}
//         <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border border-gray-700">
//           <h3 className="text-xl font-semibold text-white mb-6">Prediction Accuracy</h3>
//           <div className="space-y-4">
//             <div>
//               <div className="flex items-center justify-between mb-2">
//                 <span className="text-gray-400">Model Accuracy (MAPE)</span>
//                 <span className="text-2xl font-bold text-green-400">94.2%</span>
//               </div>
//               <div className="w-full bg-gray-700 rounded-full h-2">
//                 <div
//                   className="bg-green-500 h-2 rounded-full transition-all duration-700"
//                   style={{ width: '94.2%' }}
//                 />
//               </div>
//             </div>
//             <div className="flex items-center gap-2 text-sm text-gray-400">
//               <Clock size={16} />
//               <span>Last trained: 2 days ago</span>
//             </div>
//             <button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium">
//               <Target size={16} />
//               Retrain Model
//             </button>
//           </div>
//         </div>

//         {/* Refill Timeline */}
//         <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border border-gray-700">
//           <h3 className="text-xl font-semibold text-white mb-6">Refill Timeline</h3>
//           <div className="space-y-4">
//             {/* Today */}
//             <div className="relative pl-6 pb-6 border-l-2 border-gray-700">
//               <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-red-500 ring-4 ring-gray-900" />
//               <div className="text-sm text-gray-400">Today</div>
//               <div className="text-white font-medium">Current Stock Levels</div>
//             </div>

//             {/* Diesel Refill */}
//             <div className="relative pl-6 pb-6 border-l-2 border-gray-700">
//               <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-yellow-500 ring-4 ring-gray-900" />
//               <div className="text-sm text-gray-400">19 Nov (3 days)</div>
//               <div className="text-white font-medium">Diesel Refill</div>
//               <div className="text-xs text-gray-500">3,200 L recommended</div>
//             </div>

//             {/* Petrol 92 */}
//             <div className="relative pl-6 pb-6 border-l-2 border-gray-700">
//               <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-blue-500 ring-4 ring-gray-900" />
//               <div className="text-sm text-gray-400">23 Nov (7 days)</div>
//               <div className="text-white font-medium">Petrol 92 Refill</div>
//               <div className="text-xs text-gray-500">1,100 L recommended</div>
//             </div>

//             {/* Petrol 95 */}
//             <div className="relative pl-6">
//               <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-green-500 ring-4 ring-gray-900" />
//               <div className="text-sm text-gray-400">24 Nov (8 days)</div>
//               <div className="text-white font-medium">Petrol 95 Refill</div>
//               <div className="text-xs text-gray-500">1,800 L recommended</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// src/components/predictions/PredictionsPanel.jsx

import { TrendingUp, Calendar, Droplet, DollarSign, Target, Clock, Zap } from 'lucide-react';
import { MetricsCard } from './MetricsCard';
import { PredictionChart } from './PredictionChart';
import { RefillTable } from './RefillTable';
import { generatePredictionData } from '../../services/mockData';

export const PredictionsPanel = () => {
  const chartData = generatePredictionData();

  const now = new Date();
  const today = now.toLocaleDateString('en-GB', { timeZone: 'Asia/Colombo' });
  const nextRefill = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  const refillDate = nextRefill.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    timeZone: 'Asia/Colombo',
  });

  return (
    <div className="space-y-12">
      {/* HERO METRICS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <MetricsCard
          label="7-Day Forecast" value="24,500 L" subtext="Total consumption" icon={TrendingUp} color="bg-gradient-to-br from-purple-500/20 to-pink-500/20" />
        <MetricsCard label="Next Refill" value="3 Days" subtext={refillDate} icon={Calendar} color="bg-gradient-to-br from-blue-500/20 to-cyan-500/20" />
        <MetricsCard label="Optimal Order" value="6,100 L" subtext="Recommended total" icon={Droplet} color="bg-gradient-to-br from-emerald-500/20 to-teal-500/20" />
        <MetricsCard label="Cost Savings" value="Rs. 784K" subtext="From AI optimization" icon={DollarSign} color="bg-gradient-to-br from-orange-500/20 to-red-500/20" />
      </div>

      {/* MAIN PREDICTION CHART */}
      <PredictionChart data={chartData} />

      {/* ACCURACY + TIMELINE ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* PREDICTION ACCURACY CARD */}
        <div className="relative overflow-hidden rounded-3xl bg-black/40 backdrop-blur-2xl border border-white/10 p-10 shadow-2xl hover:border-white/20 transition-all duration-500">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-xl shadow-purple-500/30">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">AI Model Accuracy</h3>
              <p className="text-sm text-gray-400">Neural Network v3.1</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-400">Mean Absolute Percentage Error</span>
                <span className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">94.2%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-2000 ease-out shadow-lg shadow-emerald-500/50"
                  style={{ width: '94.2%' }}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-400">
              <Clock className="w-5 h-5" />
              <span>Last retrained 2 days ago</span>
            </div>

            <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-lg shadow-xl shadow-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/60 transition-all duration-300 flex items-center justify-center gap-3 group">
              <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Retrain Model Now
            </button>
          </div>
        </div>

        {/* REFILL TIMELINE – CINEMATIC STYLE */}
        <div className="relative overflow-hidden rounded-3xl bg-black/40 backdrop-blur-2xl border border-white/10 p-10 shadow-2xl hover:border-white/20 transition-all duration-500">
          <h3 className="text-2xl font-bold text-white mb-10 flex items-center gap-4">
            <Calendar className="w-8 h-8 text-blue-400" />
            Refill Timeline
          </h3>

          <div className="space-y-8 relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-white/20 to-transparent" />

            {/* Today */}
            <div className="relative flex gap-6">
              <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 shadow-xl shadow-red-500/40 flex items-center justify-center flex-shrink-0">
                <div className="w-4 h-4 bg-white rounded-full animate-pulse" />
              </div>
              <div className="pt-4">
                <p className="text-sm text-gray-400">Today • {today}</p>
                <p className="text-xl font-bold text-white mt-1">Current Stock Levels</p>
              </div>
            </div>

            {/* Diesel */}
            <div className="relative flex gap-6">
              <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 shadow-xl shadow-yellow-500/40 flex items-center justify-center flex-shrink-0">
                <Droplet className="w-8 h-8 text-black" />
              </div>
              <div className="pt-4">
                <p className="text-sm text-gray-400">19 Nov • In 3 days</p>
                <p className="text-xl font-bold text-white mt-1">Diesel Refill</p>
                <p className="text-sm text-gray-500">3,200 L recommended</p>
              </div>
            </div>

            {/* Petrol 92 */}
            <div className="relative flex gap-6">
              <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-xl shadow-blue-500/40 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-black">92</span>
              </div>
              <div className="pt-4">
                <p className="text-sm text-gray-400">23 Nov • In 7 days</p>
                <p className="text-xl font-bold text-white mt-1">Petrol 92 Refill</p>
                <p className="text-sm text-gray-500">1,100 L recommended</p>
              </div>
            </div>

            {/* Petrol 95 */}
            <div className="relative flex gap-6">
              <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-xl shadow-emerald-500/40 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-black">95</span>
              </div>
              <div className="pt-4">
                <p className="text-sm text-gray-400">24 Nov • In 8 days</p>
                <p className="text-xl font-bold text-white mt-1">Petrol 95 Refill</p>
                <p className="text-sm text-gray-500">1,800 L recommended</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Optional: Refill Table */}
      <RefillTable />
    </div>
  );
};