// // src/components/predictions/PredictionChart.jsx
// import { useState } from 'react';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   ReferenceLine,
// } from 'recharts';

// export const PredictionChart = ({ data }) => {
//   const [range, setRange] = useState('30');

//   // Filter data based on selected range
//   const getFilteredData = () => {
//     if (range === '7') return data.slice(-14);  // 7 past + 7 future
//     if (range === '14') return data.slice(-21); // 14 past + 7 future
//     return data; // 30 past + 7 future
//   };

//   const filteredData = getFilteredData();

//   // Find today's date index
//   const todayIndex = filteredData.findIndex(d => d.isPast === false);
//   const todayDate = todayIndex >= 0 ? filteredData[todayIndex]?.date : null;

//   return (
//     <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border border-gray-700">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
//         <h3 className="text-xl font-semibold text-white">Consumption Forecast</h3>

//         {/* Range Buttons */}
//         <div className="flex gap-2">
//           {['7', '14', '30'].map(days => (
//             <button
//               key={days}
//               onClick={() => setRange(days)}
//               className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
//                 range === days
//                   ? 'bg-purple-600 text-white shadow-md'
//                   : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
//               }`}
//             >
//               {days} Days
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Chart */}
//       <ResponsiveContainer width="100%" height={350}>
//         <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
//           <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          
//           <XAxis
//             dataKey="date"
//             stroke="#9CA3AF"
//             tick={{ fill: '#9CA3AF', fontSize: 12 }}
//             tickLine={false}
//           />
          
//           <YAxis
//             stroke="#9CA3AF"
//             tick={{ fill: '#9CA3AF', fontSize: 12 }}
//             tickLine={false}
//             label={{
//               value: 'Liters (L)',
//               angle: -90,
//               position: 'insideLeft',
//               fill: '#9CA3AF',
//               fontSize: 13,
//             }}
//           />

//           <Tooltip
//             contentStyle={{
//               backgroundColor: '#1F2937',
//               border: '1px solid #374151',
//               borderRadius: '8px',
//               color: '#fff',
//               fontSize: '13px',
//             }}
//             labelStyle={{ color: '#D1D5DB' }}
//             formatter={(value) => value ? `${value.toLocaleString()} L` : '—'}
//           />

//           <Legend
//             wrapperStyle={{ color: '#9CA3AF', paddingTop: '10px' }}
//             iconType="line"
//           />

//           {/* Today Reference Line */}
//           {todayDate && (
//             <ReferenceLine
//               x={todayDate}
//               stroke="#ffff00"
//               strokeDasharray="6 6"
//               strokeWidth={2}
//               label={{
//                 value: 'Today',
//                 position: 'top',
//                 fill: '#ffff00',
//                 fontSize: 12,
//                 fontWeight: 'bold',
//               }}
//             />
//           )}

//           {/* Historical Line */}
//           <Line
//             type="monotone"
//             dataKey="historical"
//             stroke="#3b82f6"
//             strokeWidth={2.5}
//             dot={{ fill: '#3b82f6', r: 4 }}
//             activeDot={{ r: 6 }}
//             name="Historical"
//             connectNulls={false}
//           />

//           {/* Predicted Line (Dashed) */}
//           <Line
//             type="monotone"
//             dataKey="predicted"
//             stroke="#f59e0b"
//             strokeWidth={2.5}
//             strokeDasharray="8 4"
//             dot={{ fill: '#f59e0b', r: 4 }}
//             activeDot={{ r: 6 }}
//             name="Predicted"
//             connectNulls={false}
//           />
//         </LineChart>
//       </ResponsiveContainer>

//       {/* Legend Note */}
//       <p className="mt-4 text-xs text-gray-500 text-center">
//         Solid line = Historical data | Dashed line = AI Prediction
//       </p>
//     </div>
//   );
// };

// src/components/predictions/PredictionChart.jsx

import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

