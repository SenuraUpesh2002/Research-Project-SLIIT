import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, RefreshCw, Printer } from 'lucide-react';

export const StationQRCode = () => {
  const [qrData, setQrData] = useState(
    JSON.stringify({
      stationId: 'STATION-001',
      stationName: 'Central Fuel Station',
      location: 'Colombo, Sri Lanka',
      coordinates: { lat: 6.9271, lng: 79.8612 },
      timestamp: Date.now(),
      validUntil: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    })
  );

  const regenerateQR = () => {
    setQrData(
      JSON.stringify({
        stationId: 'STATION-001',
        stationName: 'Central Fuel Station',
        location: 'Colombo, Sri Lanka',
        coordinates: { lat: 6.9271, lng: 79.8612 },
        timestamp: Date.now(),
        validUntil: Date.now() + 24 * 60 * 60 * 1000,
      })
    );
  };

  const printQR = () => {
    const printWindow = window.open('', '', 'width=600,height=600');
    const qrElement = document.querySelector('.station-qr svg');
    const svgHTML = new XMLSerializer().serializeToString(qrElement);

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Station QR Code</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 40px; }
            .qr-container { margin: 20px auto; }
            .info { margin-top: 20px; font-size: 14px; color: #555; }
          </style>
        </head>
        <body>
          <h2>Central Fuel Station</h2>
          <div class="qr-container">${svgHTML}</div>
          <div class="info">
            <p><strong>Station ID:</strong> STATION-001</p>
            <p><strong>Location:</strong> Colombo, Sri Lanka</p>
            <p><strong>Generated:</strong> ${new Date().toLocaleString('en-GB', { timeZone: 'Asia/Colombo' })}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border border-gray-700 h-fit">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <QrCode className="text-blue-400" size={24} />
        <h3 className="text-xl font-semibold text-white">Station Check-In QR Code</h3>
      </div>

      {/* QR Code */}
      <div className="bg-white p-6 rounded-lg mb-4 flex items-center justify-center station-qr">
        <QRCodeSVG
          value={qrData}
          size={200}
          level="H"
          imageSettings={{
            src: '/logo192.png', // Optional: Add your logo
            x: undefined,
            y: undefined,
            height: 24,
            width: 24,
            excavate: true,
          }}
        />
      </div>

      {/* Info */}
      <div className="space-y-3">
        <p className="text-sm text-gray-400">
          Display this QR code at the station entrance for employee check-in. 
          Employees scan this code to verify their location.
        </p>

        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Station:</strong> Central Fuel Station (STATION-001)</p>
          <p><strong>Generated:</strong> {new Date().toLocaleString('en-GB', { timeZone: 'Asia/Colombo' })}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={regenerateQR}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
          >
            <RefreshCw size={16} />
            Regenerate
          </button>
          <button
            onClick={printQR}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
          >
            <Printer size={16} />
            Print
          </button>
        </div>
      </div>
    </div>
  );
};