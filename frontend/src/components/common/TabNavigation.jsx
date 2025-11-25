// import { BarChart3, TrendingUp, Users } from 'lucide-react';

// const tabs = [
//   { id: 'stocks', label: 'Live Stocks', icon: BarChart3 },
//   { id: 'predictions', label: 'Predictions', icon: TrendingUp },
//   { id: 'employees', label: 'Employees', icon: Users },
// ];

// export const TabNavigation = ({ activeTab, onTabChange }) => {
//   return (
//     <div className="bg-gray-800 border-b border-gray-700">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex gap-1 overflow-x-auto">
//           {tabs.map(tab => {
//             const Icon = tab.icon;
//             return (
//               <button
//                 key={tab.id}
//                 onClick={() => onTabChange(tab.id)}
//                 className={`flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${
//                   activeTab === tab.id
//                     ? 'text-blue-400 border-b-2 border-blue-400'
//                     : 'text-gray-400 hover:text-gray-300'
//                 }`}
//               >
//                 <Icon size={20} />
//                 <span>{tab.label}</span>
//               </button>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };
// src/components/common/TabNavigation.jsx

import { BarChart3, TrendingUp, Users } from 'lucide-react';

const tabs = [
  { id: 'stocks', label: 'Live Stocks', icon: BarChart3 },
  { id: 'predictions', label: 'Predictions', icon: TrendingUp },
  { id: 'employees', label: 'Employees', icon: Users },
];

export const TabNavigation = ({ activeTab, onTabChange }) => {
  return (
    <div className="bg-black/40 backdrop-blur-2xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex items-center gap-3 px-8 py-5 font-medium text-lg transition-all duration-300 ${
                  isActive
                    ? 'text-white'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'text-blue-400' : ''}`} />
                <span>{tab.label}</span>

                {/* Active Indicator Bar (Tesla-style) */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-lg" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};