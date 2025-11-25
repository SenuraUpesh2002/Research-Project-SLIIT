const express = require('express');
const router = express.Router();
const fuelStockController = require('../controllers/fuelStockController');

// GET /api/fuel-stocks - Get all fuel stocks
router.get('/', fuelStockController.getFuelStocks);

// GET /api/fuel-stocks/latest - Get latest sensor reading
router.get('/latest', fuelStockController.getLatestReading);

// GET /api/fuel-stocks/history - Get reading history
router.get('/history', fuelStockController.getReadingHistory);

// POST /api/fuel-stocks/reading - Save new sensor reading
router.post('/reading', fuelStockController.saveReading);

// GET /api/fuel-stocks/tanks - Get tank information
router.get('/tanks', fuelStockController.getTankInfo);



module.exports = router;