export const PredictionChart = ({ data }) => {
  const [range, setRange] = useState('30');

  const getFilteredData = () => {
    if (range === '7') return data.slice(-14);   // 7 past + 7 future
    if (range === '14') return data.slice(-21);  // 14 past + 7 future
    return data; // full 30 + 7
  };

  const filteredData = getFilteredData();
  const todayIndex = filteredData.findIndex(d => !d.isPast);
  const todayDate = todayIndex >= 0 ? filteredData[todayIndex]?.date : null;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-black/40 backdrop-blur-2xl border border-white/10 shadow-2xl p-8 transition-all hover:border-white/20 hover:shadow-3xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10">
        <div>
          <h3 className="text-3xl font-bold text-white tracking-tight">Consumption Forecast</h3>
          <p className="text-sm text-gray-400 mt-2">AI-powered prediction • Next 7 days</p>
        </div>

        {/* Range Selector – Tesla-style glass buttons */}
        <div className="flex gap-3 mt-6 sm:mt-0">
          {['7', '14', '30'].map((days) => (
            <button
              key={days}
              onClick={() => setRange(days)}
              className={`px-6 py-3 rounded-2xl font-medium text-sm transition-all duration-300 backdrop-blur-md border ${
                range === days
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-white/30 shadow-lg shadow-purple-500/30'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white hover:border-white/20'
              }`}
            >
              {days} Days
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={420}>
        <LineChart data={filteredData} margin={{ top: 20, right: 40, left: 30, bottom: 20 }}>
          <CartesianGrid stroke="#ffffff08" strokeDasharray="8 8" />

          <XAxis
            dataKey="date"
            stroke="#ffffff40"
            tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 500 }}
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            stroke="#ffffff40"
            tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 500 }}
            tickLine={false}
            axisLine={false}
            label={{
              value: 'Liters (L)',
              angle: -90,
              position: 'insideLeft',
              fill: '#94a3b8',
              fontWeight: 600,
              fontSize: 14,
            }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
              padding: '12px 16px',
            }}
            labelStyle={{ color: '#e2e8f0', fontWeight: 600, marginBottom: 8 }}
            itemStyle={{ color: '#e2e8f0', fontSize: 13 }}
            formatter={(value) => value ? `${Number(value).toLocaleString()} L` : '—'}
          />

          <Legend
            wrapperStyle={{ paddingTop: '30px', color: '#94a3b8' }}
            iconType="line"
            verticalAlign="bottom"
          />

          {/* TODAY Vertical Line – Electric Glow */}
          {todayDate && (
            <ReferenceLine
              x={todayDate}
              stroke="#00ff88"
              strokeWidth={3}
              strokeDasharray="8 6"
              label={{
                value: 'TODAY',
                position: 'top',
                fill: '#00ff88',
                fontSize: 13,
                fontWeight: 'bold',
                offset: 15,
              }}
            >
              <svg>
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
              </svg>
            </ReferenceLine>
          )}

          {/* Historical Line – Solid & Bold */}
          <Line
            type="monotone"
            dataKey="historical"
            stroke="#3b82f6"
            strokeWidth={4}
            dot={{ fill: '#3b82f6', r: 6, strokeWidth: 3, stroke: '#1e40af' }}
            activeDot={{ r: 9 }}
            name="Historical"
            animationDuration={1800}
          />

          {/* Predicted Line – Dashed & Glowing */}
          <Line
            type="monotone"
            dataKey="predicted"
            stroke="#ff6b35"
            strokeWidth={4}
            strokeDasharray="10 6"
            dot={{ fill: '#ff6b35', r: 6, strokeWidth: 3, stroke: '#c2410c' }}
            activeDot={{ r: 9 }}
            name="Predicted (AI)"
            animationDuration={2200}
            style={{
              filter: 'drop-shadow(0 0 10px rgba(255, 107, 53, 0.6))',
            }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Legend Note – Minimal & Elegant */}
      <div className="mt-10 flex items-center justify-center gap-8 text-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-1 bg-blue-500 rounded-full"></div>
          <span className="text-gray-400">Historical Data</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-1 border-2 border-dashed border-orange-500 rounded-full"></div>
          <span className="text-gray-400">AI Prediction</span>
        </div>
      </div>
    </div>
  );
};