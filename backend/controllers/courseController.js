const Course = require('../models/Course');
require('../models/Module');

/**
 * @desc    Fetch a single course with its ordered modules
 * @route   GET /api/courses/:id
 * @access  Public
 */
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate({
      path: 'modules',
      options: { sort: { order: 1 } },
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    console.error('Error fetching course:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getCourseById };
