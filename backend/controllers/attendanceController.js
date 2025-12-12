const db = require('../config/db');

exports.checkIn = async (req, res) => {
    try {
        const userId = req.user.id;
        const { qr_data, location, device_id } = req.body;

        // Get user email
        const [users] = await db.execute('SELECT email FROM employees WHERE id = ?', [userId]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const userEmail = users[0].email;

        // Check if already checked in today
        const [existing] = await db.execute(
            'SELECT id FROM attendance WHERE employee_email = ? AND DATE(check_in_time) = CURDATE() AND check_out_time IS NULL',
            [userEmail]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'You are already checked in today' });
        }

        // Create check-in record
        await db.execute(
            'INSERT INTO attendance (employee_email, check_in_time, location_lat, location_lng, device_id, location_verified, device_verified) VALUES (?, NOW(), ?, ?, ?, ?, ?)',
            [userEmail, location?.lat || 0, location?.lng || 0, device_id, 1, 1]
        );

        res.status(201).json({ message: 'Check-in successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.checkOut = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get user email
        const [users] = await db.execute('SELECT email FROM employees WHERE id = ?', [userId]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const userEmail = users[0].email;

        // Find active check-in
        const [checkIns] = await db.execute(
            'SELECT id FROM attendance WHERE employee_email = ? AND DATE(check_in_time) = CURDATE() AND check_out_time IS NULL',
            [userEmail]
        );

        if (checkIns.length === 0) {
            return res.status(400).json({ message: 'No active check-in found' });
        }

        // Update check-out time
        await db.execute(
            'UPDATE attendance SET check_out_time = NOW() WHERE id = ?',
            [checkIns[0].id]
        );

        res.json({ message: 'Check-out successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getMyAttendance = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get user email
        const [users] = await db.execute('SELECT email FROM employees WHERE id = ?', [userId]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const userEmail = users[0].email;

        // Get attendance records
        const [records] = await db.execute(
            'SELECT * FROM attendance WHERE employee_email = ? ORDER BY check_in_time DESC LIMIT 10',
            [userEmail]
        );

        res.json(records);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getActiveAttendance = async (req, res) => {
    try {
        // Get all employees who are currently checked in (no checkout time) today
        const [activeRecords] = await db.execute(
            `SELECT 
                a.*, 
                e.full_name,
                e.email,
                e.phone,
                e.role
            FROM attendance a
            JOIN employees e ON a.employee_email = e.email
            WHERE DATE(a.check_in_time) = CURDATE() 
            AND a.check_out_time IS NULL
            ORDER BY a.check_in_time DESC`
        );

        res.json(activeRecords);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
