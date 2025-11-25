const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
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

const seedAdmin = async () => {
    try {
        const connection = await pool.promise();

        // Check if admin exists
        const [rows] = await connection.execute('SELECT * FROM employees WHERE email = ?', ['admin@fuelwatch.com']);

        if (rows.length > 0) {
            console.log('✓ Admin user already exists');
            console.log('Email: admin@fuelwatch.com');
            console.log('Password: admin123');
            process.exit(0);
        }

        // Create admin
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        const sql = `
      INSERT INTO employees 
      (employee_id, name, email, phone, role, password, device_id, station_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

        await connection.execute(sql, [
            'ADMIN001',
            'System Admin',
            'admin@fuelwatch.com',
            '0000000000',
            'manager',
            hashedPassword,
            'system-seed',
            process.env.DEFAULT_STATION_ID || 'GAM-0001-07'
        ]);

        console.log('✓ Admin user created successfully!');
        console.log('');
        console.log('=================================');
        console.log('LOGIN CREDENTIALS:');
        console.log('=================================');
        console.log('Email:    admin@fuelwatch.com');
        console.log('Password: admin123');
        console.log('=================================');

        process.exit(0);
    } catch (error) {
        console.error('✗ Error seeding admin:', error.message);
        process.exit(1);
    }
};

seedAdmin();
