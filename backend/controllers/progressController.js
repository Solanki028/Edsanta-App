const Progress = require('../models/Progress');
const Course = require('../models/Course');

const getProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    const progress = await Progress.findOne({ userId, courseId });

    if (!progress) {
      return res.json({
        userId,
        courseId,
        completedModules: [],
        percentage: 0,
        lastWatchedPositions: {},
      });
    }

    res.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const markModuleComplete = async (req, res) => {
  try {
    const { userId, moduleId } = req.params;
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: 'courseId is required in request body' });
    }

    let progress = await Progress.findOne({ userId, courseId });

    if (!progress) {
      progress = new Progress({
        userId,
        courseId,
        completedModules: [],
        lastWatchedPositions: new Map(),
      });
    }

    const alreadyCompleted = progress.completedModules
      .map((id) => id.toString())
      .includes(moduleId);

    if (!alreadyCompleted) {
      progress.completedModules.push(moduleId);
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    progress.percentage = Math.round(
      (progress.completedModules.length / course.modules.length) * 100
    );

    await progress.save();
    res.json(progress);
  } catch (error) {
    console.error('Error marking module complete:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const saveWatchPosition = async (req, res) => {
  try {
    const { userId, moduleId } = req.params;
    const { courseId, position } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: 'courseId is required in request body' });
    }

    const numericPosition = Number(position);
    if (!Number.isFinite(numericPosition) || numericPosition < 0) {
      return res.status(400).json({ message: 'position must be a valid number' });
    }

    const progress = await Progress.findOneAndUpdate(
      { userId, courseId },
      { $set: { [`lastWatchedPositions.${moduleId}`]: numericPosition } },
      { new: true, upsert: true }
    );

    res.json(progress);
  } catch (error) {
    console.error('Error saving watch position:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getProgress, markModuleComplete, saveWatchPosition };
