const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test DB connection (run once on server start)
const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('MySQL Connected:', connection.threadId);
    connection.release();
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = {
  pool,
  connectDB,
};
