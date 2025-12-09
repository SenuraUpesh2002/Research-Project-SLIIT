const mysql = require('mysql2/promise');

const connectDB = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: process.env.MYSQL_PORT,
    });
    console.log('MySQL Connected: ' + connection.threadId);
    return connection;
  } catch (error) {
    console.error(`Error: ${error}`);
    // process.exit(1);
  }
};

module.exports = connectDB;
