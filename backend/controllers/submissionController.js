const asyncHandler = require('express-async-handler');
const Submission = require('../models/Submission');

// @desc    Create new submission
// @route   POST /api/submissions
// @access  Private
const createSubmission = asyncHandler(async (req, res) => {
  const { station, submissionType, data } = req.body;

  const submission = new Submission({
    user: req.user._id,
    station,
    submissionType,
    data,
  });

  const createdSubmission = await submission.save();
  res.status(201).json(createdSubmission);
});

// @desc    Get all submissions
// @route   GET /api/submissions
// @access  Private/Admin
const getSubmissions = asyncHandler(async (req, res) => {
  const submissions = await Submission.find({}).populate('user', 'name email').populate('station', 'name location');
  res.json(submissions);
});

// @desc    Get submission by ID
// @route   GET /api/submissions/:id
// @access  Private
const getSubmissionById = asyncHandler(async (req, res) => {
  const submission = await Submission.findById(req.params.id).populate('user', 'name email').populate('station', 'name location');

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

  const submission = await Submission.findById(req.params.id);

  if (submission) {
    submission.status = status || submission.status;

    const updatedSubmission = await submission.save();
    res.json(updatedSubmission);
  } else {
    res.status(404);
    throw new Error('Submission not found');
  }
});

// @desc    Delete submission
// @route   DELETE /api/submissions/:id
// @access  Private/Admin
const deleteSubmission = asyncHandler(async (req, res) => {
  const submission = await Submission.findById(req.params.id);

  if (submission) {
    await submission.deleteOne();
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
