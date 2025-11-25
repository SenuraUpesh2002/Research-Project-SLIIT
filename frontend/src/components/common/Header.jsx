// import { useState, useEffect } from 'react';
// import { Bell, Settings, User, Fuel, Clock } from 'lucide-react';
// import { formatTime, getTimeAgo } from '../../utils/helpers';

// export const Header = ({
//   notifications,
//   unreadCount,
//   onMarkAsRead,
//   onMarkAllAsRead,
//   onOpenSettings,
// }) => {
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [showNotifications, setShowNotifications] = useState(false);

//   useEffect(() => {
//     const interval = setInterval(() => setCurrentTime(new Date()), 1000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <header className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white shadow-lg">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//         <div className="flex items-center justify-between">
//           {/* Logo & Title */}
//           <div className="flex items-center gap-3">
//             <Fuel className="text-blue-400" size={32} />
//             <div>
//               <h1 className="text-2xl font-bold">FuelWatch</h1>
//               <p className="text-sm text-gray-300">Central Station Dashboard</p>
//             </div>
//           </div>

//           {/* Right Side Icons */}
//           <div className="flex items-center gap-6">
//             {/* Clock */}
//             <div className="hidden md:flex items-center gap-2 text-sm">
//               <Clock size={16} />
//               <span>{formatTime(currentTime)}</span>
//             </div>

//             {/* Notifications Dropdown */}
//             <div className="relative">
//               <button
//                 onClick={() => setShowNotifications(!showNotifications)}
//                 className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
//               >
//                 <Bell size={24} />
//                 {unreadCount > 0 && (
//                   <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                     {unreadCount}
//                   </span>
//                 )}
//               </button>

//               {showNotifications && (
//                 <div className="absolute right-0 mt-2 w-96 bg-gray-800 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
//                   <div className="p-4 border-b border-gray-700 flex items-center justify-between">
//                     <h3 className="font-semibold">Notifications</h3>
//                     <button
//                       onClick={onMarkAllAsRead}
//                       className="text-xs text-blue-400 hover:text-blue-300"
//                     >
//                       Mark all as read
//                     </button>
//                   </div>

//                   {notifications.length === 0 ? (
//                     <div className="p-4 text-center text-gray-400">No notifications</div>
//                   ) : (
//                     <div className="divide-y divide-gray-700">
//                       {notifications.slice(0, 10).map((notif) => (
//                         <div
//                           key={notif.id}
//                           onClick={() => onMarkAsRead(notif.id)}
//                           className={`p-4 cursor-pointer hover:bg-gray-700/50 transition-colors ${
//                             !notif.read ? 'bg-blue-900/20' : ''
//                           }`}
//                         >
//                           <p className="text-sm">{notif.message}</p>
//                           <p className="text-xs text-gray-400 mt-1">
//                             {getTimeAgo(notif.timestamp)}
//                           </p>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Settings */}
//             <button
//               onClick={onOpenSettings}
//               className="p-2 rounded-lg hover:bg-white/10 transition-colors"
//             >
//               <Settings size={24} />
//             </button>

//             {/* User Profile */}
//             <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-colors">
//               <User size={24} />
//               <span className="hidden md:inline text-sm">Admin</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// src/components/common/Header.jsx

import { useState, useEffect } from 'react';
import { Bell, Settings, User, Fuel, Clock } from 'lucide-react';
import { formatTime, getTimeAgo } from '../../utils/helpers';

export const Header = ({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onOpenSettings,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="relative overflow-hidden bg-black/60 backdrop-blur-2xl border-b border-white/10">
      {/* Subtle animated gradient bar (Tesla-style top glow) */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          {/* Logo + Title */}
          <div className="flex items-center gap-5">
            <div className="p-3 rounded-28 bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl shadow-blue-500/30">
              <Fuel className="w-9 h-9 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">FuelWatch</h1>
              <p className="text-sm text-gray-400 -mt-1">Central Station • Live Monitoring</p>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-6">
            {/* Live Clock */}
            <div className="hidden lg:flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
              <Clock className="w-5 h-5 text-gray-400" />
              <span className="font-mono text-lg text-white">{formatTime(currentTime)}</span>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
              >
                <Bell className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-br from-rose-500 to-pink-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg shadow-rose-500/50 animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-96 rounded-3xl bg-black/80 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden z-50">
                  <div className="p-5 border-b border-white/10 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={onMarkAllAsRead}
                        className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-center text-gray-500 py-10">No new notifications</p>
                    ) : (
                      notifications.slice(0, 10).map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => onMarkAsRead(notif.id)}
                          className={`p-4 border-b border-white/5 cursor-pointer transition-colors hover:bg-white/5 ${
                            !notif.read ? 'bg-blue-500/10' : ''
                          }`}
                        >
                          <p className="text-white font-medium text-sm">{notif.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{getTimeAgo(notif.timestamp)}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Settings */}
            <button
              onClick={onOpenSettings}
              className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              <Settings className="w-6 h-6 text-gray-300 hover:text-white transition-colors" />
            </button>

            {/* User */}
            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
              <User className="w-6 h-6 text-gray-300" />
              <span className="font-medium text-white hidden md:block">Admin</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};