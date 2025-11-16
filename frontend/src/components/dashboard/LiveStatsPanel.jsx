import { RefreshCw, Activity, TrendingDown, Clock as ClockIcon } from 'lucide-react';
import { FuelStockCard } from './FuelStockCard';
import { StockChart } from './StockChart';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { useFuelData } from '../../hooks/useFuelData';
import { getTimeAgo } from '../../utils/helpers';

export const LiveStatsPanel = () => {
  const { fuelData, chartData, loading, lastUpdate, refreshData } = useFuelData();

  const totalCapacity = fuelData.reduce((sum, stock) => sum + stock.capacity, 0);
  const totalLevel = fuelData.reduce((sum, stock) => sum + stock.level, 0);
  const avgConsumption = 450; // Liters per hour

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={20} />
            <span className="text-sm opacity-80">Total Stations</span>
          </div>
          <p className="text-3xl font-bold">1</p>
          <p className="text-xs opacity-70 mt-1">Central Station Active</p>
        </div>

        <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={20} />
            <span className="text-sm opacity-80">Avg Consumption</span>
          </div>
          <p className="text-3xl font-bold">{avgConsumption}L</p>
          <p className="text-xs opacity-70 mt-1">Per hour (all fuels)</p>
        </div>

        <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-lg p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <ClockIcon size={20} />
            <span className="text-sm opacity-80">Est. Runtime</span>
          </div>
          <p className="text-3xl font-bold">
            {Math.round(totalLevel / avgConsumption)}h
          </p>
          <p className="text-xs opacity-70 mt-1">Until refill needed</p>
        </div>

        <div className="bg-gradient-to-br from-orange-900 to-orange-800 rounded-lg p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={20} className="animate-pulse" />
            <span className="text-sm opacity-80">Live Monitoring</span>
          </div>
          <p className="text-lg font-bold">{getTimeAgo(lastUpdate)}</p>
          <button
            onClick={refreshData}
            disabled={loading}
            className="mt-2 flex items-center gap-1 text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded transition-colors disabled:opacity-50"
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-8">
          <LoadingSpinner size={32} text="Updating fuel levels..." />
        </div>
      )}

      {/* Fuel Stock Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {fuelData.map(stock => (
          <FuelStockCard key={stock.id} stock={stock} />
        ))}
      </div>

      {/* Chart */}
      <StockChart data={chartData} />
    </div>
  );
};