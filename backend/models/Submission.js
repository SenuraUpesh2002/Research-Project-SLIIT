const mongoose = require('mongoose');

const SubmissionSchema = mongoose.Schema(
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
    submissionType: {
      type: String,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const Submission = mongoose.model('Submission', SubmissionSchema);

module.exports = Submission;
