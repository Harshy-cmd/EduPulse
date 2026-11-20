const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Announcement = require('./models/Announcement');
const Assignment = require('./models/Assignment');
const Course = require('./models/Course');
const User = require('./models/User');

const DEMO_PASSWORD = 'DemoPass123!';

async function upsertUser(username, displayName, role, passwordHash) {
  return User.findOneAndUpdate(
    { username },
    { $set: { displayName, role, passwordHash } },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );
}

async function seed() {
  await connectDB();
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);
  const [admin, instructor, student] = await Promise.all([
    upsertUser('admin@edupulse.test', 'EduPulse Admin', 'admin', passwordHash),
    upsertUser('instructor@edupulse.test', 'Alex Morgan', 'instructor', passwordHash),
    upsertUser('student@edupulse.test', 'Jordan Lee', 'student', passwordHash)
  ]);

  const course = await Course.findOneAndUpdate(
    { title: 'Modern React: From Components to Production', instructorId: instructor._id },
    {
      $setOnInsert: {
        description: 'Build accessible, maintainable React applications with reusable components and state patterns.',
        status: 'Published',
        instructorId: instructor._id,
        lessons: [
          { title: 'Component composition', description: 'Compose interfaces from small, reusable components.', order: 0 },
          { title: 'Managing state at scale', description: 'Keep state predictable as an application grows.', order: 1 }
        ]
      },
      $addToSet: { enrolledStudents: student._id }
    },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  const assignment = await Assignment.findOneAndUpdate(
    { courseId: course._id, title: 'React State Patterns' },
    {
      $setOnInsert: {
        instructions: 'Describe a state management approach for a reusable course dashboard component.',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        submissions: [{
          studentId: student._id,
          content: 'I would keep state near the component that owns it and derive display values from the minimal state.',
          status: 'Pending'
        }]
      }
    },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  await Announcement.findOneAndUpdate(
    { courseId: course._id, authorId: instructor._id, title: 'Welcome to the course' },
    {
      $setOnInsert: {
        message: 'Welcome! Start with the component composition lesson and share questions in the course discussion.',
        createdAt: new Date()
      }
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  console.log('EduPulse demo data is ready.');
  console.log(`Demo users (password: ${DEMO_PASSWORD}):`);
  console.log(`  admin:      ${admin.username}`);
  console.log(`  instructor: ${instructor.username}`);
  console.log(`  student:    ${student.username}`);
  console.log(`Seeded course: ${course.title}`);
  console.log(`Seeded assignment: ${assignment.title}`);
}

seed()
  .catch((error) => {
    console.error('Unable to seed EduPulse:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
