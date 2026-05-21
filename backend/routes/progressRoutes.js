const express = require('express');
const router = express.Router();
const {
  getProgress,
  markModuleComplete,
} = require('../controllers/progressController');

// GET /api/progress/:userId/:courseId — Get user's course progress
router.get('/:userId/:courseId', getProgress);

// PUT /api/progress/:userId/:moduleId — Mark module as complete
router.put('/:userId/:moduleId', markModuleComplete);

module.exports = router;
