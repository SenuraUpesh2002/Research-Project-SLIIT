// src/components/employees/CheckInModal.jsx   ← keep .jsx
import { useState, useEffect, useRef } from 'react';
import { X, MapPin, Smartphone, Clock, CheckCircle, AlertCircle, QrCode } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import attendanceAPI from '../../services/api/attendanceAPI';
import { toast } from 'react-toastify';

export const CheckInModal = ({ isOpen, onClose, onCheckIn }) => {
  const [step, setStep] = useState('scan'); // 'scan' | 'confirm' | 'success' | 'error'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [location, setLocation] = useState(null); // { lat, lng }
  const [deviceId, setDeviceId] = useState('');
  const [scannedEmployee, setScannedEmployee] = useState(null);

  const scannerRef = useRef(null);
  const scannerContainerRef = useRef(null);

  // Generate persistent device ID
  useEffect(() => {
    let id = localStorage.getItem('device_id');
    if (!id) {
      id = 'DEV-' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('device_id', id);
    }
    setDeviceId(id);
  }, []);

  // Get user location
  useEffect(() => {
    if (!isOpen) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        toast.error('Location access denied');
        setLocation({ lat: 0, lng: 0 });
      },
      { enableHighAccuracy: true }
    );
  }, [isOpen]);

  // QR Scanner setup
  useEffect(() => {
    if (!isOpen || step !== 'scan' || !scannerContainerRef.current) return;

    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(
      (decodedText) => {
        try {
          const data = JSON.parse(decodedText);
          if (data.email) {
            setScannedEmployee(data);
            setStep('confirm');
            scanner.clear();
          } else {
            toast.error('Invalid QR code');
          }
        } catch (e) {
          toast.error('QR code not recognized');
        }
      },
      () => {}
    );

    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) scannerRef.current.clear();
    };
  }, [isOpen, step]);

  const handleConfirmCheckIn = async () => {
    if (!scannedEmployee?.email || !location) {
      toast.error('Missing location or employee data');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const payload = {
        employee_email: scannedEmployee.email,
        location_lat: location.lat,
        location_lng: location.lng,
        device_id: deviceId,
      };

      const res = await attendanceAPI.checkIn(payload);

      if (res.success) {
        toast.success('Checked in successfully!');
        onCheckIn?.(scannedEmployee);
        setStep('success');
        setTimeout(() => {
          onClose();
          resetModal();
        }, 2500);
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Check-in failed';
      setErrorMsg(msg);
      setStep('error');
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setStep('scan');
    setScannedEmployee(null);
    setErrorMsg('');
  };

  if (!isOpen) return null;

  const currentTime = new Date().toLocaleTimeString('en-US', {
    timeZone: 'Asia/Colombo',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white flex items-center gap-3">
            <QrCode className="text-blue-400" />
            Employee Check-In
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={28} />
          </button>
        </div>

        {/* Scan Step */}
        {step === 'scan' && (
          <div className="text-center">
            <p className="text-gray-400 mb-6">Scan employee QR code</p>
            <div
              id="qr-reader"
              ref={scannerContainerRef}
              className="mx-auto rounded-lg overflow-hidden border-4 border-gray-700"
            />
            {!location && (
              <p className="text-yellow-400 text-sm mt-4">
                Getting your location...
              </p>
            )}
          </div>
        )}

        {/* Confirm Step */}
        {step === 'confirm' && scannedEmployee && (
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-xl p-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                {scannedEmployee.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h4 className="text-xl font-bold text-white">{scannedEmployee.name}</h4>
              <p className="text-gray-400">{scannedEmployee.employee_id}</p>
              <p className="text-sm text-gray-500 capitalize">{scannedEmployee.role}</p>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center justify-center gap-2 text-green-400">
                  <MapPin size={18} />
                  <span>Location detected</span>
                  <CheckCircle size={18} />
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-400">
                  <Smartphone size={18} />
                  <span>Device: {deviceId}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-400">
                  <Clock size={18} />
                  <span>Time: {currentTime}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleConfirmCheckIn}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white py-4 rounded-xl font-bold text-lg"
            >
              {loading ? 'Processing...' : 'Confirm Check-In'}
            </button>
          </div>
        )}

        {/* Success Step */}
        {step === 'success' && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-400" size={64} />
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">Check-In Successful!</h3>
            <p className="text-gray-400 text-lg">{scannedEmployee?.name}</p>
          </div>
        )}

        {/* Error Step */}
        {step === 'error' && (
          <div className="text-center py-8">
            <AlertCircle className="text-red-400 mx-auto mb-4" size={64} />
            <h3 className="text-xl font-bold text-red-400 mb-2">Check-In Failed</h3>
            <p className="text-gray-300">{errorMsg}</p>
            <button
              onClick={() => setStep('scan')}
              className="mt-6 text-blue-400 hover:text-blue-300 underline"
            >
              Scan Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};