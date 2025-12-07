const asyncHandler = require('express-async-handler');
const Submission = require('../models/Submission');

// @desc    Create new submission
// @route   POST /api/submissions
// @access  Private
const createSubmission = asyncHandler(async (req, res) => {
  const { station, submissionType, data } = req.body;

  const createdSubmission = await Submission.create(
    req.user.id,
    station,
    submissionType,
    data
  );
  res.status(201).json(createdSubmission);
});

// @desc    Get all submissions
// @route   GET /api/submissions
// @access  Private/Admin
const getSubmissions = asyncHandler(async (req, res) => {
  const submissions = await Submission.findAll(); // Assuming a findAll method in your MySQL model
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
