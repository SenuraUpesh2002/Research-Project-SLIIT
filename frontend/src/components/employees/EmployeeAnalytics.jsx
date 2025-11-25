// src/components/employees/EmployeeAnalytics.jsx
import { useState, useEffect } from 'react';
import { Users, UserCheck, Clock, TrendingUp, Calendar, Loader2 } from 'lucide-react';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import employeesAPI from '../../services/api/employeesAPI';
import attendanceAPI from '../../services/api/attendanceAPI';
import { format } from 'date-fns';

const COLORS = ['#10b981', '#6b7280']; // Green = Checked In, Gray = Checked Out

export const EmployeeAnalytics = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    currentlyCheckedIn: 0,
    onTimeRate: 0,
    avgHoursToday: 0,
  });
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Date range state
  const today = new Date();
  const [startDate, setStartDate] = useState(
    format(new Date(today.setDate(today.getDate() - 6)), 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const fetchAnalytics = async () => {
    setLoading(true);
    setError('');

    try {
      // Fetch employees
      const empRes = await employeesAPI.getAll();
      const employees = empRes.success ? empRes.data : [];

      // Fetch attendance stats
      const attRes = await attendanceAPI.getStatistics(startDate, endDate);
      const attStats = attRes.success ? attRes.data : {};

      // Fetch weekly breakdown
      const weeklyRes = await attendanceAPI.getWeeklyBreakdown(startDate, endDate);
      const weekly = weeklyRes.success ? weeklyRes.data : [];

      // Update state
      setStats({
        totalEmployees: employees.length,
        currentlyCheckedIn: attStats.currently_checked_in || 0,
        onTimeRate: attStats.on_time_rate ? Math.round(attStats.on_time_rate) : 0,
        avgHoursToday: attStats.avg_hours_today ? attStats.avg_hours_today.toFixed(1) : 0,
      });

      setWeeklyData(weekly.map(day => ({
        day: format(new Date(day.date), 'EEE'),
        onTime: day.on_time || 0,
        late: day.late || 0,
      })));

    } catch (err) {
      setError('Failed to load analytics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [startDate, endDate]);

  const pieData = [
    { name: 'Checked In', value: stats.currentlyCheckedIn, color: '#10b981' },
    { name: 'Checked Out', value: stats.totalEmployees - stats.currentlyCheckedIn, color: '#6b7280' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-blue-500" size={48} />
        <span className="ml-4 text-xl text-gray-400">Loading analytics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 text-red-400">
        <p className="text-xl">{error}</p>
        <button onClick={fetchAnalytics} className="mt-4 text-blue-400 underline">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Date Range Filter */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="text-blue-400" size={24} />
            <h2 className="text-2xl font-bold text-white">Employee Analytics</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-400">From:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-gray-700 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-400">To:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                max={format(new Date(), 'yyyy-MM-dd')}
                className="bg-gray-700 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <Users size={28} />
            <span className="text-sm opacity-90">Total Employees</span>
          </div>
          <p className="text-4xl font-bold">{stats.totalEmployees}</p>
        </div>

        <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <UserCheck size={28} />
            <span className="text-sm opacity-90">Currently Checked In</span>
          </div>
          <p className="text-4xl font-bold">{stats.currentlyCheckedIn}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp size={28} />
            <span className="text-sm opacity-90">On-Time Rate</span>
          </div>
          <p className="text-4xl font-bold">{stats.onTimeRate}%</p>
        </div>

        <div className="bg-gradient-to-br from-orange-900 to-orange-800 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <Clock size={28} />
            <span className="text-sm opacity-90">Avg Hours Today</span>
          </div>
          <p className="text-4xl font-bold">{stats.avgHoursToday}h</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Attendance */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 shadow-xl border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-6">Weekly Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="4 4" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#9CA3AF' }}
              />
              <Legend />
              <Bar dataKey="onTime" fill="#10b981" name="On Time" radius={[8, 8, 0, 0]} />
              <Bar dataKey="late" fill="#f59e0b" name="Late" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Current Status Pie */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 shadow-xl border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-6">Current Employee Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
                labelStyle={{ fill: '#fff', fontSize: '14px' }}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};