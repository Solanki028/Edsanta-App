const mongoose = require('mongoose');

const progressSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    completedModules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module',
      },
    ],
    percentage: {
      type: Number,
      default: 0,
    },
    // Bonus: Video Resume State — stores last watched position per module
    lastWatchedPositions: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress;
