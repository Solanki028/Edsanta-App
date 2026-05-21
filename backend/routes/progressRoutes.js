const express = require('express');
const router = express.Router();
const {
  getProgress,
  markModuleComplete,
  saveWatchPosition,
} = require('../controllers/progressController');

// GET /api/progress/:userId/:courseId - Get user's course progress
router.get('/:userId/:courseId', getProgress);

// PUT /api/progress/:userId/:moduleId/position - Save last watched timestamp
router.put('/:userId/:moduleId/position', saveWatchPosition);

// PUT /api/progress/:userId/:moduleId - Mark module as complete
router.put('/:userId/:moduleId', markModuleComplete);

module.exports = router;
