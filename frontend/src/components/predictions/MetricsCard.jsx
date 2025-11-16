// src/components/common/MetricsCard.jsx
// import { LucideIcon } from 'lucide-react';

export const MetricsCard = ({ label, value, subtext, icon: Icon, color }) => {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border border-gray-700 hover:border-purple-500 transition-all duration-300 group">
      {/* Icon */}
      <div className={`inline-flex p-3 rounded-lg ${color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={24} className="text-white" />
      </div>

      {/* Label */}
      <p className="text-sm text-gray-400 mb-1 font-medium">{label}</p>

      {/* Value */}
      <p className="text-3xl font-bold text-white mb-1 tracking-tight">
        {value}
      </p>

      {/* Subtext */}
      {subtext && (
        <p className="text-xs text-gray-500 leading-relaxed">
          {subtext}
        </p>
      )}
    </div>
  );
};
