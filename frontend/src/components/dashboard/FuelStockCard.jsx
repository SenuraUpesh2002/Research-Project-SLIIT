import { Fuel, Clock, AlertCircle } from 'lucide-react';
import { getTimeAgo, getStatusFromLevel, getProgressColor } from '../../utils/helpers';

export const FuelStockCard = ({ stock }) => {
  const percentage = (stock.level / stock.capacity) * 100;
  const status = getStatusFromLevel(stock.level, stock.capacity);
  const progressColor = getProgressColor(percentage);

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border border-gray-700 hover:border-blue-500 transition-all">
      {/* Header: Icon + Type + Status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500/20 rounded-lg">
            <Fuel className="text-blue-400" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{stock.type}</h3>
            <p className="text-sm text-gray-400">Tank {stock.id}</p>
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            status === 'Available'
              ? 'bg-green-500/20 text-green-400'
              : status === 'Low Stock'
              ? 'bg-yellow-500/20 text-yellow-400'
              : 'bg-red-500/20 text-red-400'
          }`}
        >
          {status}
        </span>
      </div>

      {/* Level & Progress */}
      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-white">
            {Math.round(stock.level).toLocaleString('en-US')}
          </span>
          <span className="text-sm text-gray-400">
            / {stock.capacity.toLocaleString('en-US')} L
          </span>
        </div>

        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className={`${progressColor} h-full rounded-full transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">{percentage.toFixed(1)}% Full</span>
          <div className="flex items-center gap-1 text-gray-400">
            <Clock size={14} />
            <span>{getTimeAgo(stock.lastUpdated)}</span>
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {percentage < 20 && (
        <div className="mt-4 flex items-center gap-2 text-sm text-yellow-400 bg-yellow-500/10 rounded-lg p-3">
          <AlertCircle size={16} />
          <span>Refill recommended soon</span>
        </div>
      )}
    </div>
  );
};