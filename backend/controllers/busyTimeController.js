const db = require('../config/db');

// Get busy time patterns
exports.getBusyPatterns = async (req, res) => {
    try {
        // Return average busy patterns by hour and day of week
        const query = `
            SELECT 
                DAYNAME(date) as day_of_week,
                hour,
                AVG(actual_demand) as avg_demand,
                AVG(busy_score) as avg_busy_score,
                AVG(average_wait_time) as avg_wait_time
            FROM busy_time_patterns
            GROUP BY DAYNAME(date), hour
            ORDER BY FIELD(day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'), hour
        `;

        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching busy patterns:', error);
        res.status(500).json({ message: 'Server error fetching busy patterns' });
    }
};

// Analyze and store new busy time data (could be called by a cron job or admin)
exports.analyzeBusyTimes = async (req, res) => {
    try {
        const { date } = req.body;
        // In a real implementation, this would aggregate data from fuel_transactions
        // For now, we'll simulate an analysis or return existing data for the date

        const [rows] = await db.query(
            'SELECT * FROM busy_time_patterns WHERE date = ? ORDER BY hour',
            [date || new Date().toISOString().slice(0, 10)]
        );

        res.json({
            message: 'Analysis complete',
            data: rows,
            count: rows.length
        });
    } catch (error) {
        console.error('Error analyzing busy times:', error);
        res.status(500).json({ message: 'Server error analyzing busy times' });
    }
};
