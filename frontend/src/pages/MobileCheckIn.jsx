import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';

const MobileCheckIn = () => {
    const [scanning, setScanning] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const startScanning = () => {
        setScanning(true);
        setMessage('');
        setError('');

        const scanner = new Html5QrcodeScanner('qr-reader', {
            qrbox: { width: 250, height: 250 },
            fps: 5,
        });

        scanner.render(onScanSuccess, onScanError);

        function onScanSuccess(decodedText) {
            scanner.clear();
            setScanning(false);
            handleCheckIn(decodedText);
        }

        function onScanError(err) {
            // Ignore scan errors, they happen frequently
        }
    };

    const handleCheckIn = async (qrData) => {
        try {
            const token = localStorage.getItem('token');

            // Record attendance
            await axios.post(
                'http://localhost:3001/api/attendance/checkin',
                {
                    qr_data: qrData,
                    location: { lat: 7.2083, lng: 79.8358 }, // Mock location
                    device_id: 'mobile-' + Date.now()
                },
                { headers: { 'x-auth-token': token } }
            );

            setMessage('✅ Check-in successful!');
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Check-in failed');
        }
    };

    const handleManualCheckIn = async () => {
        try {
            const token = localStorage.getItem('token');

            await axios.post(
                'http://localhost:3001/api/attendance/checkin',
                {
                    qr_data: 'MANUAL_CHECKIN',
                    location: { lat: 7.2083, lng: 79.8358 },
                    device_id: 'mobile-' + Date.now()
                },
                { headers: { 'x-auth-token': token } }
            );

            setMessage('✅ Check-in successful!');
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Check-in failed');
        }
    };

    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="bg-white rounded-t-3xl p-6 shadow-lg">
                    <h1 className="text-2xl font-bold text-center text-slate-800 mb-2">
                        FuelWatch Check-In
                    </h1>
                    <p className="text-center text-slate-600">Welcome, {user.name}</p>
                </div>

                {/* Main Content */}
                <div className="bg-white p-6 shadow-lg">
                    {message && (
                        <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-4 text-center font-semibold">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4 text-center">
                            {error}
                        </div>
                    )}

                    {!scanning && !message && (
                        <div className="space-y-4">
                            <button
                                onClick={startScanning}
                                className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:bg-blue-700 transition"
                            >
                                📷 Scan QR Code
                            </button>

                            <div className="text-center text-slate-500 text-sm">OR</div>

                            <button
                                onClick={handleManualCheckIn}
                                className="w-full bg-slate-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:bg-slate-700 transition"
                            >
                                ✋ Manual Check-In
                            </button>

                            <button
                                onClick={() => navigate('/dashboard')}
                                className="w-full bg-white border-2 border-slate-300 text-slate-700 py-3 rounded-xl font-medium hover:bg-slate-50 transition"
                            >
                                ← Back to Dashboard
                            </button>
                        </div>
                    )}

                    {scanning && (
                        <div>
                            <div id="qr-reader" className="rounded-lg overflow-hidden"></div>
                            <button
                                onClick={() => {
                                    setScanning(false);
                                    window.location.reload();
                                }}
                                className="w-full mt-4 bg-red-500 text-white py-3 rounded-xl font-medium"
                            >
                                Cancel Scanning
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-white rounded-b-3xl p-4 shadow-lg text-center text-sm text-slate-500">
                    <p>Station: GAM-0001-07</p>
                    <p className="text-xs mt-1">{new Date().toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
};

export default MobileCheckIn;
