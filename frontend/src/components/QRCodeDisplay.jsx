import { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const QRCodeDisplay = () => {
    const [qrData, setQrData] = useState(null);

    useEffect(() => {
        // Generate a simple QR code with today's date and station info
        const today = new Date().toISOString().slice(0, 10);
        const stationId = 'GAM-0001-07';
        const qrContent = `FUELWATCH:${stationId}:${today}`;
        setQrData(qrContent);
    }, []);

    return (
        <div className="flex flex-col items-center">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Daily Staff Check-in</h3>
            {qrData ? (
                <QRCodeCanvas value={qrData} size={128} />
            ) : (
                <div className="w-32 h-32 bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                    Loading...
                </div>
            )}
            <p className="text-xs text-slate-500 mt-2">Scan to check-in</p>
            <p className="text-xs text-slate-400 mt-1">{new Date().toLocaleDateString()}</p>
        </div>
    );
};

export default QRCodeDisplay;
