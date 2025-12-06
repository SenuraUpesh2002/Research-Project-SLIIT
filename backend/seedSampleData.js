const mysql = require('mysql2');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

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

const seedData = async () => {
    try {
        const connection = await pool.promise();

        console.log('Creating sample data...\n');

        // Sample users to register
        const users = [
            { name: 'John Doe', email: 'john@fuelwatch.com', role: 'attendant' },
            { name: 'Sarah Smith', email: 'sarah@fuelwatch.com', role: 'supervisor' },
            { name: 'Mike Johnson', email: 'mike@fuelwatch.com', role: 'manager' }
        ];

        // Insert into employees table
        console.log('1. Adding to employees table...');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        for (const user of users) {
            try {
                // Check if user exists
                const [existing] = await connection.execute('SELECT id FROM employees WHERE email = ?', [user.email]);

                if (existing.length > 0) {
                    console.log(`  - ${user.name} already registered`);
                    continue;
                }

                const employeeId = 'EMP' + Math.floor(Math.random() * 10000);

                await connection.execute(
                    'INSERT INTO employees (employee_id, full_name, email, role, password_hash, device_fingerprint) VALUES (?, ?, ?, ?, ?, ?)',
                    [employeeId, user.name, user.email, user.role, hashedPassword, 'device-' + Date.now()]
                );
                console.log(`  ✓ Registered: ${user.name}`);
            } catch (err) {
                console.error(`  ✗ Error registering ${user.name}:`, err.message);
            }
        }

        // Create attendance records for today
        console.log('\n2. Creating today\'s attendance...');
        const today = new Date();
        const morningTime = new Date(today);
        morningTime.setHours(7, 30, 0, 0);

        for (const user of users) {
            try {
                // Get employee ID
                const [empRows] = await connection.execute('SELECT id, email FROM employees WHERE email = ?', [user.email]);
                if (empRows.length === 0) continue;

                const emp = empRows[0];

                // Check if already checked in
                const [existing] = await connection.execute(
                    'SELECT id FROM attendance WHERE employee_email = ? AND DATE(check_in_time) = CURDATE()',
                    [emp.email]
                );

                if (existing.length > 0) {
                    console.log(`  - ${user.name} already checked in`);
                    continue;
                }

                await connection.execute(
                    'INSERT INTO attendance (employee_email, check_in_time, location_lat, location_lng, device_id, location_verified, device_verified) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [emp.email, morningTime, 7.2083, 79.8358, 'device-' + Date.now(), 1, 1]
                );

                console.log(`  ✓ Checked in: ${user.name} at ${morningTime.toLocaleTimeString()}`);
            } catch (err) {
                // Ignore if table doesn't exist, as it might be check_ins
                if (err.code === 'ER_NO_SUCH_TABLE') {
                    console.log('  ⚠ Attendance table not found. Skipping attendance seeding.');
                    break;
                }
                console.error(`  ✗ Error checking in ${user.name}:`, err.message);
            }
        }

        console.log('\n✅ Sample data process completed!');
        console.log('\nRefresh your dashboard to see the employees.');

        process.exit(0);
    } catch (error) {
        console.error('\n✗ Error:', error.message);
        process.exit(1);
    }
};

seedData();
