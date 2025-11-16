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
    <header className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <Fuel className="text-blue-400" size={32} />
            <div>
              <h1 className="text-2xl font-bold">FuelWatch</h1>
              <p className="text-sm text-gray-300">Central Station Dashboard</p>
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-6">
            {/* Clock */}
            <div className="hidden md:flex items-center gap-2 text-sm">
              <Clock size={16} />
              <span>{formatTime(currentTime)}</span>
            </div>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Bell size={24} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-96 bg-gray-800 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                  <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                    <h3 className="font-semibold">Notifications</h3>
                    <button
                      onClick={onMarkAllAsRead}
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      Mark all as read
                    </button>
                  </div>

                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-400">No notifications</div>
                  ) : (
                    <div className="divide-y divide-gray-700">
                      {notifications.slice(0, 10).map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => onMarkAsRead(notif.id)}
                          className={`p-4 cursor-pointer hover:bg-gray-700/50 transition-colors ${
                            !notif.read ? 'bg-blue-900/20' : ''
                          }`}
                        >
                          <p className="text-sm">{notif.message}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {getTimeAgo(notif.timestamp)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Settings */}
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Settings size={24} />
            </button>

            {/* User Profile */}
            <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-colors">
              <User size={24} />
              <span className="hidden md:inline text-sm">Admin</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};