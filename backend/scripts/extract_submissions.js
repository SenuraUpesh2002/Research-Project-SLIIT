require('dotenv').config({ path: './backend/.env' });
console.log('Loaded environment variables:', process.env.MYSQL_HOST, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, process.env.MYSQL_DATABASE, process.env.MYSQL_PORT);
const connectDB = require('../config/db');
const fs = require('fs');

const extractSubmissions = async () => {
  let connection;
  try {
    connection = await connectDB();
    if (!connection) {
      console.error('Failed to connect to the database.');
      return;
    }

    const [rows] = await connection.execute('SELECT submission_type, data, station_id FROM submissions');

    const dataset = rows.map(row => {
      const data = JSON.parse(row.data);
      const features = {
        submission_type: row.submission_type,
        province: data.province,
        town: data.town,
        station_id: row.station_id,
      };

      if (row.submission_type === 'EV_CHARGE') {
        features.chargerType = data.chargerType;
        features.powerRating = data.powerRating;
        features.vehicleType = null; // Not applicable for EV
        features.fuelType = null; // Not applicable for EV
        features.preferredBrand = null; // Not applicable for EV
      } else if (row.submission_type === 'FUEL_REPORT') {
        features.vehicleType = data.vehicleType;
        features.fuelType = data.fuelType;
        features.preferredBrand = data.preferredBrand;
        features.chargerType = null; // Not applicable for Fuel
        features.powerRating = null; // Not applicable for Fuel
      }
      return features;
    });

    fs.writeFileSync('training_dataset.json', JSON.stringify(dataset, null, 2));
    console.log('Successfully extracted submissions to training_dataset.json');

  } catch (error) {
    console.error(`Error extracting submissions: ${error}`);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

extractSubmissions();
