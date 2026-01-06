const asyncHandler = require('express-async-handler');
const Submission = require('../models/Submission');
const Station = require('../models/Station'); // Add this line

// @desc    Create new submission
// @route   POST /api/submissions
// @access  Private
const createSubmission = asyncHandler(async (req, res) => {
  console.log('Received submission request body:', req.body);

  const user_id = req.user.id;
  let { submissionType, data, station_id } = req.body;
  
  // If submissionType is not directly provided, try to infer it
  if (!submissionType && req.body.vehicleType === 'EV') {
      submissionType = 'EV_FORM'; // Assuming EV_FORM is the correct type for ev-results.jsx submissions
  } else if (!submissionType && req.body.vehicleType === 'Fuel') {
      submissionType = 'FUEL_FORM'; // Infer FUEL_FORM for fuel-results.jsx submissions
  }
  
  // If data is not directly provided, try to infer it
  if (!data && req.body.station) {
      data = req.body.station;
      // Also, if station_id is not provided, try to get it from data.id
      if (!station_id && data.id) {
          station_id = data.id;
      }
  }
  
    console.log('user_id:', user_id);
    console.log('submissionType:', submissionType);
    console.log('data:', data);
    console.log('station_id (before conditional assignment):', station_id);
  
    if (!user_id || !submissionType || !data) {
        res.status(400);
        throw new Error('Missing required submission fields');
    }

  // For STATION_CONFIRMATION, station_id is mandatory
  if (submissionType === 'STATION_CONFIRMATION' && !station_id) {
    res.status(400);
    throw new Error('station_id is required for STATION_CONFIRMATION submission_type');
  }

  // Find station by name if station_id is not provided
  let finalStationId = station_id;
  if (!finalStationId && data && data.stationName) {
      const station = await Station.findByName(data.stationName);
      if (station) {
          finalStationId = station.id;
      }
  }

  const submission = await Submission.create({
      user_id,
      station_id: finalStationId,
      submission_type: submissionType, // Use submissionType here
      data,
  });
  res.status(201).json(submission);
});
// @desc    Get all submissions
// @route   GET /api/submissions
// @access  Private/Admin
const getSubmissions = asyncHandler(async (req, res) => {
  const searchTerm = req.query.search; // Get search term from query parameters
  const submissions = await Submission.findAll({ searchTerm }); // Pass searchTerm to findAll
  console.log('Submissions from DB:', submissions);
  res.json(submissions);
});

// @desc    Get submission by ID
// @route   GET /api/submissions/:id
// @access  Private
const getSubmissionById = asyncHandler(async (req, res) => {
  const submission = await Submission.findById(req.params.id);

  if (submission) {
    res.json(submission);
  } else {
    res.status(404);
    throw new Error('Submission not found');
  }
});

// @desc    Update submission
// @route   PUT /api/submissions/:id
// @access  Private/Admin
const updateSubmission = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const submission = await Submission.updateStatus(req.params.id, status);

  if (submission) {
    res.json(submission);
  } else {
    res.status(404);
    throw new Error('Submission not found');
  }
});

// @desc    Delete submission
// @route   DELETE /api/submissions/:id
// @access  Private/Admin
const deleteSubmission = asyncHandler(async (req, res) => {
  const deleted = await Submission.delete(req.params.id);

  if (deleted) {
    res.json({ message: 'Submission removed' });
  } else {
    res.status(404);
    throw new Error('Submission not found');
  }
});

module.exports = {
  createSubmission,
  getSubmissions,
  getSubmissionById,
  updateSubmission,
  deleteSubmission,
};















