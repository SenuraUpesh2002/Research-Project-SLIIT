// src/components/predictions/PredictionsPanel.jsx
import { TrendingUp, Calendar, Droplet, DollarSign, Target, Clock } from 'lucide-react';
import { MetricsCard } from './MetricsCard';
import { PredictionChart } from './PredictionChart';
import { RefillTable } from './RefillTable';
import { generatePredictionData } from '../../services/mockData';

export const PredictionsPanel = () => {
  const chartData = generatePredictionData();

  // LK current time
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
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricsCard
          label="Predicted Consumption"
          value="24,500 L"
          subtext="Next 7 days (all fuels)"
          icon={TrendingUp}
          color="bg-purple-600"
        />
        <MetricsCard
          label="Recommended Refill"
          value="3 Days"
          subtext={refillDate}
          icon={Calendar}
          color="bg-blue-600"
        />
        <MetricsCard
          label="Optimal Refill Qty"
          value="6,100 L"
          subtext="Total across all tanks"
          icon={Droplet}
          color="bg-green-600"
        />
        <MetricsCard
          label="Cost Savings"
          value="Rs. 784,000"
          subtext="From prediction accuracy"
          icon={DollarSign}
          color="bg-orange-600"
        />
      </div>

      {/* Prediction Chart */}
      <PredictionChart data={chartData} />

      {/* Refill Table */}
      <RefillTable />

      {/* Prediction Accuracy + Refill Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Prediction Accuracy */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-6">Prediction Accuracy</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Model Accuracy (MAPE)</span>
                <span className="text-2xl font-bold text-green-400">94.2%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-700"
                  style={{ width: '94.2%' }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock size={16} />
              <span>Last trained: 2 days ago</span>
            </div>
            <button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium">
              <Target size={16} />
              Retrain Model
            </button>
          </div>
        </div>

        {/* Refill Timeline */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-6">Refill Timeline</h3>
          <div className="space-y-4">
            {/* Today */}
            <div className="relative pl-6 pb-6 border-l-2 border-gray-700">
              <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-red-500 ring-4 ring-gray-900" />
              <div className="text-sm text-gray-400">Today</div>
              <div className="text-white font-medium">Current Stock Levels</div>
            </div>

            {/* Diesel Refill */}
            <div className="relative pl-6 pb-6 border-l-2 border-gray-700">
              <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-yellow-500 ring-4 ring-gray-900" />
              <div className="text-sm text-gray-400">19 Nov (3 days)</div>
              <div className="text-white font-medium">Diesel Refill</div>
              <div className="text-xs text-gray-500">3,200 L recommended</div>
            </div>

            {/* Petrol 92 */}
            <div className="relative pl-6 pb-6 border-l-2 border-gray-700">
              <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-blue-500 ring-4 ring-gray-900" />
              <div className="text-sm text-gray-400">23 Nov (7 days)</div>
              <div className="text-white font-medium">Petrol 92 Refill</div>
              <div className="text-xs text-gray-500">1,100 L recommended</div>
            </div>

            {/* Petrol 95 */}
            <div className="relative pl-6">
              <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-green-500 ring-4 ring-gray-900" />
              <div className="text-sm text-gray-400">24 Nov (8 days)</div>
              <div className="text-white font-medium">Petrol 95 Refill</div>
              <div className="text-xs text-gray-500">1,800 L recommended</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};