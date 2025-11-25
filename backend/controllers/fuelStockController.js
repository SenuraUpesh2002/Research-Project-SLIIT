const FuelStock = require('../models/FuelStock');

// Get all fuel stocks for a station
exports.getFuelStocks = async (req, res) => {
  try {
    const stationId = req.query.stationId || process.env.DEFAULT_STATION_ID;
    
    const stocks = await FuelStock.getByStation(stationId);
    const stationInfo = await FuelStock.getStationInfo(stationId);
    
    res.json({
      success: true,
      data: {
        station: stationInfo,
        stocks: stocks
      }
    });
  } catch (error) {
    console.error('Error fetching fuel stocks:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch fuel stocks'
    });
  }
};

// Get latest sensor reading
exports.getLatestReading = async (req, res) => {
  try {
    const reading = await FuelStock.getLatestReading();
    
    res.json({
      success: true,
      data: reading
    });
  } catch (error) {
    console.error('Error fetching latest reading:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch latest reading'
    });
  }
};

// Get reading history
exports.getReadingHistory = async (req, res) => {
  try {
    const hours = parseInt(req.query.hours) || 24;
    
    const history = await FuelStock.getReadingHistory(hours);
    
    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Error fetching reading history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reading history'
    });
  }
};

// Save new sensor reading
exports.saveReading = async (req, res) => {
  try {
    const { reading } = req.body;
    
    if (!reading) {
      return res.status(400).json({
        success: false,
        error: 'Reading value is required'
      });
    }
    
    const result = await FuelStock.saveReading(reading);
    
    res.json({
      success: true,
      data: {
        id: result.insertId,
        reading: reading
      }
    });
  } catch (error) {
    console.error('Error saving reading:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save reading'
    });
  }
};

// Get tank information
exports.getTankInfo = async (req, res) => {
  try {
    const stationId = req.query.stationId || process.env.DEFAULT_STATION_ID;
    
    const tankInfo = await FuelStock.getTankInfo(stationId);
    
    res.json({
      success: true,
      data: tankInfo
    });
  } catch (error) {
    console.error('Error fetching tank info:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tank information'
    });
  }
};
