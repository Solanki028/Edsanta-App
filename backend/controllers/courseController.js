const Course = require('../models/Course');
require('../models/Module');

 
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({})
      .sort({ createdAt: -1 })
      .populate({
        path: 'modules',
        options: { sort: { order: 1 } },
      });

    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

 
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

module.exports = { getCourses, getCourseById };
