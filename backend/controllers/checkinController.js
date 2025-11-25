const CheckIn = require('../models/CheckIn');
const DailyQR = require('../models/DailyQR');

exports.scanQR = async (req, res) => {
    try {
        const { qr_code_data, location, device_fingerprint } = req.body;
        const employeeId = req.user.id; // From auth middleware

        // 1. Validate QR Code
        // In a real app, decrypt qr_code_data and verify station/date
        // For now, we just check if it matches the stored string for today
        const today = new Date().toISOString().slice(0, 10);
        const validQR = await DailyQR.findByDate(today);

        if (!validQR || validQR.qr_code_data !== qr_code_data) {
            return res.status(400).json({ message: 'Invalid or expired QR code' });
        }

        // 2. Check if already checked in
        const activeCheckIn = await CheckIn.findActiveByEmployeeId(employeeId);
        if (activeCheckIn) {
            return res.status(400).json({ message: 'You are already checked in. Please check out first.' });
        }

        // 3. Determine Shift (Simple logic based on time)
        const currentHour = new Date().getHours();
        let shift_type = 'morning';
        if (currentHour >= 14 && currentHour < 22) shift_type = 'afternoon';
        else if (currentHour >= 22 || currentHour < 6) shift_type = 'evening';

        // 4. Create Check-in Record
        const checkInId = await CheckIn.create({
            employee_id: employeeId,
            shift_type,
            location_validated: true, // Placeholder for actual GPS validation
            device_validated: true,   // Placeholder for device fingerprint check
            qr_code_id: validQR.id
        });

        res.status(201).json({ message: 'Check-in successful', checkInId });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.checkout = async (req, res) => {
    try {
        const employeeId = req.user.id;

        const activeCheckIn = await CheckIn.findActiveByEmployeeId(employeeId);
        if (!activeCheckIn) {
            return res.status(400).json({ message: 'No active check-in found' });
        }

        await CheckIn.updateCheckout(activeCheckIn.id);

        res.json({ message: 'Check-out successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getTodayCheckIns = async (req, res) => {
    try {
        const checkIns = await CheckIn.getTodayActiveCheckIns();
        res.json(checkIns);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
