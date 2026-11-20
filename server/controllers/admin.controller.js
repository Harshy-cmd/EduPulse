const mongoose = require('mongoose');
const Announcement = require('../models/Announcement');
const Assignment = require('../models/Assignment');
const Course = require('../models/Course');
const User = require('../models/User');

async function getOverview(req, res) {
  const [userCounts, courseCount, publishedCourseCount, enrollmentCounts, pendingSubmissions] = await Promise.all([
    User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
    Course.countDocuments(),
    Course.countDocuments({ status: 'Published' }),
    Course.aggregate([
      { $unwind: { path: '$enrolledStudents', preserveNullAndEmptyArrays: false } },
      { $count: 'count' }
    ]),
    Assignment.aggregate([
      { $unwind: '$submissions' },
      { $match: { 'submissions.status': 'Pending' } },
      { $count: 'count' }
    ])
  ]);
  const usersByRole = Object.fromEntries(userCounts.map((entry) => [entry._id, entry.count]));

  return res.json({
    users: {
      total: Object.values(usersByRole).reduce((sum, count) => sum + count, 0),
      byRole: {
        student: usersByRole.student || 0,
        instructor: usersByRole.instructor || 0,
        admin: usersByRole.admin || 0
      }
    },
    courses: { total: courseCount, published: publishedCourseCount },
    enrollments: enrollmentCounts[0]?.count || 0,
    pendingSubmissions: pendingSubmissions[0]?.count || 0
  });
}

async function listUsers(req, res) {
  const filter = {};
  if (req.query.role) {
    if (!User.roles.includes(req.query.role)) {
      return res.status(400).json({ message: 'Invalid role filter.' });
    }
    filter.role = req.query.role;
  }
  const users = await User.find(filter).sort({ createdAt: -1 });
  return res.json({ users });
}

async function updateUser(req, res) {
  const updates = {};
  const { username, displayName, role } = req.body || {};

  if (typeof username === 'string' && username.trim().length >= 3) {
    updates.username = username.trim().toLowerCase();
  } else if (typeof username !== 'undefined') {
    return res.status(400).json({ message: 'Username must be at least 3 characters.' });
  }
  if (typeof displayName === 'string') updates.displayName = displayName.trim();
  else if (typeof displayName !== 'undefined') return res.status(400).json({ message: 'displayName must be a string.' });
  if (typeof role === 'string' && User.roles.includes(role)) updates.role = role;
  else if (typeof role !== 'undefined') return res.status(400).json({ message: 'Invalid role.' });
  if (!Object.keys(updates).length) return res.status(400).json({ message: 'No valid updates supplied.' });
  if (req.params.userId === req.user.id && role && role !== 'admin') {
    return res.status(400).json({ message: 'You cannot remove your own admin role.' });
  }

  const user = await User.findByIdAndUpdate(req.params.userId, updates, {
    new: true,
    runValidators: true
  });
  if (!user) return res.status(404).json({ message: 'User not found.' });
  return res.json({ user });
}

async function deleteUser(req, res) {
  if (req.params.userId === req.user.id) {
    return res.status(400).json({ message: 'You cannot delete your own account.' });
  }
  const user = await User.findByIdAndDelete(req.params.userId);
  if (!user) return res.status(404).json({ message: 'User not found.' });
  return res.json({ message: 'User deleted.' });
}

async function listCourses(req, res) {
  const courses = await Course.find()
    .populate('instructorId', 'username displayName')
    .populate('enrolledStudents', 'username displayName')
    .sort({ createdAt: -1 });
  return res.json({ courses });
}

async function updateCourse(req, res) {
  const allowedFields = ['title', 'description', 'status', 'instructorId'];
  const updates = {};
  for (const field of allowedFields) {
    if (typeof req.body?.[field] !== 'undefined') updates[field] = req.body[field];
  }
  if (!Object.keys(updates).length) return res.status(400).json({ message: 'No valid updates supplied.' });
  if (updates.instructorId) {
    if (!mongoose.isValidObjectId(updates.instructorId)) {
      return res.status(400).json({ message: 'Invalid instructorId.' });
    }
    const instructor = await User.findOne({ _id: updates.instructorId, role: 'instructor' });
    if (!instructor) return res.status(400).json({ message: 'instructorId must belong to an instructor.' });
  }

  const course = await Course.findByIdAndUpdate(req.params.courseId, updates, {
    new: true,
    runValidators: true
  });
  if (!course) return res.status(404).json({ message: 'Course not found.' });
  return res.json({ course });
}

async function deleteCourse(req, res) {
  const course = await Course.findByIdAndDelete(req.params.courseId);
  if (!course) return res.status(404).json({ message: 'Course not found.' });
  await Promise.all([
    Assignment.deleteMany({ courseId: course._id }),
    Announcement.deleteMany({ courseId: course._id })
  ]);
  return res.json({ message: 'Course and related assignments and announcements deleted.' });
}

module.exports = {
  getOverview,
  listUsers,
  updateUser,
  deleteUser,
  listCourses,
  updateCourse,
  deleteCourse
};
