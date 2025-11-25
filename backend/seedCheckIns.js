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

const seedCheckIns = async () => {
    try {
        const connection = await pool.promise();

        // First, create a few test employees
        const employees = [
            { employee_id: 'EMP001', name: 'John Doe', email: 'john@fuelwatch.com', role: 'attendant', password: '$2a$10$dummy' },
            { employee_id: 'EMP002', name: 'Sarah Smith', email: 'sarah@fuelwatch.com', role: 'supervisor', password: '$2a$10$dummy' },
            { employee_id: 'EMP003', name: 'Mike Johnson', email: 'mike@fuelwatch.com', role: 'attendant', password: '$2a$10$dummy' }
        ];

        console.log('Creating test employees...');
        for (const emp of employees) {
            try {
                await connection.execute(
                    'INSERT INTO employees (employee_id, name, email, phone, role, password, station_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [emp.employee_id, emp.name, emp.email, '0771234567', emp.role, emp.password, process.env.DEFAULT_STATION_ID || 'GAM-0001-07']
                );
                console.log(`✓ Created employee: ${emp.name}`);
            } catch (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    console.log(`  Employee ${emp.name} already exists, skipping...`);
                } else {
                    throw err;
                }
            }
        }

        // Get employee IDs
        const [empRows] = await connection.execute('SELECT id, name FROM employees WHERE employee_id IN (?, ?, ?)', ['EMP001', 'EMP002', 'EMP003']);

        if (empRows.length === 0) {
            console.log('No employees found to create check-ins');
            process.exit(0);
        }

        // Create today's QR code if it doesn't exist
        const today = new Date().toISOString().slice(0, 10);
        const [qrRows] = await connection.execute('SELECT id FROM daily_qr_codes WHERE valid_date = ?', [today]);

        let qrId;
        if (qrRows.length === 0) {
            const qrData = Buffer.from(`STATION:${today}:${Date.now()}`).toString('base64');
            const expiresAt = new Date();
            expiresAt.setHours(23, 59, 59, 999);

            const [qrResult] = await connection.execute(
                'INSERT INTO daily_qr_codes (qr_code_data, station_id, valid_date, expires_at) VALUES (?, ?, ?, ?)',
                [qrData, 1, today, expiresAt]
            );
            qrId = qrResult.insertId;
            console.log('✓ Created today\'s QR code');
        } else {
            qrId = qrRows[0].id;
            console.log('✓ Using existing QR code');
        }

        // Create check-ins for employees
        console.log('\nCreating check-ins...');
        const shifts = ['morning', 'morning', 'afternoon'];

        for (let i = 0; i < empRows.length; i++) {
            const emp = empRows[i];
            const shift = shifts[i];

            // Check if already checked in
            const [existingCheckIn] = await connection.execute(
                'SELECT id FROM check_ins WHERE employee_id = ? AND DATE(check_in_time) = CURDATE() AND status = "active"',
                [emp.id]
            );

            if (existingCheckIn.length > 0) {
                console.log(`  ${emp.name} already checked in today`);
                continue;
            }

            await connection.execute(
                'INSERT INTO check_ins (employee_id, shift_type, location_validated, device_validated, qr_code_id, status) VALUES (?, ?, ?, ?, ?, ?)',
                [emp.id, shift, true, true, qrId, 'active']
            );
            console.log(`✓ Checked in: ${emp.name} (${shift} shift)`);
        }

        console.log('\n✅ Sample check-ins created successfully!');
        console.log('Refresh your dashboard to see the employees.');

        process.exit(0);
    } catch (error) {
        console.error('✗ Error:', error.message);
        process.exit(1);
    }
};

seedCheckIns();
