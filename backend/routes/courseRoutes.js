const express = require('express');
const router = express.Router();
const { getCourses, getCourseById } = require('../controllers/courseController');

// GET /api/courses - Fetch all courses with ordered modules
router.get('/', getCourses);

// GET /api/courses/:id - Fetch course with ordered modules
router.get('/:id', getCourseById);

module.exports = router;
