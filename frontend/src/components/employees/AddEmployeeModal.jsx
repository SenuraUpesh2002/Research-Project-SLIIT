// components/modals/AddEmployeeModal.jsx
import { useState } from 'react';
import { X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { ROLES } from '../../utils/constants';
import employeesAPI from '../../services/api/employeesAPI'; // Correct import

export const AddEmployeeModal = ({ isOpen, onClose, onAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: ROLES[0] || 'Cashier',
    password: '',
    station_id: import.meta.env.VITE_STATION_ID || 'GAM-0001-07', // optional
    date_of_joining: new Date().toISOString().split('T')[0], // today
  });

  const [showQR, setShowQR] = useState(false);
  const [addedEmployee, setAddedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await employeesAPI.create(formData);

      // Backend returns: { success: true, data: { id, employee_id, qr_code, ... } }
      if (response.success) {
        const employee = response.data;

        setAddedEmployee(employee);
        setShowQR(true);

        // Notify parent (e.g. EmployeeList to refresh)
        onAdded?.(employee);

        // Auto-close after 4 seconds
        setTimeout(() => {
          onClose();
          resetForm();
        }, 4000);
      }
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.message ||
        'Failed to create employee. Please try again.';

      // Specific backend validation messages
      if (err.response?.status === 409) {
        setError('This email is already registered.');
      } else if (err.response?.status === 400) {
        setError(msg.includes('password') ? 'Password must be at least 6 characters.' : msg);
      } else {
        setError(msg);
      }

      console.error('Add employee error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: ROLES[0],
      password: '',
      station_id: import.meta.env.VITE_STATION_ID,
      date_of_joining: new Date().toISOString().split('T')[0],
    });
    setShowQR(false);
    setAddedEmployee(null);
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">Add New Employee</h3>
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
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
        {!showQR ? (
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

            <input
              type="password"
              required
              placeholder="Password (min 6 chars)"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 font-semibold text-white rounded-lg transition ${loading
                  ? 'bg-blue-800 cursor-not-allowed opacity-70'
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                }`}
            >
              {loading ? 'Creating Employee...' : 'Create Employee'}
            </button>
          </form>
        ) : (
          /* Success + QR Code */
          <div className="text-center space-y-6 py-8">
            <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div>
              <h4 className="text-2xl font-bold text-white mb-2">Employee Added!</h4>
              <p className="text-gray-400">QR Code is ready for scanning</p>
            </div>

            <div className="bg-white p-6 rounded-xl inline-block shadow-lg">
              <QRCodeSVG
                value={addedEmployee.qr_code} // This is the JSON string from backend
                size={180}
                level="H"
                includeMargin
              />
            </div>

            <div className="space-y-2">
              <p className="text-xl font-mono text-blue-400">{addedEmployee.employee_id}</p>
              <p className="text-sm text-gray-400">{addedEmployee.name}</p>
            </div>

            <p className="text-xs text-gray-500">Modal will close in 4 seconds...</p>
          </div>
        )}
      </div>
    </div>
  );
};