require('dotenv').config();
const connectDB = require('./config/db');

const testConnection = async () => {
  const connection = await connectDB();
  if (connection) {
    console.log('Database connection successful');
    await connection.end();
  } else {
    console.log('Database connection failed');
  }
};

testConnection();
