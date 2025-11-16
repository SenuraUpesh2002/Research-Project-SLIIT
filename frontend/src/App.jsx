import { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { TabNavigation } from './components/common/TabNavigation';
import { Toast } from './components/common/Toast';
import { LiveStatsPanel } from './components/dashboard/LiveStatsPanel';
import { PredictionsPanel } from './components/predictions/PredictionsPanel';
import { EmployeePanel } from './components/employees/EmployeePanel';
import { useNotifications } from './hooks/useNotifications';
import { AlertCircle, X } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('stocks');
  const [showSettings, setShowSettings] = useState(false);
  const [alertBanner, setAlertBanner] = useState(null); // ← Fixed: no TS

  const {
    notifications,
    toasts,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    dismissToast
  } = useNotifications();

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('fuelwatch-settings');
    return saved
      ? JSON.parse(saved)
      : {
          stationName: 'Central Station',
          operatingHours: '24/7',
          lowStockThreshold: 20,
          emailAlerts: true,
          smsAlerts: true,
          requireLocation: true,
          requireDeviceId: true,
          checkInRadius: 100,
        };
  });

  useEffect(() => {
    addNotification('system', 'FuelWatch system initialized successfully', 'system', false);

    const banner = Math.random() > 0.5
      ? { type: 'warning', message: 'Diesel tank approaching critical level. Refill recommended within 3 days.' }
      : null;
    setAlertBanner(banner);

    if (banner) {
      const timer = setTimeout(() => setAlertBanner(null), 10000);
      return () => clearTimeout(timer);
    }
  }, [addNotification]);

  const handleSaveSettings = () => {
    localStorage.setItem('fuelwatch-settings', JSON.stringify(settings));
    addNotification('success', 'Settings saved successfully!', 'settings', true);
    setShowSettings(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Header
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
        onOpenSettings={() => setShowSettings(true)}
      />

      {alertBanner && (
        <div
          className={`${
            alertBanner.type === 'warning' ? 'bg-yellow-600' : 'bg-orange-600'
          } text-white px-4 py-3 flex items-center justify-between animate-fade-in`}
        >
          <div className="flex items-center gap-2">
            <AlertCircle size={20} />
            <span className="text-sm font-medium">{alertBanner.message}</span>
          </div>
          <button
            onClick={() => setAlertBanner(null)}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      )}

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'stocks' && <LiveStatsPanel />}
        {activeTab === 'predictions' && <PredictionsPanel />}
        {activeTab === 'employees' && <EmployeePanel />}
      </main>

      <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
        {toasts.map(toast => (
          <Toast key={toast.id} notification={toast} onDismiss={dismissToast} />
        ))}
      </div>

      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full shadow-2xl border border-gray-700 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold">Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium mb-4">Station Configuration</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Station Name</label>
                    <input
                      type="text"
                      value={settings.stationName}
                      onChange={(e) => setSettings({ ...settings, stationName: e.target.value })}
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Operating Hours</label>
                    <input
                      type="text"
                      value={settings.operatingHours}
                      onChange={(e) => setSettings({ ...settings, operatingHours: e.target.value })}
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium mb-4">Notification Preferences</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 text-gray-300">
                    <input
                      type="checkbox"
                      checked={settings.emailAlerts}
                      onChange={(e) => setSettings({ ...settings, emailAlerts: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span>Email alerts for low stock</span>
                  </label>
                  <label className="flex items-center gap-3 text-gray-300">
                    <input
                      type="checkbox"
                      checked={settings.smsAlerts}
                      onChange={(e) => setSettings({ ...settings, smsAlerts: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span>SMS alerts for critical stock</span>
                  </label>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Low Stock Threshold (%)</label>
                    <input
                      type="number"
                      value={settings.lowStockThreshold}
                      onChange={(e) => setSettings({ ...settings, lowStockThreshold: Number(e.target.value) })}
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium mb-4">Employee Settings</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 text-gray-300">
                    <input
                      type="checkbox"
                      checked={settings.requireLocation}
                      onChange={(e) => setSettings({ ...settings, requireLocation: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span>Require location verification</span>
                  </label>
                  <label className="flex items-center gap-3 text-gray-300">
                    <input
                      type="checkbox"
                      checked={settings.requireDeviceId}
                      onChange={(e) => setSettings({ ...settings, requireDeviceId: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span>Require device ID matching</span>
                  </label>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Check-in Radius (meters)</label>
                    <input
                      type="number"
                      value={settings.checkInRadius}
                      onChange={(e) => setSettings({ ...settings, checkInRadius: Number(e.target.value) })}
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSaveSettings}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors font-medium"
                >
                  Save Settings
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;