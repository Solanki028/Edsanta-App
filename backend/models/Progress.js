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

// Compound unique index for O(1) lookups and to guarantee user-course uniqueness constraints
progressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress;
