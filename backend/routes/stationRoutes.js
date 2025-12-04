const express = require('express');
const router = express.Router();
const { createStation, getStations, getStationById, updateStation, deleteStation } = require('../controllers/stationController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, admin, createStation).get(protect, getStations);
router.route('/:id').get(protect, getStationById).put(protect, admin, updateStation).delete(protect, admin, deleteStation);

module.exports = router;
