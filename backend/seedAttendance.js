const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'fuelwatch',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const seedAttendance = async () => {
    try {
        const connection = await pool.promise();

        console.log('Creating sample attendance records...\n');

        // Get existing employees
        const [employees] = await connection.execute('SELECT email, name FROM employees LIMIT 3');

        if (employees.length === 0) {
            console.log('No employees found. Please create some employees first.');
            process.exit(0);
        }

        const today = new Date();
        const morningTime = new Date(today);
        morningTime.setHours(7, 30, 0, 0);

        for (const emp of employees) {
            // Check if already has attendance today
            const [existing] = await connection.execute(
                'SELECT id FROM attendance WHERE employee_email = ? AND DATE(check_in_time) = CURDATE() AND check_out_time IS NULL',
                [emp.email]
            );

            if (existing.length > 0) {
                console.log(`✓ ${emp.name} already checked in today`);
                continue;
            }

            // Create attendance record
            await connection.execute(
                'INSERT INTO attendance (employee_email, check_in_time, location_lat, location_lng, device_id, location_verified, device_verified) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [emp.email, morningTime, 7.2083, 79.8358, 'device-' + Date.now(), 1, 1]
            );

            console.log(`✓ Checked in: ${emp.name} at ${morningTime.toLocaleTimeString()}`);
        }

        console.log('\n✅ Sample attendance records created!');
        console.log('Refresh your dashboard Employee Details tab to see them.');

        process.exit(0);
    } catch (error) {
        console.error('✗ Error:', error.message);
        process.exit(1);
    }
};

seedAttendance();
