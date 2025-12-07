const db = require('../config/db');

// Get upcoming holidays
exports.getUpcomingHolidays = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM holidays_calendar WHERE date >= CURDATE() ORDER BY date ASC LIMIT 10'
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching upcoming holidays:', error);
        res.status(500).json({ message: 'Server error fetching holidays' });
    }
};

// Check if a specific date is a holiday
exports.checkHoliday = async (req, res) => {
    try {
        const { date } = req.params;
        const [rows] = await db.query(
            'SELECT * FROM holidays_calendar WHERE date = ?',
            [date]
        );

        if (rows.length > 0) {
            res.json({ is_holiday: true, holiday: rows[0] });
        } else {
            res.json({ is_holiday: false });
        }
    } catch (error) {
        console.error('Error checking holiday:', error);
        res.status(500).json({ message: 'Server error checking holiday' });
    }
};

// Add a new holiday
exports.addHoliday = async (req, res) => {
    try {
        const { date, holiday_name, holiday_type, is_long_weekend } = req.body;

        // Validation
        if (!date || !holiday_name || !holiday_type) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        await db.query(
            'INSERT INTO holidays_calendar (date, holiday_name, holiday_type, is_long_weekend) VALUES (?, ?, ?, ?)',
            [date, holiday_name, holiday_type, is_long_weekend || false]
        );

        res.status(201).json({ message: 'Holiday added successfully' });
    } catch (error) {
        console.error('Error adding holiday:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Holiday already exists for this date' });
        }
        res.status(500).json({ message: 'Server error adding holiday' });
    }
};
