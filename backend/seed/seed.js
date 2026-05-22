const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Course = require('../models/Course');
const Module = require('../models/Module');
const Progress = require('../models/Progress');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    await Course.deleteMany({});
    await Module.deleteMany({});
    await Progress.deleteMany({});
    console.log('Cleared existing data.');

    const coursesData = [
      {
        title: 'Advanced JavaScript Mastery',
        description:
          'Master production-grade JavaScript concepts including closures, promises, async workflows, inheritance, and modern module patterns through focused long-form lessons.',
        modules: [
          {
            title: 'Closures, Scope Chains, and Memory',
            videoUrl:
              'https://cdn.teachertube.com/uploads/videos/2022/10/08/511575/my-movie-11.mp4',
            duration: '42:15',
          },
          {
            title: 'Promises, Jobs, and the Event Loop',
            videoUrl:
              'https://cdn.teachertube.com/uploads/videos/2022/10/08/511575/my-movie-11.mp4',
            duration: '38:40',
          },
          {
            title: 'Async/Await Error Handling Patterns',
            videoUrl:
              'https://cdn.teachertube.com/uploads/videos/2022/10/08/511575/my-movie-11.mp4',
            duration: '45:25',
          },
          {
            title: 'Prototypes, Classes, and Composition',
            videoUrl:
              'https://cdn.teachertube.com/uploads/videos/2022/10/08/511575/my-movie-11.mp4',
            duration: '41:10',
          },
          {
            title: 'ES Modules, Bundling, and Tooling',
            videoUrl:
              'https://cdn.teachertube.com/uploads/videos/2022/10/08/511575/my-movie-11.mp4',
            duration: '47:35',
          },
        ],
      },
      {
        title: 'Frontend Engineering with React',
        description:
          'Build maintainable frontend applications with reusable components, hooks, state architecture, routing decisions, performance habits, and UI polish.',
        modules: [
          {
            title: 'Component Design Systems',
            videoUrl:
              'https://cdn.teachertube.com/uploads/videos/2022/10/08/511575/my-movie-11.mp4',
            duration: '44:20',
          },
          {
            title: 'Hooks and Data Flow',
            videoUrl:
              'https://cdn.teachertube.com/uploads/videos/2022/10/08/511575/my-movie-11.mp4',
            duration: '39:55',
          },
          {
            title: 'Client State and Server State',
            videoUrl:
              'https://cdn.teachertube.com/uploads/videos/2022/10/08/511575/my-movie-11.mp4',
            duration: '52:45',
          },
          {
            title: 'Responsive Interface Patterns',
            videoUrl:
              'https://cdn.teachertube.com/uploads/videos/2022/10/08/511575/my-movie-11.mp4',
            duration: '43:30',
          },
          {
            title: 'Performance and Production Builds',
            videoUrl:
              'https://cdn.teachertube.com/uploads/videos/2022/10/08/511575/my-movie-11.mp4',
            duration: '49:05',
          },
        ],
      },
      {
        title: 'Backend APIs with Node and MongoDB',
        description:
          'Learn how to design Express APIs, model MongoDB data, handle validation, organize controllers, seed data, and prepare services for deployment.',
        modules: [
          {
            title: 'Express API Structure',
            videoUrl:
              'https://cdn.teachertube.com/uploads/videos/2022/10/08/511575/my-movie-11.mp4',
            duration: '36:50',
          },
          {
            title: 'MongoDB Schema Modeling',
            videoUrl:
              'https://cdn.teachertube.com/uploads/videos/2022/10/08/511575/my-movie-11.mp4',
            duration: '48:15',
          },
          {
            title: 'Controllers, Routes, and Services',
            videoUrl:
              'https://cdn.teachertube.com/uploads/videos/2022/10/08/511575/my-movie-11.mp4',
            duration: '46:40',
          },
          {
            title: 'Validation and Error Handling',
            videoUrl: 'https://cdn.teachertube.com/uploads/videos/2022/10/08/511575/my-movie-11.mp4',
            duration: '40:25',
          },
          {
            title: 'Deployment Readiness',
            videoUrl: 'https://cdn.teachertube.com/uploads/videos/2022/10/08/511575/my-movie-11.mp4',
            duration: '51:30',
          },
        ],
      },
    ];

    const seededCourses = [];
    let totalModules = 0;

    for (const courseData of coursesData) {
      const course = await Course.create({
        title: courseData.title,
        description: courseData.description,
        modules: [],
      });

      const modulesData = courseData.modules.map((moduleData, index) => ({
        ...moduleData,
        order: index + 1,
        course: course._id,
      }));

      const modules = await Module.insertMany(modulesData);
      course.modules = modules.map((module) => module._id);
      await course.save();

      totalModules += modules.length;
      seededCourses.push(course);
      console.log(
        `Seeded course: "${course.title}" with ${modules.length} modules (ID: ${course._id})`
      );
    }

    console.log(`Seeded ${seededCourses.length} courses.`);
    console.log(`Seeded ${totalModules} modules.`);

    console.log('\n--- Seed Complete ---');
    seededCourses.forEach((course, index) => {
      console.log(`${index + 1}. ${course.title}: ${course._id}`);
    });
   

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedData();
