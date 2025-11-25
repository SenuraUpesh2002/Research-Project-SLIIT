// components/EmployeeTable.jsx
import { useState } from 'react';
import { Search, Edit2, Trash2, History, User, UserPlus, LogOut, Loader2 } from 'lucide-react';
import { getTimeAgo } from '../../utils/helpers';

export const EmployeeTable = ({
  employees = [],
  attendance = [], // currently checked-in employees
  loading = false,
  error = null,
  onDelete,
  onCheckOut,
  onAddClick,
  onEditClick,
  onHistoryClick
}) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  // Combine employees with their current attendance status
  const enrichedEmployees = employees.map(emp => {
    const activeRecord = attendance.find(a => a.employee_email === emp.email && !a.check_out_time);
    const isCheckedIn = !!activeRecord;

    return {
      ...emp,
      status: isCheckedIn ? 'checked-in' : 'checked-out',
      lastActivity: isCheckedIn
        ? activeRecord.check_in_time
        : emp.updated_at || emp.created_at
    };
  });

  // Filtering logic
  const filteredEmployees = enrichedEmployees.filter(emp => {
    const matchesSearch =
      emp.name?.toLowerCase().includes(search.toLowerCase()) ||
      emp.employee_id?.toLowerCase().includes(search.toLowerCase()) ||
      emp.email?.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === 'All' ||
      (filter === 'Checked In' && emp.status === 'checked-in') ||
      (filter === 'Checked Out' && emp.status === 'checked-out');

    return matchesSearch && matchesFilter;
  });

  // Loading State
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-10 shadow-lg border border-gray-700">
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-blue-500" size={48} />
          <p className="mt-4 text-gray-400">Loading employees...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-10 shadow-lg border border-gray-700">
        <div className="text-center py-20">
          <div className="text-red-400 text-xl mb-2">Failed to load employees</div>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">Employee Management</h3>
        <button
          onClick={onAddClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg transition-all flex items-center gap-2 font-medium shadow-md"
        >
          <UserPlus size={18} />
          Add Employee
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name, ID, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-700 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-gray-700 text-white px-5 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Employees</option>
          <option value="Checked In">Checked In</option>
          <option value="Checked Out">Checked Out</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-4 px-4 text-gray-400 font-medium">Employee</th>
              <th className="text-left py-4 px-4 text-gray-400 font-medium">ID</th>
              <th className="text-left py-4 px-4 text-gray-400 font-medium">Phone</th>
              <th className="text-left py-4 px-4 text-gray-400 font-medium">Role</th>
              <th className="text-left py-4 px-4 text-gray-400 font-medium">Status</th>
              <th className="text-left py-4 px-4 text-gray-400 font-medium">Last Activity</th>
              <th className="text-right py-4 px-4 text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-16 text-gray-500 text-lg">
                  {search || filter !== 'All'
                    ? 'No employees match your search.'
                    : 'No employees found. Add your first employee!'}
                </td>
              </tr>
            ) : (
              filteredEmployees.map(emp => (
                <tr
                  key={emp.id}
                  className="border-b border-gray-700/50 hover:bg-gray-700/40 transition-all"
                >
                  {/* Employee Info */}
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {emp.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-white font-semibold">{emp.name}</div>
                        <div className="text-xs text-gray-400">{emp.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Employee ID */}
                  <td className="py-5 px-4">
                    <span className="font-mono text-blue-400 text-sm">{emp.employee_id}</span>
                  </td>

                  {/* Phone */}
                  <td className="py-5 px-4 text-gray-300 text-sm">{emp.phone || '-'}</td>

                  {/* Role */}
                  <td className="py-5 px-4 text-gray-300 capitalize">{emp.role}</td>

                  {/* Status */}
                  <td className="py-5 px-4">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider ${emp.status === 'checked-in'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-gray-600/30 text-gray-400 border border-gray-600/40'
                        }`}
                    >
                      {emp.status === 'checked-in' ? 'CHECKED IN' : 'CHECKED OUT'}
                    </span>
                  </td>

                  {/* Last Activity */}
                  <td className="py-5 px-4 text-gray-300 text-sm">
                    {getTimeAgo(emp.lastActivity)}
                  </td>

                  {/* Actions */}
                  <td className="py-5 px-4">
                    <div className="flex items-center justify-end gap-2">
                      {/* Check Out Button */}
                      {emp.status === 'checked-in' && (
                        <button
                          onClick={() => onCheckOut(emp.email)} // uses email as identifier
                          className="p-2.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-lg transition-all group"
                          title="Check Out"
                        >
                          <LogOut size={16} className="group-hover:scale-110 transition" />
                        </button>
                      )}

                      {/* Edit */}
                      <button
                        onClick={() => onEditClick?.(emp)}
                        className="p-2.5 text-gray-400 hover:bg-gray-700 rounded-lg transition-all"
                        title="Edit Employee"
                      >
                        <Edit2 size={16} />
                      </button>

                      {/* History */}
                      <button
                        onClick={() => onHistoryClick?.(emp)}
                        className="p-2.5 text-gray-400 hover:bg-gray-700 rounded-lg transition-all"
                        title="View Attendance History"
                      >
                        <History size={16} />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => onDelete(emp.id)}
                        className="p-2.5 text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
                        title="Delete Employee"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
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