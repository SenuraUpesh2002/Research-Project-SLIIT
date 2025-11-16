import { useState } from 'react';
import { X, User } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { ROLES } from '../../utils/constants';

export const AddEmployeeModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    role: ROLES[0],
    phone: '',
    email: '',
  });
  const [showQR, setShowQR] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    setShowQR(true);

    // Auto-close after 3 seconds
    setTimeout(() => {
      onClose();
      setShowQR(false);
      setFormData({
        name: '',
        employeeId: '',
        role: ROLES[0],
        phone: '',
        email: '',
      });
    }, 3000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl border border-gray-700 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Add New Employee</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form or QR */}
        {!showQR ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>

            {/* Employee ID */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Employee ID</label>
              <input
                type="text"
                required
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="EMP001"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {ROLES.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Phone</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="077 123 4567"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="john@fuelwatch.lk"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors font-medium"
            >
              Save Employee
            </button>
          </form>
        ) : (
          /* QR Success Screen */
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <User className="text-green-400" size={40} />
            </div>
            <h4 className="text-xl font-semibold text-white">Employee Added!</h4>
            <p className="text-gray-400 text-sm">Personal QR Code Generated</p>

            {/* QR Code */}
            <div className="bg-white p-4 rounded-lg inline-block">
              <QRCodeSVG
                value={JSON.stringify({
                  employeeId: formData.employeeId,
                  name: formData.name,
                  station: 'Central Station',
                  timestamp: new Date().toISOString(),
                })}
                size={150}
                level="H"
              />
            </div>

            <p className="text-xs text-gray-500">
              Save this QR code for employee check-ins
            </p>
          </div>
        )}
      </div>
    </div>
  );
};