'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import EmployeeCard from '../components/EmployeeCard';
import {
    Users, UserCheck, Search, Filter, Plus,
    MoreVertical, Clock, Mail, Phone,
    Briefcase, Calendar, Shield, Activity
} from 'lucide-react';

const EmployeeDetailsTab = () => {
    const [employees, setEmployees] = useState([]);
    const [allEmployees, setAllEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('active');
    const [filter, setFilter] = useState('all'); // eslint-disable-line no-unused-vars
    const [searchQuery, setSearchQuery] = useState('');
    const [stats, setStats] = useState({
        active: 0,
        registered: 0,
        managers: 0,
        morning: 0,
        afternoon: 0,
        evening: 0
    });
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [showEmployeeModal, setShowEmployeeModal] = useState(false);

    // Safe user parsing
    let user = null;
    try {
        const userJson = localStorage.getItem('user');
        if (userJson && userJson !== 'null' && userJson !== 'undefined') {
            user = JSON.parse(userJson);
        }
    } catch (err) { // eslint-disable-line no-unused-vars
        console.warn('Failed to parse user from localStorage');
    }
    const isAdmin = user?.role === 'manager';

    // Calculate statistics
    const calculateStats = () => {
        const active = employees.length;
        const registered = allEmployees.length;
        const managers = allEmployees.filter(e => e.role === 'manager').length;
        const morning = employees.filter(e => e.shift_type === 'morning').length;
        const afternoon = employees.filter(e => e.shift_type === 'afternoon').length;
        const evening = employees.filter(e => e.shift_type === 'evening').length;

        setStats({
            active,
            registered,
            managers,
            morning,
            afternoon,
            evening
        });
    };

    // Data fetching
    const fetchActiveEmployees = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:3001/api/attendance/active', {
                headers: { 'x-auth-token': token },
            });
            setEmployees(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchAllEmployees = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:3001/api/employees', {
                headers: { 'x-auth-token': token },
            });
            setAllEmployees(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchData = async () => {
        await Promise.all([fetchActiveEmployees(), fetchAllEmployees()]);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchActiveEmployees, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        calculateStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [employees, allEmployees]);

    // Filters
    const filteredActive = employees.filter((emp) => {
        const matchFilter = filter === 'all' || emp.shift_type === filter;
        const matchSearch = emp.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.email?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchFilter && matchSearch;
    });

    const filteredAll = allEmployees.filter((emp) =>
        emp.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.employee_id?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleEmployeeSelect = (emp) => {
        setSelectedEmployee(emp);
        setShowEmployeeModal(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[600px]">
                <div className="text-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                        className="w-16 h-16 mx-auto mb-6 rounded-full border-4 border-t-indigo-600 border-r-purple-600 border-b-pink-600 border-l-transparent"
                    />
                    <p className="text-lg font-light text-gray-500">Loading workforce data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Header with Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                <div>
                    <h1 className="text-5xl font-light tracking-tight text-gray-900">Workforce Management</h1>
                    <p className="text-xl text-gray-500 mt-3">
                        Real-time staff visibility • Performance tracking • Resource optimization
                    </p>
                </div>

                {/* Stats Grid - Simplified */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                                <UserCheck className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-blue-600 font-medium">Active Now</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.active}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-2xl p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                                <Users className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-emerald-600 font-medium">Total Staff</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.registered}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Controls Bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-3xl border border-gray-200 p-6"
            >
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                    {/* View Mode Toggle */}
                    <div className="inline-flex bg-gray-100 rounded-xl p-1">
                        <button
                            onClick={() => setViewMode('active')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${viewMode === 'active'
                                ? 'bg-white shadow-sm text-gray-900'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Activity className="w-4 h-4" />
                            <span className="font-medium">Live Active</span>
                            <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
                                {employees.length}
                            </span>
                        </button>
                        <button
                            onClick={() => setViewMode('registered')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${viewMode === 'registered'
                                ? 'bg-white shadow-sm text-gray-900'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Users className="w-4 h-4" />
                            <span className="font-medium">All Employees</span>
                            <span className="ml-2 px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded-full">
                                {allEmployees.length}
                            </span>
                        </button>
                    </div>

                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name, email, or ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Content Area */}
            <motion.div
                layout
                className="space-y-6"
            >
                <AnimatePresence mode="popLayout">
                    {viewMode === 'active' ? (
                        // Active Employees Grid
                        <motion.div
                            layout
                            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                        >
                            {filteredActive.length ? (
                                filteredActive.map((emp) => (
                                    <motion.div
                                        key={emp.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        whileHover={{ y: -4 }}
                                        onClick={() => handleEmployeeSelect(emp)}
                                        className="cursor-pointer"
                                    >
                                        <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-lg transition-all">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                                                        <span className="text-xl font-semibold text-blue-600">
                                                            {emp.full_name.charAt(0)}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-900">{emp.full_name}</h3>
                                                        <p className="text-sm text-gray-500">{emp.email}</p>
                                                    </div>
                                                </div>
                                                <div className={`px-3 py-1 rounded-full text-xs font-medium ${emp.shift_type === 'morning' ? 'bg-amber-100 text-amber-700' :
                                                    emp.shift_type === 'afternoon' ? 'bg-rose-100 text-rose-700' :
                                                        'bg-indigo-100 text-indigo-700'
                                                    }`}>
                                                    {emp.shift_type}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mt-4">
                                                <div className="flex items-center gap-2">
                                                    <Briefcase className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm text-gray-600">{emp.role}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm text-gray-600">
                                                        {new Date(emp.checkin_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-2 text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200">
                                    <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-600 mb-2">No active employees</h3>
                                    <p className="text-gray-400">Try changing your filter or search query</p>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        // All Employees Table
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
                        >
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-200">
                                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Employee</th>
                                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Role</th>
                                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Status</th>
                                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Contact</th>
                                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredAll.map((emp) => (
                                            <motion.tr
                                                key={emp.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                whileHover={{ backgroundColor: 'rgba(249, 250, 251, 1)' }}
                                                className="border-b border-gray-100 last:border-b-0"
                                            >
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                                            <span className="font-medium text-gray-700">{emp.full_name.charAt(0)}</span>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">{emp.full_name}</p>
                                                            <p className="text-sm text-gray-500">{emp.employee_id}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${emp.role === 'manager' ? 'bg-purple-100 text-purple-700' :
                                                        emp.role === 'admin' ? 'bg-red-100 text-red-700' :
                                                            'bg-blue-100 text-blue-700'
                                                        }`}>
                                                        <Briefcase className="w-3 h-3" />
                                                        {emp.role}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${emp.is_active
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        <div className={`w-1.5 h-1.5 rounded-full ${emp.is_active ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                                                        {emp.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <Mail className="w-3 h-3 text-gray-400" />
                                                            <span className="text-sm text-gray-600">{emp.email}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleEmployeeSelect(emp)}
                                                            className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                                                        >
                                                            View
                                                        </button>
                                                        {isAdmin && (
                                                            <>
                                                                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                                    <MoreVertical className="w-4 h-4" />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {filteredAll.length === 0 && (
                                <div className="text-center py-16">
                                    <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-600 mb-2">No employees found</h3>
                                    <p className="text-gray-400">Try a different search term</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Employee Detail Modal */}
            <AnimatePresence>
                {showEmployeeModal && selectedEmployee && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowEmployeeModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            {/* Modal content */}
                            <div className="p-8">
                                <div className="flex items-start justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                                            <span className="text-2xl font-bold text-blue-600">
                                                {selectedEmployee.full_name.charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">{selectedEmployee.full_name}</h2>
                                            <p className="text-gray-500">{selectedEmployee.employee_id}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowEmployeeModal(false)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <span className="sr-only">Close</span>
                                        <span className="text-gray-400 hover:text-gray-600">✕</span>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-3">CONTACT INFORMATION</h3>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <Mail className="w-5 h-5 text-gray-400" />
                                                    <span className="text-gray-700">{selectedEmployee.email}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-3">EMPLOYMENT DETAILS</h3>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-600">Role</span>
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${selectedEmployee.role === 'manager' ? 'bg-purple-100 text-purple-700' :
                                                        selectedEmployee.role === 'admin' ? 'bg-red-100 text-red-700' :
                                                            'bg-blue-100 text-blue-700'
                                                        }`}>
                                                        {selectedEmployee.role}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-600">Status</span>
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${selectedEmployee.is_active
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        {selectedEmployee.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {selectedEmployee.checkin_time && (
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500 mb-3">CURRENT SESSION</h3>
                                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-sm font-medium text-blue-700">Checked In</span>
                                                        <span className="text-xs text-blue-600">
                                                            {new Date(selectedEmployee.checkin_time).toLocaleTimeString()}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-blue-600">Shift</span>
                                                        <span className={`px-2 py-1 rounded text-xs font-medium ${selectedEmployee.shift_type === 'morning' ? 'bg-amber-200 text-amber-700' :
                                                            selectedEmployee.shift_type === 'afternoon' ? 'bg-rose-200 text-rose-700' :
                                                                'bg-indigo-200 text-indigo-700'
                                                            }`}>
                                                            {selectedEmployee.shift_type}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-3">PERFORMANCE METRICS</h3>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="bg-gray-50 rounded-lg p-3">
                                                    <p className="text-xs text-gray-500">Avg. Hours</p>
                                                    <p className="text-lg font-semibold text-gray-900">8.2</p>
                                                </div>
                                                <div className="bg-gray-50 rounded-lg p-3">
                                                    <p className="text-xs text-gray-500">Productivity</p>
                                                    <p className="text-lg font-semibold text-emerald-600">94%</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {isAdmin && (
                                    <div className="mt-8 pt-8 border-t border-gray-200">
                                        <div className="flex justify-end gap-3">
                                            <button className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                                Edit Profile
                                            </button>
                                            <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                                Send Message
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EmployeeDetailsTab;