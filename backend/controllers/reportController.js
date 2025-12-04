const asyncHandler = require('express-async-handler');
const Report = require('../models/Report');

// @desc    Create new report
// @route   POST /api/reports
// @access  Private
const createReport = asyncHandler(async (req, res) => {
  const { station, reportType, description } = req.body;

  const report = new Report({
    user: req.user._id,
    station,
    reportType,
    description,
  });

  const createdReport = await report.save();
  res.status(201).json(createdReport);
});

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private/Admin
const getReports = asyncHandler(async (req, res) => {
  const reports = await Report.find({}).populate('user', 'name email').populate('station', 'name location');
  res.json(reports);
});

// @desc    Get report by ID
// @route   GET /api/reports/:id
// @access  Private
const getReportById = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id).populate('user', 'name email').populate('station', 'name location');

  if (report) {
    res.json(report);
  } else {
    res.status(404);
    throw new Error('Report not found');
  }
});

// @desc    Update report
// @route   PUT /api/reports/:id
// @access  Private/Admin
const updateReport = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const report = await Report.findById(req.params.id);

  if (report) {
    report.status = status || report.status;

    const updatedReport = await report.save();
    res.json(updatedReport);
  } else {
    res.status(404);
    throw new Error('Report not found');
  }
});

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private/Admin
const deleteReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);

  if (report) {
    await report.deleteOne();
    res.json({ message: 'Report removed' });
  } else {
    res.status(404);
    throw new Error('Report not found');
  }
});

module.exports = {
  createReport,
  getReports,
  getReportById,
  updateReport,
  deleteReport,
};
