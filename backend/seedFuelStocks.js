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

const seedFuelStocks = async () => {
    try {
        const connection = await pool.promise();

        console.log('Seeding fuel stocks...\n');

        const fuelTypes = [
            { type: 'petrol', capacity: 20000, current: 15430, sensor: 'SENS-P92-01' },
            { type: 'diesel', capacity: 25000, current: 18200, sensor: 'SENS-DSL-01' },
            { type: 'super_diesel', capacity: 15000, current: 8500, sensor: 'SENS-SDSL-01' },
            { type: 'petrol_95', capacity: 15000, current: 12100, sensor: 'SENS-P95-01' }
        ];

        // Clear existing stocks to avoid duplicates
        await connection.execute('TRUNCATE TABLE fuel_stocks');
        console.log('Cleared existing fuel stocks.');

        for (const fuel of fuelTypes) {
            await connection.execute(
                'INSERT INTO fuel_stocks (fuel_type, current_level, capacity, sensor_id, station_id) VALUES (?, ?, ?, ?, ?)',
                [fuel.type, fuel.current, fuel.capacity, fuel.sensor, 1]
            );
            console.log(`  ✓ Added ${fuel.type}: ${fuel.current}/${fuel.capacity}L`);
        }

        console.log('\n✅ Fuel stocks seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('\n✗ Error seeding fuel stocks:', error);
        process.exit(1);
    }
};

seedFuelStocks();
