// src/components/employees/StationQRCode.jsx
import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, RefreshCw, Printer, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

// Load station config from .env (Vite format)
const STATION_ID = import.meta.env.VITE_STATION_ID || 'STATION-001';
const STATION_NAME = import.meta.env.VITE_STATION_NAME || 'Central Fuel Station';
const STATION_LAT = parseFloat(import.meta.env.VITE_STATION_LAT) || 6.9271;
const STATION_LNG = parseFloat(import.meta.env.VITE_STATION_LNG) || 79.8612;

export const StationQRCode = () => {
  const [qrData, setQrData] = useState('');
  const [generatedAt, setGeneratedAt] = useState('');

  // Generate QR code data (must match backend expectation)
  const generateQRData = () => {
    const payload = {
      type: 'station_checkin',
      station_id: STATION_ID,
      station_name: STATION_NAME,
      location: {
        lat: STATION_LAT,
        lng: STATION_LNG,
      },
      timestamp: Date.now(),
      valid_for_minutes: 1440, // 24 hours
    };

    const jsonString = JSON.stringify(payload);
    setQrData(jsonString);
    setGeneratedAt(new Date().toLocaleString('en-GB', { timeZone: 'Asia/Colombo' }));
    toast.success('New QR code generated!');
  };

  // Generate on mount
  useEffect(() => {
    generateQRData();
  }, []);

  const regenerateQR = () => {
    if (confirm('Regenerate QR code? This will invalidate the current one.')) {
      generateQRData();
    }
  };

  const printQR = () => {
    const printWindow = window.open('', '', 'width=700,height=800');
    const qrSvg = document.querySelector('.station-qr svg');
    const svgHTML = qrSvg ? new XMLSerializer().serializeToString(qrSvg) : '';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Station QR Code - ${STATION_NAME}</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; text-align: center; padding: 40px; background: #f9fafb; }
            .container { max-width: 500px; margin: 0 auto; background: white; padding: 40px; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
            h1 { color: #1f2937; margin-bottom: 8px; }
            .station-id { font-size: 24px; font-weight: bold; color: #3b82f6; margin: 16px 0; }
            .qr { margin: 30px 0; padding: 20px; background: white; display: inline-block; border: 1px solid #e5e7eb; border-radius: 12px; }
            .info { margin-top: 20px; color: #6b7280; line-height: 1.8; }
            .footer { margin-top: 40px; font-size: 12px; color: #9ca3af; }
            @media print {
              body { background: white; padding: 20px; }
              .container { box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Employee Check-In</h1>
            <div class="station-id">${STATION_ID}</div>
            <h2>${STATION_NAME}</h2>
            <div class="qr">${svgHTML}</div>
            <div class="info">
              <p><strong>Location:</strong> ${STATION_LAT.toFixed(6)}, ${STATION_LNG.toFixed(6)}</p>
              <p><strong>Generated:</strong> ${generatedAt}</p>
              <p><strong>Valid for:</strong> 24 hours</p>
            </div>
            <div class="footer">
              Scan with employee mobile app to check in
            </div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 800);
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 shadow-2xl border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <QrCode className="text-blue-400" size={28} />
          <div>
            <h3 className="text-2xl font-bold text-white">Station Check-In QR</h3>
            <p className="text-sm text-gray-400">For employee attendance</p>
          </div>
        </div>
      </div>

      {/* Station Info */}
      <div className="bg-gray-800/50 rounded-lg p-4 mb-6 border border-gray-700">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-400">{STATION_ID}</div>
          <div className="text-xl text-white mt-1">{STATION_NAME}</div>
          <div className="text-sm text-gray-400 mt-2">
            {STATION_LAT.toFixed(6)}, {STATION_LNG.toFixed(6)}
          </div>
        </div>
      </div>

      {/* QR Code */}
      <div className="bg-white p-8 rounded-2xl mb-6 flex justify-center station-qr shadow-inner">
        <QRCodeSVG
          value={qrData}
          size={240}
          level="H"
          includeMargin={true}
          imageSettings={{
            src: '/logo192.png', // optional logo
            height: 36,
            width: 36,
            excavate: true,
            opacity: 0.9,
          }}
        />
      </div>

      {/* Generation Info */}
      <div className="text-center mb-6">
        <p className="text-sm text-gray-400">
          <strong>Generated:</strong> {generatedAt}
        </p>
        <p className="text-xs text-yellow-400 mt-2 flex items-center justify-center gap-2">
          <AlertCircle size={14} />
          This QR code expires in 24 hours
        </p>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={regenerateQR}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg"
        >
          <RefreshCw size={18} />
          Regenerate
        </button>
        <button
          onClick={printQR}
          className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg"
        >
          <Printer size={18} />
          Print A4
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
        <p className="text-xs text-gray-400 text-center">
          Employees must scan this QR code using their mobile device to verify they are at the correct station before checking in.
        </p>
      </div>
    </div>
  );
};