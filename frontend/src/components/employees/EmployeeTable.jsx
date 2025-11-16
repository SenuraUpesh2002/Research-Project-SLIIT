import { useState } from 'react';
import { Search, Edit2, Trash2, History, User, UserPlus } from 'lucide-react';
import { getTimeAgo } from '../../utils/helpers';

export const EmployeeTable = ({ employees, onDelete, onCheckOut, onAddClick }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === 'All' ||
      (filter === 'Active' && emp.status === 'checked-in') ||
      (filter === 'Inactive' && emp.status === 'off-duty');

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Employee Management</h3>
        <button
          onClick={onAddClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
        >
          <UserPlus size={16} />
          Add Employee
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Employees</option>
          <option value="Active">Active (Checked In)</option>
          <option value="Inactive">Inactive (Checked Out)</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Employee</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">ID</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Role</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Last Activity</th>
              <th className="text-right py-3 px-4 text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">
                  No employees found.
                </td>
              </tr>
            ) : (
              filteredEmployees.map(emp => (
                <tr
                  key={emp.id}
                  className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
                >
                  {/* Employee Info */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        <User size={20} />
                      </div>
                      <div>
                        <div className="text-white font-medium">{emp.name}</div>
                        <div className="text-xs text-gray-400">{emp.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* ID */}
                  <td className="py-4 px-4 text-gray-300">{emp.employeeId}</td>

                  {/* Role */}
                  <td className="py-4 px-4 text-gray-300">{emp.role}</td>

                  {/* Status */}
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        emp.status === 'checked-in'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}
                    >
                      {emp.status === 'checked-in' ? 'Checked In' : 'Checked Out'}
                    </span>
                  </td>

                  {/* Last Activity */}
                  <td className="py-4 px-4 text-gray-300">
                    {getTimeAgo(emp.lastActivity)}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      {emp.status === 'checked-in' && (
                        <button
                          onClick={() => onCheckOut(emp.id)}
                          className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                          title="Check Out"
                        >
                          Check Out
                        </button>
                      )}
                      <button
                        className="p-2 text-gray-400 hover:bg-gray-700 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:bg-gray-700 rounded-lg transition-colors"
                        title="View History"
                      >
                        <History size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(emp.id)}
                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                        title="Delete"
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