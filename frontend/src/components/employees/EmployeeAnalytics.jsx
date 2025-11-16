import { Users, UserCheck, Clock, TrendingUp } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const attendanceData = [
  { day: 'Mon', onTime: 8, late: 1 },
  { day: 'Tue', onTime: 9, late: 0 },
  { day: 'Wed', onTime: 7, late: 2 },
  { day: 'Thu', onTime: 8, late: 1 },
  { day: 'Fri', onTime: 9, late: 0 },
  { day: 'Sat', onTime: 6, late: 1 },
  { day: 'Sun', onTime: 5, late: 0 },
];

const performanceData = [
  { name: 'John Smith', daysPresent: 22, onTimePercent: 100, totalHours: 176, score: 98 },
  { name: 'Sarah Johnson', daysPresent: 21, onTimePercent: 95, totalHours: 168, score: 95 },
  { name: 'Mike Davis', daysPresent: 20, onTimePercent: 90, totalHours: 160, score: 90 },
];

export const EmployeeAnalytics = ({ employees }) => {
  const checkedIn = employees.filter(e => e.status === 'checked-in').length;
  const totalEmployees = employees.length;
  const onTimeRate = 94; // Can be calculated from real data later
  const avgHoursToday = 6.5; // Can be dynamic

  const statusData = [
    { name: 'Checked In', value: checkedIn, color: '#10b981' },
    { name: 'Checked Out', value: totalEmployees - checkedIn, color: '#6b7280' },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Users size={20} />
            <span className="text-sm opacity-80">Total Employees</span>
          </div>
          <p className="text-3xl font-bold">{totalEmployees}</p>
        </div>

        <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-lg p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <UserCheck size={20} />
            <span className="text-sm opacity-80">Currently Checked In</span>
          </div>
          <p className="text-3xl font-bold">{checkedIn}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} />
            <span className="text-sm opacity-80">On-Time Rate</span>
          </div>
          <p className="text-3xl font-bold">{onTimeRate}%</p>
        </div>

        <div className="bg-gradient-to-br from-orange-900 to-orange-800 rounded-lg p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={20} />
            <span className="text-sm opacity-80">Avg Hours Today</span>
          </div>
          <p className="text-3xl font-bold">{avgHoursToday}h</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Attendance Bar Chart */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-6">Weekly Attendance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
              <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Legend wrapperStyle={{ color: '#9CA3AF' }} />
              <Bar dataKey="onTime" fill="#10b981" name="On Time" />
              <Bar dataKey="late" fill="#f59e0b" name="Late" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Employee Status Pie Chart */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-6">Employee Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Rankings Table */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-6">Employee Performance Rankings</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Rank</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Name</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Days Present</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">On-Time %</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Total Hours</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Score</th>
              </tr>
            </thead>
            <tbody>
              {performanceData.map((emp, idx) => (
                <tr
                  key={emp.name}
                  className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
                >
                  <td className="py-4 px-4">
                    <span className="text-2xl">
                      {idx === 0 ? 'First' : idx === 1 ? 'Second' : idx === 2 ? 'Third' : idx + 1}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-white font-medium">{emp.name}</td>
                  <td className="py-4 px-4 text-right text-gray-300">{emp.daysPresent}</td>
                  <td className="py-4 px-4 text-right text-gray-300">{emp.onTimePercent}%</td>
                  <td className="py-4 px-4 text-right text-gray-300">{emp.totalHours}h</td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-green-400 font-bold">{emp.score}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};