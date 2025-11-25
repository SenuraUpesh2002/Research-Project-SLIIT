const express = require('express');
const router = express.Router();
const { getDemandPrediction, getStaffingRecommendation, getForecast } = require('../controllers/predictionController');
const auth = require('../middleware/authMiddleware');

router.post('/demand', auth, getDemandPrediction);
router.post('/staffing', auth, getStaffingRecommendation);
router.get('/forecast', auth, getForecast);

module.exports = router;
