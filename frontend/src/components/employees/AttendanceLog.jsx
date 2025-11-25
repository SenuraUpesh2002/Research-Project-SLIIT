// src/components/employees/AttendanceLog.jsx
import { useState, useEffect } from 'react';
import { Download, Calendar, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import attendanceAPI from '../../services/api/attendanceAPI';
import { format } from 'date-fns/format';
import { toast } from 'react-toastify';

export const AttendanceLog = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Default: today
  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  // Fetch attendance records
  const fetchAttendance = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await attendanceAPI.getByDateRange(startDate, endDate);
      if (res.success) {
        setRecords(res.data || []);
      } else {
        throw new Error(res.error || 'Failed to fetch attendance');
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Network error';
      setError(msg);
      toast.error(msg);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [startDate, endDate]);

  // Calculate hours worked
  const getHoursWorked = (checkIn, checkOut) => {
    if (!checkOut) return '-';
    const diffMs = new Date(checkOut) - new Date(checkIn);
    const hours = diffMs / (1000 * 60 * 60);
    return hours.toFixed(2);
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      'Date',
      'Employee Email',
      'Check-In Time',
      'Check-Out Time',
      'Hours Worked',
      'Location Verified',
      'Device Verified',
      'Device ID'
    ];

    const rows = records.map(r => [
      format(new Date(r.check_in_time), 'dd/MM/yyyy'),
      r.employee_email,
      format(new Date(r.check_in_time), 'hh:mm a'),
      r.check_out_time ? format(new Date(r.check_out_time), 'hh:mm a') : 'Active',
      getHoursWorked(r.check_in_time, r.check_out_time),
      r.location_verified ? 'Yes' : 'No',
      r.device_verified ? 'Yes' : 'No',
      r.device_id || '-'
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `attendance_${startDate}_to_${endDate}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border border-gray-700">
      {/* Header + Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="text-blue-400" size={28} />
          <h3 className="text-2xl font-bold text-white">Attendance Log</h3>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Start Date */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400">From:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={endDate}
              className="bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue.Randomized focus:ring-blue-500"
            />
          </div>

          {/* End Date */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400">To:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
              max={today}
              className="bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Export Button */}
          <button
            onClick={exportToCSV}
            disabled={loading || records.length === 0}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2 font-medium"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center py-20">
          <Loader2 className="animate-spin text-blue-500" size={48} />
          <p className="mt-4 text-gray-400">Loading attendance records...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="flex flex-col items-center py-16 text-center">
          <AlertCircle className="text-red-400 mb-3" size={48} />
          <p className="text-red-400 font-medium">Failed to load data</p>
          <p className="text-gray-500 text-sm mt-2">{error}</p>
          <button
            onClick={fetchAttendance}
            className="mt-4 text-blue-400 hover:text-blue-300 underline text-sm"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && records.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          No attendance records found for the selected date range.
        </div>
      )}

      {/* Table */}
      {!loading && !error && records.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Date</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Employee</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Check-In</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Check-Out</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Hours</th>
                <th className="text-center py-4 px-4 text-gray-400 font-medium">Location</th>
                <th className="text-center py-4 px-4 text-gray-400 font-medium">Device</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr
                  key={record.id}
                  className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-all"
                >
                  <td className="py-5 px-4 text-gray-300">
                    {format(new Date(record.check_in_time), 'dd MMM yyyy')}
                  </td>
                  <td className="py-5 px-4">
                    <div className="text-white font-medium">{record.employee_email}</div>
                  </td>
                  <td className="py-5 px-4 text-green-400 font-medium">
                    {format(new Date(record.check_in_time), 'hh:mm a')}
                  </td>
                  <td className="py-5 px-4">
                    {record.check_out_time ? (
                      <span className="text-gray-300">
                        {format(new Date(record.check_out_time), 'hh:mm a')}
                      </span>
                    ) : (
                      <span className="text-yellow-400 font-bold">ACTIVE</span>
                    )}
                  </td>
                  <td className="py-5 px-4 text-gray-300 font-mono">
                    {getHoursWorked(record.check_in_time, record.check_out_time)}h
                  </td>
                  <td className="py-5 px-4 text-center">
                    {record.location_verified ? (
                      <CheckCircle className="text-green-400 mx-auto" size={22} />
                    ) : (
                      <XCircle className="text-red-400 mx-auto" size={22} />
                    )}
                  </td>
                  <td className="py-5 px-4 text-center">
                    {record.device_verified ? (
                      <CheckCircle className="text-green-400 mx-auto" size={22} />
                    ) : (
                      <XCircle className="text-red-400 mx-auto" size={22} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};