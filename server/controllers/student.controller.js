const Announcement = require('../models/Announcement');
const Assignment = require('../models/Assignment');
const Course = require('../models/Course');

async function browseCourses(req, res) {
  const courses = await Course.find({ status: 'Published' })
    .populate('instructorId', 'username displayName')
    .select('title description status instructorId lessons enrolledStudents createdAt')
    .sort({ createdAt: -1 });
  return res.json({
    courses: courses.map((course) => ({
      ...course.toJSON(),
      enrolled: course.enrolledStudents.some((studentId) => studentId.toString() === req.user.id),
      enrollmentCount: course.enrolledStudents.length
    }))
  });
}

async function enrollCourse(req, res) {
  const course = await Course.findOne({ _id: req.params.courseId, status: 'Published' });
  if (!course) return res.status(404).json({ message: 'Published course not found.' });
  const alreadyEnrolled = course.enrolledStudents.some((studentId) => studentId.toString() === req.user.id);
  if (!alreadyEnrolled) {
    course.enrolledStudents.addToSet(req.user.id);
    await course.save();
  }
  return res.status(alreadyEnrolled ? 200 : 201).json({
    course: {
      id: course._id,
      title: course.title,
      enrolled: true,
      enrollmentCount: course.enrolledStudents.length
    }
  });
}

async function listAssignments(req, res) {
  const courses = await Course.find({
    enrolledStudents: req.user.id,
    status: 'Published'
  }).select('_id title');
  const courseIds = courses.map((course) => course._id);
  const assignments = await Assignment.find({ courseId: { $in: courseIds } })
    .populate('courseId', 'title')
    .sort({ dueDate: 1, createdAt: -1 });

  return res.json({
    assignments: assignments.map((assignment) => ({
      id: assignment._id,
      course: assignment.courseId,
      title: assignment.title,
      instructions: assignment.instructions,
      dueDate: assignment.dueDate,
      submission: assignment.submissions.find((item) => item.studentId.toString() === req.user.id) || null
    }))
  });
}

async function submitAssignment(req, res) {
  const { content } = req.body || {};
  if (typeof content !== 'string' || !content.trim()) {
    return res.status(400).json({ message: 'Submission content is required.' });
  }
  const assignment = await Assignment.findById(req.params.assignmentId);
  if (!assignment) return res.status(404).json({ message: 'Assignment not found.' });
  const course = await Course.findOne({
    _id: assignment.courseId,
    status: 'Published',
    enrolledStudents: req.user.id
  });
  if (!course) return res.status(403).json({ message: 'Enroll in this course before submitting.' });
  if (assignment.dueDate && assignment.dueDate.getTime() < Date.now()) {
    return res.status(409).json({ message: 'The submission deadline has passed.' });
  }

  let submission = assignment.submissions.find((item) => item.studentId.toString() === req.user.id);
  if (submission?.status === 'Graded') {
    return res.status(409).json({ message: 'This submission has already been graded.' });
  }
  if (submission) {
    submission.content = content.trim();
    submission.submittedAt = new Date();
  } else {
    assignment.submissions.push({ studentId: req.user.id, content: content.trim() });
    submission = assignment.submissions[assignment.submissions.length - 1];
  }
  await assignment.save();
  return res.status(201).json({ submission });
}

async function listGrades(req, res) {
  const assignments = await Assignment.find({ 'submissions.studentId': req.user.id })
    .populate('courseId', 'title')
    .sort({ updatedAt: -1 });
  const grades = assignments.flatMap((assignment) => assignment.submissions
    .filter((submission) => submission.studentId.toString() === req.user.id)
    .map((submission) => ({
      id: submission._id,
      assignmentId: assignment._id,
      assignmentTitle: assignment.title,
      course: assignment.courseId,
      grade: submission.grade,
      feedback: submission.feedback,
      status: submission.status,
      submittedAt: submission.submittedAt
    })));
  return res.json({ grades });
}

async function listAnnouncements(req, res) {
  const courses = await Course.find({
    enrolledStudents: req.user.id,
    status: 'Published'
  }).select('_id');
  const announcements = await Announcement.find({
    courseId: { $in: courses.map((course) => course._id) }
  })
    .populate('courseId', 'title')
    .populate('authorId', 'username displayName')
    .sort({ createdAt: -1 });
  return res.json({ announcements });
}

module.exports = {
  browseCourses,
  enrollCourse,
  listAssignments,
  submitAssignment,
  listGrades,
  listAnnouncements
};
