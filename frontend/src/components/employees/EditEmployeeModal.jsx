import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ROLES } from '../../utils/constants';
import employeesAPI from '../../services/api/employeesAPI';

export const EditEmployeeModal = ({ isOpen, onClose, onUpdated, employee }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: ROLES[0] || 'Cashier',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (employee) {
            setFormData({
                name: employee.name || '',
                email: employee.email || '',
                phone: employee.phone || '',
                role: employee.role || ROLES[0],
            });
        }
    }, [employee]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await employeesAPI.update(employee.id, formData);

            if (response.success) {
                onUpdated?.(response.data);
                onClose();
            }
        } catch (err) {
            const msg =
                err.response?.data?.error ||
                err.message ||
                'Failed to update employee. Please try again.';
            setError(msg);
            console.error('Update employee error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-700">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white">Edit Employee</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition"
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-300 text-sm">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <input
                        type="text"
                        required
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />

                    <input
                        type="email"
                        required
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value.trim() })}
                        className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />

                    <input
                        type="tel"
                        placeholder="Phone (optional)"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />

                    <select
                        required
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    >
                        {ROLES.map((role) => (
                            <option key={role} value={role}>
                                {role}
                            </option>
                        ))}
                    </select>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3.5 font-semibold text-white rounded-lg transition ${loading
                            ? 'bg-blue-800 cursor-not-allowed opacity-70'
                            : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                            }`}
                    >
                        {loading ? 'Updating...' : 'Update Employee'}
                    </button>
                </form>
            </div>
        </div>
    );
};
