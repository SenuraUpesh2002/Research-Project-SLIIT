const mongoose = require('mongoose');

const ReportSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    station: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Station',
    },
    reportType: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'resolved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const Report = mongoose.model('Report', ReportSchema);

module.exports = Report;
