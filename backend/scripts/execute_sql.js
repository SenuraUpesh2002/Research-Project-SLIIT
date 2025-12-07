const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

// Manually load environment variables from .env
const loadEnv = async () => {
  try {
    const envPath = path.resolve(__dirname, '../.env');
    const envFileContent = await fs.readFile(envPath, 'utf8');
    envFileContent.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, value] = trimmedLine.split('=');
        if (key && value) {
          process.env[key.trim()] = value.trim();
        }
      }
    });
    console.log('Environment variables loaded manually.');
  } catch (error) {
    console.error('Error loading .env file manually:', error.message);
  }
};

const executeSqlFile = async () => {
  await loadEnv(); // Load environment variables before connecting
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: process.env.MYSQL_PORT || 3306, // Add port here
      multipleStatements: true // Allows multiple SQL statements in one query
    });
    console.log('MySQL Connected for SQL execution: ' + connection.threadId);

    const sql = await fs.readFile('./sql/create_tables.sql', 'utf8');
    await connection.query(sql);
    console.log('create_tables.sql executed successfully.');
  } catch (error) {
    console.error(`Error executing SQL file:`, error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

executeSqlFile();