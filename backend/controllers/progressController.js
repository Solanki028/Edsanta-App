const Progress = require('../models/Progress');
const Course = require('../models/Course');

/**
 * @desc    Get user's progress for a specific course
 * @route   GET /api/progress/:userId/:courseId
 * @access  Public
 */
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

/**
 * @desc    Mark a module as complete for a user
 * @route   PUT /api/progress/:userId/:moduleId
 * @access  Public
 */
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

    // Add module to completed list if not already present
    const alreadyCompleted = progress.completedModules
      .map((id) => id.toString())
      .includes(moduleId);

    if (!alreadyCompleted) {
      progress.completedModules.push(moduleId);
    }

    // Recalculate completion percentage
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

/**
 * @desc    Save a user's last watched timestamp for a module
 * @route   PUT /api/progress/:userId/:moduleId/position
 * @access  Public
 */
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

    let progress = await Progress.findOne({ userId, courseId });

    if (!progress) {
      progress = new Progress({
        userId,
        courseId,
        completedModules: [],
        lastWatchedPositions: new Map(),
      });
    }

    progress.lastWatchedPositions.set(moduleId, numericPosition);
    await progress.save();

    res.json(progress);
  } catch (error) {
    console.error('Error saving watch position:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getProgress, markModuleComplete, saveWatchPosition };
