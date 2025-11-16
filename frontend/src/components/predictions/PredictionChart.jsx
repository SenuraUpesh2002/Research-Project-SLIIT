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

  // Filter data based on selected range
  const getFilteredData = () => {
    if (range === '7') return data.slice(-14);  // 7 past + 7 future
    if (range === '14') return data.slice(-21); // 14 past + 7 future
    return data; // 30 past + 7 future
  };

  const filteredData = getFilteredData();

  // Find today's date index
  const todayIndex = filteredData.findIndex(d => d.isPast === false);
  const todayDate = todayIndex >= 0 ? filteredData[todayIndex]?.date : null;

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border border-gray-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h3 className="text-xl font-semibold text-white">Consumption Forecast</h3>

        {/* Range Buttons */}
        <div className="flex gap-2">
          {['7', '14', '30'].map(days => (
            <button
              key={days}
              onClick={() => setRange(days)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                range === days
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
              }`}
            >
              {days} Days
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          
          <XAxis
            dataKey="date"
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            tickLine={false}
          />
          
          <YAxis
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            tickLine={false}
            label={{
              value: 'Liters (L)',
              angle: -90,
              position: 'insideLeft',
              fill: '#9CA3AF',
              fontSize: 13,
            }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '13px',
            }}
            labelStyle={{ color: '#D1D5DB' }}
            formatter={(value) => value ? `${value.toLocaleString()} L` : '—'}
          />

          <Legend
            wrapperStyle={{ color: '#9CA3AF', paddingTop: '10px' }}
            iconType="line"
          />

          {/* Today Reference Line */}
          {todayDate && (
            <ReferenceLine
              x={todayDate}
              stroke="#ffff00"
              strokeDasharray="6 6"
              strokeWidth={2}
              label={{
                value: 'Today',
                position: 'top',
                fill: '#ffff00',
                fontSize: 12,
                fontWeight: 'bold',
              }}
            />
          )}

          {/* Historical Line */}
          <Line
            type="monotone"
            dataKey="historical"
            stroke="#3b82f6"
            strokeWidth={2.5}
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
            name="Historical"
            connectNulls={false}
          />

          {/* Predicted Line (Dashed) */}
          <Line
            type="monotone"
            dataKey="predicted"
            stroke="#f59e0b"
            strokeWidth={2.5}
            strokeDasharray="8 4"
            dot={{ fill: '#f59e0b', r: 4 }}
            activeDot={{ r: 6 }}
            name="Predicted"
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Legend Note */}
      <p className="mt-4 text-xs text-gray-500 text-center">
        Solid line = Historical data | Dashed line = AI Prediction
      </p>
    </div>
  );
};