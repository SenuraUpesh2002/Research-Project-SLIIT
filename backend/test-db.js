const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
    console.log('Testing DB Connection...');
    console.log(`Host: ${process.env.DB_HOST}`);
    console.log(`Port: ${process.env.DB_PORT}`);
    console.log(`User: ${process.env.DB_USER}`);
    console.log(`DB: ${process.env.DB_NAME}`);

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || '127.0.0.1',
            port: process.env.DB_PORT || 8889,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'root',
            database: process.env.DB_NAME || 'fuelwatch_db'
        });
        console.log('✅ Connection Successful!');

        const [rows] = await connection.execute('SELECT * FROM fuel_stocks');
        console.log(`✅ Loaded ${rows.length} fuel stocks.`);
        console.log(rows);

        await connection.end();
    } catch (error) {
        console.error('❌ Connection Failed:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.log('Hint: Check if MySQL is running and on the correct port (8889 or 3306).');
        }
    }
}

testConnection();
