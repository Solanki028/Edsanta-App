const express = require('express');
const router = express.Router();
const { getCourseById } = require('../controllers/courseController');

// GET /api/courses/:id — Fetch course with ordered modules
router.get('/:id', getCourseById);

module.exports = router;
