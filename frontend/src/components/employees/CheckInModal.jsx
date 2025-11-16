import { useState } from 'react';
import { X, MapPin, Smartphone, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const CheckInModal = ({ isOpen, onClose, onCheckIn }) => {
  const [step, setStep] = useState('scan'); // 'scan' | 'confirm' | 'success'
  const [loading, setLoading] = useState(false);
  const [scannedData, setScannedData] = useState({
    employeeId: '',
    name: '',
    role: '',
    location: { lat: 6.9271, lng: 79.8612 }, // Default: Colombo, Sri Lanka
    deviceId: 'DEV-' + Math.random().toString(36).substr(2, 6),
  });

  if (!isOpen) return null;

  const simulateScan = () => {
    setLoading(true);
    setTimeout(() => {
      setScannedData({
        employeeId: 'EMP004',
        name: 'Alex Thompson',
        role: 'Attendant',
        location: { lat: 6.9271, lng: 79.8612 }, // Colombo
        deviceId: 'DEV-' + Math.random().toString(36).substr(2, 6),
      });
      setStep('confirm');
      setLoading(false);
    }, 1500);
  };

  const handleConfirmCheckIn = () => {
    setLoading(true);
    setTimeout(() => {
      onCheckIn(scannedData.employeeId, scannedData.deviceId, true);
      setStep('success');
      setLoading(false);
      setTimeout(() => {
        onClose();
        setStep('scan');
        setScannedData(prev => ({
          ...prev,
          employeeId: '',
          name: '',
          role: '',
        }));
      }, 2000);
    }, 1000);
  };

  const currentTime = new Date().toLocaleTimeString('en-US', {
    timeZone: 'Asia/Colombo',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Employee Check-In</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Step: Scan */}
        {step === 'scan' && (
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-lg p-8 text-center">
              <div className="w-48 h-48 mx-auto bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                {loading ? (
                  <LoadingSpinner size={48} />
                ) : (
                  <div className="text-gray-600">
                    <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 3h4v4H3V3zm0 6h4v4H3V9zm6-6h4v4H9V3zm6 0h4v4h-4V3zm-6 6h4v4H9V9zm6 0h4v4h-4V9zM3 15h4v4H3v-4zm12 0h4v4h-4v-4zm-6 0h4v4H9v-4z" />
                    </svg>
                  </div>
                )}
              </div>
              <p className="text-gray-400 text-sm">Scan employee QR code to check in</p>
            </div>
            <button
              onClick={simulateScan}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors disabled:opacity-50 font-medium"
            >
              {loading ? 'Scanning...' : 'Simulate QR Scan'}
            </button>
          </div>
        )}

        {/* Step: Confirm */}
        {step === 'confirm' && (
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {scannedData.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="text-white font-semibold text-lg">{scannedData.name}</div>
                  <div className="text-gray-400 text-sm">{scannedData.employeeId}</div>
                  <div className="text-gray-500 text-sm">{scannedData.role}</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-green-400">
                  <MapPin size={16} />
                  <span>Location: {scannedData.location.lat.toFixed(4)}, {scannedData.location.lng.toFixed(4)}</span>
                  <CheckCircle size={16} />
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Smartphone size={16} />
                  <span>Device: {scannedData.deviceId}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock size={16} />
                  <span>Time: {currentTime}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleConfirmCheckIn}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors disabled:opacity-50 font-medium"
            >
              {loading ? 'Checking In...' : 'Confirm Check-In'}
            </button>
          </div>
        )}

        {/* Step: Success */}
        {step === 'success' && (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-green-400" size={48} />
            </div>
            <h4 className="text-2xl font-semibold text-white mb-2">Check-In Successful!</h4>
            <p className="text-gray-400">{scannedData.name} has been checked in.</p>
          </div>
        )}
      </div>
    </div>
  );
};