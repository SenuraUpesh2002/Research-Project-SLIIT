// src/services/mockData.js
import { generateId } from '../utils/helpers';

// Sri Lanka timezone: Asia/Colombo
const now = new Date();
const lkTime = (offsetMs) => new Date(now.getTime() + offsetMs);

/**
 * Generate mock fuel stock data
 */
export const generateMockFuelData = () => {
  return [
    {
      id: 'T1',
      type: 'Petrol 92',
      level: 3500 + Math.random() * 500, // 3500–4000L
      capacity: 5000,
      lastUpdated: lkTime(0),
    },
    {
      id: 'T2',
      type: 'Petrol 95',
      level: 2800 + Math.random() * 400, // 2800–3200L
      capacity: 5000,
      lastUpdated: lkTime(-1000 * 60 * 2), // 2 min ago
    },
    {
      id: 'T3',
      type: 'Diesel',
      level: 1500 + Math.random() * 300, // 1500–1800L
      capacity: 5000,
      lastUpdated: lkTime(-1000 * 60 * 5), // 5 min ago
    },
  ];
};

/**
 * Generate 24-hour chart data (hourly)
 */
export const generateMockChartData = () => {
  const data = [];
  const baseTime = lkTime(0);

  for (let i = 23; i >= 0; i--) {
    const time = new Date(baseTime.getTime() - i * 60 * 60 * 1000);
    data.push({
      time: time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Colombo',
      }),
      'Petrol 92': Math.max(3000, 4000 - i * 50 + Math.random() * 200),
      'Petrol 95': Math.max(2500, 3200 - i * 40 + Math.random() * 150),
      Diesel: Math.max(1200, 1800 - i * 30 + Math.random() * 100),
    });
  }

  return data.reverse(); // oldest → newest
};

/**
 * Generate mock employees (LK names, .lk emails)
 */
export const generateMockEmployees = () => {
  return [
    {
      id: generateId(),
      name: 'නිමල් පෙරේරා',
      employeeId: 'EMP001',
      role: 'Manager',
      phone: '077 712 3456',
      email: 'nimal@fuelwatch.lk',
      status: 'checked-in',
      lastActivity: lkTime(-1000 * 60 * 30), // 30 min ago
    },
    {
      id: generateId(),
      name: 'සුනිල් සිල්වා',
      employeeId: 'EMP002',
      role: 'Cashier',
      phone: '071 823 4567',
      email: 'sunil@fuelwatch.lk',
      status: 'checked-in',
      lastActivity: lkTime(-1000 * 60 * 15),
    },
    {
      id: generateId(),
      name: 'කමල් ප්‍රනාන්දු',
      employeeId: 'EMP003',
      role: 'Attendant',
      phone: '070 934 5678',
      email: 'kamal@fuelwatch.lk',
      status: 'off-duty',
      lastActivity: lkTime(-1000 * 60 * 60 * 3), // 3h ago
    },
    {
      id: generateId(),
      name: 'රුවන් ජයසිංහ',
      employeeId: 'EMP004',
      role: 'Supervisor',
      phone: '076 045 6789',
      email: 'ruwan@fuelwatch.lk',
      status: 'checked-in',
      lastActivity: lkTime(-1000 * 60 * 5),
    },
  ];
};

/**
 * Generate mock attendance records
 */
export const generateMockAttendance = () => {
  return [
    {
      id: generateId(),
      employeeId: 'EMP001',
      employeeName: 'නිමල් පෙරේරා',
      checkIn: lkTime(-1000 * 60 * 60 * 8), // 8h ago
      checkOut: lkTime(-1000 * 60 * 60 * 1), // 1h ago
      locationVerified: true,
      deviceId: 'DEV-ABC123',
    },
    {
      id: generateId(),
      employeeId: 'EMP002',
      employeeName: 'සුනිල් සිල්වා',
      checkIn: lkTime(-1000 * 60 * 60 * 7),
      checkOut: null,
      locationVerified: true,
      deviceId: 'DEV-XYZ789',
    },
    {
      id: generateId(),
      employeeId: 'EMP004',
      employeeName: 'රුවන් ජයසිංහ',
      checkIn: lkTime(-1000 * 60 * 60 * 2),
      checkOut: null,
      locationVerified: true,
      deviceId: 'DEV-MOB001',
    },
  ];
};

/**
 * Generate 30-day historical + 7-day predicted fuel usage
 */
export const generatePredictionData = () => {
  const data = [];
  const today = lkTime(0);
  const startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Past 30 days
  for (let i = 30; i >= 0; i--) {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const isToday = i === 30;
    data.push({
      date: date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        timeZone: 'Asia/Colombo',
      }),
      historical: isToday ? null : 14000 + Math.random() * 4000,
      predicted: isToday ? 15200 + Math.random() * 800 : null,
      isPast: !isToday,
    });
  }

  // Next 7 days
  for (let i = 1; i <= 7; i++) {
    const date = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
    data.push({
      date: date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        timeZone: 'Asia/Colombo',
      }),
      historical: null,
      predicted: 15200 - i * 400 + Math.random() * 1000,
      isPast: false,
    });
  }

  return data;
};