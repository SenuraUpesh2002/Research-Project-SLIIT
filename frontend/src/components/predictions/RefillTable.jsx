// src/components/predictions/RefillTable.jsx
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

// Mock prediction data (LK-realistic)
const mockPredictions = [
  {
    type: 'Diesel',
    currentStock: 1800,
    dailyAvg: 450,
    daysUntilEmpty: 4,
    refillNeeded: true,
    suggestedQty: 3200,
  },
  {
    type: 'Petrol 95',
    currentStock: 3200,
    dailyAvg: 380,
    daysUntilEmpty: 8,
    refillNeeded: false,
    suggestedQty: 1800,
  },
  {
    type: 'Petrol 92',
    currentStock: 3900,
    dailyAvg: 520,
    daysUntilEmpty: 7,
    refillNeeded: false,
    suggestedQty: 1100,
  },
];

export const RefillTable = () => {
  // Sort by urgency: lowest daysUntilEmpty first
  const sortedPredictions = [...mockPredictions].sort((a, b) => a.daysUntilEmpty - b.daysUntilEmpty);

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border border-gray-700">
      {/* Header */}
      <h3 className="text-xl font-semibold text-white mb-6">Fuel Type Predictions</h3>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Fuel Type</th>
              <th className="text-right py-3 px-4 text-gray-400 font-medium">Current Stock</th>
              <th className="text-right py-3 px-4 text-gray-400 font-medium">Daily Avg</th>
              <th className="text-right py-3 px-4 text-gray-400 font-medium">Days Until Empty</th>
              <th className="text-center py-3 px-4 text-gray-400 font-medium">Refill Needed?</th>
              <th className="text-right py-3 px-4 text-gray-400 font-medium">Suggested Qty</th>
            </tr>
          </thead>
          <tbody>
            {sortedPredictions.map(pred => {
              const isCritical = pred.daysUntilEmpty <= 3;
              const isWarning = pred.daysUntilEmpty <= 5 && pred.daysUntilEmpty > 3;
              const isSafe = pred.daysUntilEmpty > 5;

              return (
                <tr
                  key={pred.type}
                  className={`border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors duration-200 ${
                    isCritical
                      ? 'bg-red-500/10'
                      : isWarning
                      ? 'bg-yellow-500/10'
                      : 'bg-green-500/5'
                  }`}
                >
                  {/* Fuel Type + Icon */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {isCritical ? (
                        <AlertCircle className="text-red-400" size={16} />
                      ) : isWarning ? (
                        <Clock className="text-yellow-400" size={16} />
                      ) : (
                        <CheckCircle className="text-green-400" size={16} />
                      )}
                      <span className="text-white font-medium">{pred.type}</span>
                    </div>
                  </td>

                  {/* Current Stock */}
                  <td className="py-4 px-4 text-right text-white font-medium">
                    {pred.currentStock.toLocaleString()} L
                  </td>

                  {/* Daily Avg */}
                  <td className="py-4 px-4 text-right text-gray-300">
                    {pred.dailyAvg} L/day
                  </td>

                  {/* Days Until Empty */}
                  <td className="py-4 px-4 text-right">
                    <span
                      className={`font-semibold ${
                        isCritical
                          ? 'text-red-400'
                          : isWarning
                          ? 'text-yellow-400'
                          : 'text-green-400'
                      }`}
                    >
                      {pred.daysUntilEmpty} days
                    </span>
                  </td>

                  {/* Refill Needed */}
                  <td className="py-4 px-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        pred.refillNeeded
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-green-500/20 text-green-400'
                      }`}
                    >
                      {pred.refillNeeded ? 'Yes' : 'No'}
                    </span>
                  </td>

                  {/* Suggested Qty */}
                  <td className="py-4 px-4 text-right text-white font-medium">
                    {pred.suggestedQty.toLocaleString()} L
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Note */}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            Critical (less than or equal to 3 days)
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            Warning (4–5 days)
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            Safe (greater than 5 days)
          </span>
        </div>
        <span>
          Updated: {new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Colombo' })}
        </span>
      </div>
    </div>
  );
};