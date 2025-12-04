const asyncHandler = require('express-async-handler');
const Station = require('../models/Station');

// @desc    Create new station
// @route   POST /api/stations
// @access  Private/Admin
const createStation = asyncHandler(async (req, res) => {
  const { name, location, capacity, currentUsage } = req.body;

  const stationExists = await Station.findOne({ name });

  if (stationExists) {
    res.status(400);
    throw new Error('Station with this name already exists');
  }

  const station = new Station({
    name,
    location,
    capacity,
    currentUsage,
  });

  const createdStation = await station.save();
  res.status(201).json(createdStation);
});

// @desc    Get all stations
// @route   GET /api/stations
// @access  Private
const getStations = asyncHandler(async (req, res) => {
  const stations = await Station.find({});
  res.json(stations);
});

// @desc    Get station by ID
// @route   GET /api/stations/:id
// @access  Private
const getStationById = asyncHandler(async (req, res) => {
  const station = await Station.findById(req.params.id);

  if (station) {
    res.json(station);
  } else {
    res.status(404);
    throw new Error('Station not found');
  }
});

// @desc    Update station
// @route   PUT /api/stations/:id
// @access  Private/Admin
const updateStation = asyncHandler(async (req, res) => {
  const { name, location, capacity, currentUsage } = req.body;

  const station = await Station.findById(req.params.id);

  if (station) {
    station.name = name || station.name;
    station.location = location || station.location;
    station.capacity = capacity || station.capacity;
    station.currentUsage = currentUsage || station.currentUsage;

    const updatedStation = await station.save();
    res.json(updatedStation);
  } else {
    res.status(404);
    throw new Error('Station not found');
  }
});

// @desc    Delete station
// @route   DELETE /api/stations/:id
// @access  Private/Admin
const deleteStation = asyncHandler(async (req, res) => {
  const station = await Station.findById(req.params.id);

  if (station) {
    await station.deleteOne();
    res.json({ message: 'Station removed' });
  } else {
    res.status(404);
    throw new Error('Station not found');
  }
});

module.exports = {
  createStation,
  getStations,
  getStationById,
  updateStation,
  deleteStation,
};
