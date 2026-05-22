const express = require('express');
const router = express.Router();
const {
  getProgress,
  markModuleComplete,
  saveWatchPosition,
} = require('../controllers/progressController');

router.get('/:userId/:courseId', getProgress);
router.put('/:userId/:moduleId/position', saveWatchPosition);
router.put('/:userId/:moduleId', markModuleComplete);

module.exports = router;
