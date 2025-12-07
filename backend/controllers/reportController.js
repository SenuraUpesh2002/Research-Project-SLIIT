const asyncHandler = require('express-async-handler');
const Report = require('../models/Report');

// @desc    Create new report
// @route   POST /api/reports
// @access  Private
const createReport = asyncHandler(async (req, res) => {
  const { station, reportType, description } = req.body;

  const createdReport = await Report.create(
    req.user.id,
    station,
    reportType,
    description
  );
  res.status(201).json(createdReport);
});

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private/Admin
const getReports = asyncHandler(async (req, res) => {
  const reports = await Report.findAll();
  res.json(reports);
});

// @desc    Get report by ID
// @route   GET /api/reports/:id
// @access  Private
const getReportById = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);

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

  const updatedReport = await Report.updateStatus(req.params.id, status);

  if (updatedReport) {
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
  const deleted = await Report.delete(req.params.id);

  if (deleted) {
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
