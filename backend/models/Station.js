const mongoose = require('mongoose');

const StationSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    location: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      default: 0,
    },
    currentUsage: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

const Station = mongoose.model('Station', StationSchema);

module.exports = Station;
