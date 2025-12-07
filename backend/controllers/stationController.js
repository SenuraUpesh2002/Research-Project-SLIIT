const asyncHandler = require('express-async-handler');
const Station = require('../models/Station');

// @desc    Create new station
// @route   POST /api/stations
// @access  Private/Admin
const createStation = asyncHandler(async (req, res) => {
  const { name, location, fuelTypesAvailable } = req.body;

  const stationExists = await Station.findByName(name);

  if (stationExists) {
    res.status(400);
    throw new Error('Station with this name already exists');
  }

  const createdStation = await Station.create(name, location, fuelTypesAvailable);
  res.status(201).json(createdStation);
});

// @desc    Get all stations
// @route   GET /api/stations
// @access  Private
const getStations = asyncHandler(async (req, res) => {
  const stations = await Station.findAll();
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
  const { name, location, fuelTypesAvailable } = req.body;

  const updatedStation = await Station.update(req.params.id, name, location, fuelTypesAvailable);

  if (updatedStation) {
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
  const deleted = await Station.delete(req.params.id);

  if (deleted) {
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
