const DailyQR = require('../models/DailyQR');
const crypto = require('crypto');

// Generate a new QR code for today (Admin/System function)
exports.generateDailyQR = async (req, res) => {
    try {
        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        const stationId = process.env.STATION_ID || 1;

        // Check if already exists
        const existingQR = await DailyQR.findByDate(today);
        if (existingQR) {
            return res.status(400).json({ message: 'QR Code for today already exists', qr: existingQR });
        }

        // Generate encrypted token
        // Token structure: stationId:date:randomSalt
        const rawData = `${stationId}:${today}:${crypto.randomBytes(16).toString('hex')}`;
        // In a real app, you might encrypt this rawData with a secret key
        // For now, we'll base64 encode it to simulate "encryption" or just store the hash
        const qr_code_data = Buffer.from(rawData).toString('base64');

        const expires_at = new Date();
        expires_at.setHours(23, 59, 59, 999); // Expires at end of day

        const newId = await DailyQR.create({
            qr_code_data,
            station_id: stationId,
            valid_date: today,
            expires_at
        });

        res.status(201).json({ message: 'QR Code generated', id: newId, qr_code_data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get today's QR code
exports.getTodayQR = async (req, res) => {
    try {
        const today = new Date().toISOString().slice(0, 10);
        const qr = await DailyQR.findByDate(today);

        if (!qr) {
            return res.status(404).json({ message: 'No QR code found for today' });
        }

        res.json(qr);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
