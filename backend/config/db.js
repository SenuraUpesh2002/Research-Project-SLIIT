// const mongoose = require('mongoose');

const connectDB = async () => {
  // Temporarily disabling database connection for frontend testing with mock data.
  // The actual database connection (MySQL) will be implemented later.
  console.log('Database connection temporarily disabled for testing purposes.');
  // try {
  //   const conn = await mongoose.connect(process.env.MONGO_URI, {});
  //   console.log(`MongoDB Connected: ${conn.connection.host}`);
  // } catch (error) {
  //   console.error(`Error: ${error.message}`);
  //   process.exit(1);
  // }
};

module.exports = connectDB;
