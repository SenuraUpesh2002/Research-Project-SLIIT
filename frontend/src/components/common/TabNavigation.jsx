import { BarChart3, TrendingUp, Users } from 'lucide-react';

const tabs = [
  { id: 'stocks', label: 'Live Stocks', icon: BarChart3 },
  { id: 'predictions', label: 'Predictions', icon: TrendingUp },
  { id: 'employees', label: 'Employees', icon: Users },
];

export const TabNavigation = ({ activeTab, onTabChange }) => {
  return (
    <div className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <Icon size={20} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};