const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env from parent directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Course = require('../models/Course');
const Module = require('../models/Module');
const Progress = require('../models/Progress');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await Course.deleteMany({});
    await Module.deleteMany({});
    await Progress.deleteMany({});
    console.log('Cleared existing data.');

    // Create course
    const course = await Course.create({
      title: 'Advanced JavaScript',
      description:
        'Master advanced JavaScript concepts including closures, promises, async/await, prototypes, and modern ES6+ features. This course takes you from intermediate to advanced level with hands-on video lessons.',
      modules: [],
    });

    // Module data with sample MP4 URLs
    const modulesData = [
      {
        title: 'Closures & Lexical Scope',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        duration: '12:30',
        order: 1,
        course: course._id,
      },
      {
        title: 'Promises & Microtask Queue',
        videoUrl: 'https://www.w3schools.com/html/movie.mp4',
        duration: '15:45',
        order: 2,
        course: course._id,
      },
      {
        title: 'Async/Await Patterns',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        duration: '18:20',
        order: 3,
        course: course._id,
      },
      {
        title: 'Prototypal Inheritance',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        duration: '14:10',
        order: 4,
        course: course._id,
      },
      {
        title: 'ES6+ Modules & Bundling',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        duration: '16:55',
        order: 5,
        course: course._id,
      },
    ];

    const modules = await Module.insertMany(modulesData);
    console.log(`Seeded ${modules.length} modules.`);

    // Link modules to course
    course.modules = modules.map((m) => m._id);
    await course.save();
    console.log(`Seeded course: "${course.title}" (ID: ${course._id})`);

    console.log('\n--- Seed Complete ---');
    console.log(`Course ID: ${course._id}`);
    console.log('Use this ID in your frontend VITE_COURSE_ID env variable.\n');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedData();
