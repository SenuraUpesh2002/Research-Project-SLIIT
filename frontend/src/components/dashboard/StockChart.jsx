import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CHART_COLORS } from '../../utils/constants';

export const StockChart = ({ data }) => {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border border-gray-700">
      <h3 className="text-xl font-semibold text-white mb-6">24-Hour Fuel Levels</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="time" 
            stroke="#9CA3AF" 
            tick={{ fill: '#9CA3AF' }} 
          />
          <YAxis 
            stroke="#9CA3AF" 
            tick={{ fill: '#9CA3AF' }} 
            label={{ 
              value: 'Liters', 
              angle: -90, 
              position: 'insideLeft', 
              fill: '#9CA3AF' 
            }} 
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#fff',
            }}
          />
          <Legend wrapperStyle={{ color: '#9CA3AF' }} />

          {/* Petrol 92 */}
          <Line
            type="monotone"
            dataKey="Petrol 92"
            stroke={CHART_COLORS['Petrol 92']}
            strokeWidth={2}
            dot={false}
            animationDuration={1000}
          />

          {/* Petrol 95 */}
          <Line
            type="monotone"
            dataKey="Petrol 95"
            stroke={CHART_COLORS['Petrol 95']}
            strokeWidth={2}
            dot={false}
            animationDuration={1000}
          />

          {/* Diesel */}
          <Line
            type="monotone"
            dataKey="Diesel"
            stroke={CHART_COLORS.Diesel}
            strokeWidth={2}
            dot={false}
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};