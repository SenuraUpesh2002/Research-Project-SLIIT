const asyncHandler = require('express-async-handler');
const Submission = require('../models/Submission');
const Station = require('../models/Station'); // Add this line

// @desc    Create new submission
// @route   POST /api/submissions
// @access  Private
const createSubmission = asyncHandler(async (req, res) => {
  const user_id = req.user.id; // Get user_id from authenticated user

  let station_id;

    let submission_type;
    let data;

  // Handle different request body structures
  if (req.body.submissionType && req.body.data) {
    // Structure 1: { submissionType: 'FUEL_FORM', data: { ... } }
    submission_type = req.body.submissionType;
    data = req.body.data;
    // Assuming station_id might be within data for this type, or needs to be derived
    // For now, we'll assume it's not directly provided at top level for this type
    // and will need to be handled based on the 'data' content if required.
    // If station_id is always required, we'll need to adjust this logic.
    station_id = req.body.station_id || null; // Placeholder, adjust as needed
  } else if (req.body.station && req.body.vehicleType && req.body.date) {
    // Structure 2: { user: { ... }, station: { name: '...', ... }, vehicleType: '...', date: '...' }
    submission_type = 'STATION_CONFIRMATION'; // Or another appropriate type
    data = {
      vehicleType: req.body.vehicleType,
      date: req.body.date,
      stationDetails: req.body.station, // Store full station details in data
    };

    // Find station_id by station name
    const station = await Station.findByName(req.body.station.name);
    if (!station) {
      res.status(404);
      throw new Error('Station not found for confirmation');
    }
    station_id = station.id;
  } else {
    res.status(400);
    throw new Error('Invalid submission request body structure');
  }

  // Validate required fields
  if (!user_id || !station_id || !submission_type || !data) {
    console.log('Missing required submission fields:', { user_id, station_id, submission_type, data });
    res.status(400);
    throw new Error('Missing required submission fields after parsing');
  }

  const createdSubmission = await Submission.create({ user_id, station_id, submission_type, data });
  res.status(201).json(createdSubmission);
});

// @desc    Get all submissions
// @route   GET /api/submissions
// @access  Private/Admin
const getSubmissions = asyncHandler(async (req, res) => {
  const submissions = await Submission.findAll(); // Assuming a findAll method in your MySQL model
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


