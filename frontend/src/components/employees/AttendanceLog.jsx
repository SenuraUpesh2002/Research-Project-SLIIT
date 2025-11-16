import { Download, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { formatDate, calculateHoursWorked } from '../../utils/helpers';

export const AttendanceLog = ({ records }) => {
  const exportToCSV = () => {
    const csv = [
      ['Date', 'Employee Name', 'Check-In', 'Check-Out', 'Hours Worked', 'Location Verified', 'Device ID'],
      ...records.map(r => [
        formatDate(r.checkIn),
        r.employeeName,
        r.checkIn.toLocaleTimeString('en-US', { timeZone: 'Asia/Colombo' }),
        r.checkOut ? r.checkOut.toLocaleTimeString('en-US', { timeZone: 'Asia/Colombo' }) : 'Active',
        r.checkOut ? calculateHoursWorked(r.checkIn, r.checkOut).toString() : '-',
        r.locationVerified ? 'Yes' : 'No',
        r.deviceId || '—',
      ]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="text-blue-400" size={24} />
          <h3 className="text-xl font-semibold text-white">Attendance Log</h3>
        </div>
        <button
          onClick={exportToCSV}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Employee</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Check-In</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Check-Out</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Hours</th>
              <th className="text-center py-3 px-4 text-gray-400 font-medium">Location</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Device</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-500">
                  No attendance records yet.
                </td>
              </tr>
            ) : (
              records.map(record => (
                <tr
                  key={record.id}
                  className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
                >
                  <td className="py-4 px-4 text-gray-300">
                    {record.checkIn.toLocaleDateString('en-GB', { timeZone: 'Asia/Colombo' })}
                  </td>
                  <td className="py-4 px-4 text-white font-medium">{record.employeeName}</td>
                  <td className="py-4 px-4 text-gray-300">
                    {record.checkIn.toLocaleTimeString('en-US', { timeZone: 'Asia/Colombo' })}
                  </td>
                  <td className="py-4 px-4 text-gray-300">
                    {record.checkOut ? (
                      record.checkOut.toLocaleTimeString('en-US', { timeZone: 'Asia/Colombo' })
                    ) : (
                      <span className="text-green-400 font-medium">Active</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-gray-300">
                    {record.checkOut ? `${calculateHoursWorked(record.checkIn, record.checkOut)}h` : '-'}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {record.locationVerified ? (
                      <CheckCircle className="text-green-400 inline" size={20} />
                    ) : (
                      <XCircle className="text-red-400 inline" size={20} />
                    )}
                  </td>
                  <td className="py-4 px-4 text-gray-400 text-xs">
                    {record.deviceId || '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};