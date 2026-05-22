const mongoose = require('mongoose');

const moduleSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
    },
    order: {
      type: Number,
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index to optimize module ordering and lookup by course
moduleSchema.index({ course: 1, order: 1 });

const Module = mongoose.model('Module', moduleSchema);

module.exports = Module;
