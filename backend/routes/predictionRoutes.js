const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/predictionController');

// GET /api/predictions/demand - Get demand forecast
router.get('/demand', predictionController.getDemandForecast);

// GET /api/predictions/refill - Get refill suggestions
router.get('/refill', predictionController.getRefillSuggestions);



module.exports = router;
