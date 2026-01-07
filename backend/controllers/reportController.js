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

  // Process reports to generate submission trends and user activity
  const submissionTrends = {};
  const userActivity = {};

  reports.forEach(report => {
    // Submission Trends (by month)
    const month = new Date(report.createdAt).toLocaleString('en-US', { month: 'short', year: 'numeric' });
    submissionTrends[month] = (submissionTrends[month] || 0) + 1;

    // User Activity (unique users per day)
    const day = new Date(report.createdAt).toISOString().split('T')[0]; // YYYY-MM-DD
    if (!userActivity[day]) {
      userActivity[day] = new Set();
    }
    userActivity[day].add(report.user.id);
  });

  // Convert submissionTrends to array format
  const submissionTrendsArray = Object.keys(submissionTrends).map(month => ({
    month,
    count: submissionTrends[month]
  })).sort((a, b) => new Date(a.month) - new Date(b.month)); // Sort by date

  // Convert userActivity to array format
  const userActivityArray = Object.keys(userActivity).map(day => ({
    day,
    activeUsers: userActivity[day].size
  })).sort((a, b) => new Date(a.day) - new Date(b.day)); // Sort by date

  res.json({
    allReports: reports, // Optionally include all raw reports
    submissionTrends: submissionTrendsArray,
    userActivity: userActivityArray,
  });
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