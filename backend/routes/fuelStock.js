const express = require('express');
const router = express.Router();
const { getStocks, updateStock } = require('../controllers/fuelStockController');
const auth = require('../middleware/authMiddleware');

// @route   GET api/fuel/stocks
// @desc    Get all fuel stocks
// @access  Private
router.get('/stocks', auth, getStocks);

// @route   PUT api/fuel/stocks/:id
// @desc    Update stock level (Simulating IoT)
// @access  Private
router.put('/stocks/:id', auth, updateStock);

module.exports = router;
