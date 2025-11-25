// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { CHART_COLORS } from '../../utils/constants';

// export const StockChart = ({ data }) => {
//   return (
//     <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border border-gray-700">
//       <h3 className="text-xl font-semibold text-white mb-6">24-Hour Fuel Levels</h3>
//       <ResponsiveContainer width="100%" height={300}>
//         <LineChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//           <XAxis 
//             dataKey="time" 
//             stroke="#9CA3AF" 
//             tick={{ fill: '#9CA3AF' }} 
//           />
//           <YAxis 
//             stroke="#9CA3AF" 
//             tick={{ fill: '#9CA3AF' }} 
//             label={{ 
//               value: 'Liters', 
//               angle: -90, 
//               position: 'insideLeft', 
//               fill: '#9CA3AF' 
//             }} 
//           />
//           <Tooltip
//             contentStyle={{
//               backgroundColor: '#1F2937',
//               border: '1px solid #374151',
//               borderRadius: '8px',
//               color: '#fff',
//             }}
//           />
//           <Legend wrapperStyle={{ color: '#9CA3AF' }} />

//           {/* Petrol 92 */}
//           <Line
//             type="monotone"
//             dataKey="Petrol 92"
//             stroke={CHART_COLORS['Petrol 92']}
//             strokeWidth={2}
//             dot={false}
//             animationDuration={1000}
//           />

//           {/* Petrol 95 */}
//           <Line
//             type="monotone"
//             dataKey="Petrol 95"
//             stroke={CHART_COLORS['Petrol 95']}
//             strokeWidth={2}
//             dot={false}
//             animationDuration={1000}
//           />

//           {/* Diesel */}
//           <Line
//             type="monotone"
//             dataKey="Diesel"
//             stroke={CHART_COLORS.Diesel}
//             strokeWidth={2}
//             dot={false}
//             animationDuration={1000}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// src/components/dashboard/StockChart.jsx

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CHART_COLORS } from '../../utils/constants';

export const StockChart = ({ data }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-black/40 backdrop-blur-2xl border border-white/10 shadow-2xl p-8 transition-all hover:border-white/20">
      <h3 className="text-2xl font-bold text-white mb-8 tracking-tight">24-Hour Fuel Trend</h3>

      <ResponsiveContainer width="100%" height={420}>
        <LineChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
          <CartesianGrid stroke="#ffffff08" strokeDasharray="8 8" />
          <XAxis
            dataKey="time"
            stroke="#ffffff30"
            tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 500 }}
          />
          <YAxis
            stroke="#ffffff30"
            tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 500 }}
            label={{ value: 'Liters', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontWeight: 600 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            }}
            labelStyle={{ color: '#e2e8f0', fontWeight: 600 }}
            itemStyle={{ color: '#e2e8f0' }}
          />
          <Legend
            wrapperStyle={{ paddingTop: '20px', color: '#94a3b8' }}
            iconType="line"
          />

          {['Petrol 92', 'Petrol 95', 'Diesel'].map(fuel => (
            <Line
              key={fuel}
              type="monotone"
              dataKey={fuel}
              stroke={CHART_COLORS[fuel]}
              strokeWidth={3.5}
              dot={{ r: 4, fill: CHART_COLORS[fuel], strokeWidth: 2 }}
              activeDot={{ r: 7 }}
              animationDuration={1800}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};