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

const seedData = async () => {
    try {
        const connection = await pool.promise();

        console.log('Creating sample data...\n');

        // Sample users to register
        const users = [
            { name: 'John Doe', email: 'john@fuelwatch.com' },
            { name: 'Sarah Smith', email: 'sarah@fuelwatch.com' },
            { name: 'Mike Johnson', email: 'mike@fuelwatch.com' }
        ];

        // Insert into registration table
        console.log('1. Adding to registration table...');
        for (const user of users) {
            try {
                await connection.execute(
                    'INSERT INTO registration (name, email) VALUES (?, ?)',
                    [user.name, user.email]
                );
                console.log(`  ✓ Registered: ${user.name}`);
            } catch (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    console.log(`  - ${user.name} already registered`);
                } else {
                    throw err;
                }
            }
        }

        // Create attendance records for today
        console.log('\n2. Creating today\'s attendance...');
        const today = new Date();
        const morningTime = new Date(today);
        morningTime.setHours(7, 30, 0, 0);

        for (const user of users) {
            // Check if already checked in
            const [existing] = await connection.execute(
                'SELECT id FROM attendance WHERE employee_email = ? AND DATE(check_in_time) = CURDATE() AND check_out_time IS NULL',
                [user.email]
            );

            if (existing.length > 0) {
                console.log(`  - ${user.name} already checked in`);
                continue;
            }

            await connection.execute(
                'INSERT INTO attendance (employee_email, check_in_time, location_lat, location_lng, device_id, location_verified, device_verified) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [user.email, morningTime, 7.2083, 79.8358, 'device-' + Date.now(), 1, 1]
            );

            console.log(`  ✓ Checked in: ${user.name} at ${morningTime.toLocaleTimeString()}`);
        }

        console.log('\n✅ Sample data created successfully!');
        console.log('\nRefresh your dashboard to see the employees in the Employee Details tab.');

        process.exit(0);
    } catch (error) {
        console.error('\n✗ Error:', error.message);
        process.exit(1);
    }
};

seedData();
