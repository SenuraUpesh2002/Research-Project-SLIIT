// src/components/common/MetricsCard.jsx
// import { LucideIcon } from 'lucide-react';

// export const MetricsCard = ({ label, value, subtext, icon: Icon, color }) => {
//   return (
//     <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border border-gray-700 hover:border-purple-500 transition-all duration-300 group">
//       {/* Icon */}
//       <div className={`inline-flex p-3 rounded-lg ${color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
//         <Icon size={24} className="text-white" />
//       </div>

//       {/* Label */}
//       <p className="text-sm text-gray-400 mb-1 font-medium">{label}</p>

//       {/* Value */}
//       <p className="text-3xl font-bold text-white mb-1 tracking-tight">
//         {value}
//       </p>

//       {/* Subtext */}
//       {subtext && (
//         <p className="text-xs text-gray-500 leading-relaxed">
//           {subtext}
//         </p>
//       )}
//     </div>
//   );
// };
// src/components/common/MetricsCard.jsx   (or wherever you keep it)

export const MetricsCard = ({ label, value, subtext, icon: Icon, color = "bg-blue-500/20" }) => {
  return (
    <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 p-8 shadow-2xl transition-all duration-500 hover:border-white/30 hover:-translate-y-3 hover:shadow-3xl">
      
      {/* Hover glow background */}
      <div 
        className={`absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700 blur-3xl`}
        style={{
          background: color.includes('gradient') 
            ? color.replace('/20', '').replace('bg-', '')
            : `linear-gradient(to bottom right, ${color.replace('bg-', '').replace('/20', '')}, ${color.replace('bg-', '').replace('/20', '600')})`
        }}
      />

      {/* Icon with floating glow */}
      <div className={`relative inline-flex p-4 rounded-2xl ${color} backdrop-blur-md border border-white/20 mb-6 shadow-xl transition-all duration-500 group-hover:scale-110`}>
        {Icon && <Icon className="w-7 h-7 text-white relative z-10" />}
        <div className="absolute inset-0 rounded-2xl bg-white/30 blur-xl scale-0 group-hover:scale-150 transition-transform duration-700" />
      </div>

      {/* Label */}
      <p className="text-sm font-medium text-gray-400 tracking-wider uppercase mb-2">
        {label}
      </p>

      {/* Big Value */}
      <p className="text-5xl font-bold text-white tracking-tight mb-2 tabular-nums">
        {value}
      </p>

      {/* Subtext */}
      {subtext && (
        <p className="text-sm text-gray-500 leading-relaxed opacity-90">
          {subtext}
        </p>
      )}

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
};