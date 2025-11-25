// Fuel types available at the station
export const FUEL_TYPES = ['Petrol 92', 'Petrol 95', 'Diesel'];

// Employee roles in the system
export const ROLES = ['Manager', 'Attendant', 'Supervisor', 'Technician'];

// Status colors for UI (Tailwind classes)
export const STATUS_COLORS = {
  Available: 'bg-green-500',
  'Low Stock': 'bg-yellow-500',
  Critical: 'bg-red-500',
  'Checked In': 'bg-green-500',
  'Checked Out': 'bg-gray-500',
};

// Auto-refresh interval (ms)
export const REFRESH_INTERVAL = 10000; // 10 seconds

// Toast/notification auto-dismiss time (ms)
export const NOTIFICATION_DISMISS_TIME = 5000; // 5 seconds

// Stock level thresholds (%)
export const LOW_STOCK_THRESHOLD = 20;     // < 20% → Low Stock
export const CRITICAL_STOCK_THRESHOLD = 10; // < 10% → Critical

// Geofencing: Max distance for check-in (meters)
export const CHECK_IN_RADIUS = 100;

// Chart colors for fuel types
export const CHART_COLORS = {
  'Petrol 92': '#3b82f6',  // Blue
  'Petrol 95': '#10b981',  // Green
  Diesel: '#f59e0b',       // Amber
};
