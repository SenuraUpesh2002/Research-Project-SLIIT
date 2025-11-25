import { useState, useEffect } from 'react';
import axios from 'axios';
import EmployeeCard from '../components/EmployeeCard';

const EmployeeDetailsTab = () => {
    const [employees, setEmployees] = useState([]);
    const [allEmployees, setAllEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [viewMode, setViewMode] = useState('active');
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const user = JSON.parse(localStorage.getItem('user'));
    const isAdmin = user?.role === 'manager';

    const fetchActiveEmployees = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:3001/api/checkin/active', {
                headers: { 'x-auth-token': token }
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
                headers: { 'x-auth-token': token }
            });
            setAllEmployees(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            await Promise.all([fetchActiveEmployees(), fetchAllEmployees()]);
            setLoading(false);
        };
        loadData();

        const interval = setInterval(fetchActiveEmployees, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleEdit = (emp) => {
        setEditingEmployee({ ...emp });
        setShowEditModal(true);
    };

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:3001/api/employees/${editingEmployee.id}`,
                {
                    name: editingEmployee.name,
                    email: editingEmployee.email,
                    role: editingEmployee.role,
                    status: editingEmployee.status
                },
                { headers: { 'x-auth-token': token } }
            );

            setShowEditModal(false);
            fetchAllEmployees();
            alert('Employee updated successfully!');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update employee');
        }
    };

    const handleDelete = async (empId, empName) => {
        if (!confirm(`Are you sure you want to delete ${empName}? This action cannot be undone.`)) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3001/api/employees/${empId}`, {
                headers: { 'x-auth-token': token }
            });

            fetchAllEmployees();
            alert('Employee deleted successfully!');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete employee');
        }
    };

    const filteredEmployees = employees.filter(emp => {
        if (filter === 'all') return true;
        return emp.shift_type === filter;
    });

    if (loading) return <div className="text-center py-10 text-slate-500">Loading employee data...</div>;

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Employee Status</h2>
                    <p className="text-sm text-slate-500">
                        {viewMode === 'active' ? 'Currently active staff members' : 'All registered employees'}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div className="flex bg-slate-100 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('active')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition ${viewMode === 'active'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-slate-600 hover:text-slate-800'
                                }`}
                        >
                            Active ({employees.length})
                        </button>
                        <button
                            onClick={() => setViewMode('registered')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition ${viewMode === 'registered'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-slate-600 hover:text-slate-800'
                                }`}
                        >
                            All Registered ({allEmployees.length})
                        </button>
                    </div>

                    {viewMode === 'active' && (
                        <div className="flex space-x-2">
                            {['all', 'morning', 'afternoon', 'evening'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${filter === f
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                {viewMode === 'active' ? (
                    filteredEmployees.length > 0 ? (
                        filteredEmployees.map((emp) => (
                            <EmployeeCard key={emp.id} checkIn={emp} />
                        ))
                    ) : (
                        <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                            <p className="text-slate-500">No employees found for this shift.</p>
                        </div>
                    )
                ) : (
                    allEmployees.length > 0 ? (
                        allEmployees.map((emp) => (
                            <div key={emp.id} className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between hover:shadow-sm transition">
                                <div className="flex items-center space-x-4">
                                    <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                                        {emp.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-800">{emp.name}</h4>
                                        <p className="text-xs text-slate-500">{emp.employee_id} • {emp.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="text-right">
                                        <p className="text-xs text-slate-500">Role</p>
                                        <p className="font-medium text-slate-700 capitalize">{emp.role}</p>
                                    </div>

                                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${emp.status === 'active'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-slate-100 text-slate-600'
                                        }`}>
                                        {emp.status === 'active' ? 'Active' : 'Inactive'}
                                    </div>

                                    {isAdmin && (
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(emp)}
                                                className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(emp.id, emp.name)}
                                                className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                            <p className="text-slate-500">No registered employees found.</p>
                        </div>
                    )
                )}
            </div>

            {/* Edit Modal */}
            {showEditModal && editingEmployee && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Edit Employee</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={editingEmployee.name}
                                    onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={editingEmployee.email}
                                    onChange={(e) => setEditingEmployee({ ...editingEmployee, email: e.target.value })}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                                <select
                                    value={editingEmployee.role}
                                    onChange={(e) => setEditingEmployee({ ...editingEmployee, role: e.target.value })}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="attendant">Attendant</option>
                                    <option value="supervisor">Supervisor</option>
                                    <option value="manager">Manager</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                                <select
                                    value={editingEmployee.status}
                                    onChange={(e) => setEditingEmployee({ ...editingEmployee, status: e.target.value })}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex space-x-3 mt-6">
                            <button
                                onClick={handleUpdate}
                                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                            >
                                Update
                            </button>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="flex-1 bg-slate-200 text-slate-700 py-2 rounded hover:bg-slate-300 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeDetailsTab;
