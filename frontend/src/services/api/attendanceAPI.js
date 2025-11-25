// services/api/attendanceAPI.js
import api from './api';

const attendanceAPI = {
  getByDateRange: (start, end) =>
    api.get(`/api/attendance?startDate=${start}&endDate=${end}`).then(res => res.data),
  getCurrentlyCheckedIn: () => api.get('/api/attendance/active').then(res => res.data),
  checkIn: (data) => api.post('/api/attendance/check-in', data).then(res => res.data),
  checkOut: (data) => api.post('/api/attendance/check-out', data).then(res => res.data),
  getStatistics: (start, end) => api.get(`/api/attendance/statistics?start=${start}&end=${end}`).then(res => res.data),
  getWeeklyBreakdown: (start, end) => api.get(`/api/attendance/weekly?start=${start}&end=${end}`).then(res => res.data),

  getTodayAttendance: () => {
    const today = new Date().toISOString().split('T')[0];
    return api.get(`/api/attendance?startDate=${today}&endDate=${today}`).then(res => res.data);
  },
};

export default attendanceAPI;