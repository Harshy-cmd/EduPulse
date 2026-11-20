const Announcement = require('../models/Announcement');
const Assignment = require('../models/Assignment');
const Course = require('../models/Course');

async function findOwnedCourse(courseId, instructorId) {
  return Course.findOne({ _id: courseId, instructorId });
}

async function listCourses(req, res) {
  const courses = await Course.find({ instructorId: req.user.id })
    .populate('enrolledStudents', 'username displayName')
    .sort({ updatedAt: -1 });
  return res.json({ courses });
}

async function createCourse(req, res) {
  const { title, description, status } = req.body || {};
  if (typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ message: 'Course title is required.' });
  }
  const course = await Course.create({
    title: title.trim(),
    description: typeof description === 'string' ? description.trim() : '',
    status: status === 'Published' ? 'Published' : 'Draft',
    instructorId: req.user.id
  });
  return res.status(201).json({ course });
}

async function getCourse(req, res) {
  const course = await findOwnedCourse(req.params.courseId, req.user.id);
  if (!course) return res.status(404).json({ message: 'Course not found.' });
  return res.json({ course });
}

async function updateCourse(req, res) {
  const course = await findOwnedCourse(req.params.courseId, req.user.id);
  if (!course) return res.status(404).json({ message: 'Course not found.' });

  const { title, description, status } = req.body || {};
  if (typeof title !== 'undefined') {
    if (typeof title !== 'string' || !title.trim()) return res.status(400).json({ message: 'Course title cannot be empty.' });
    course.title = title.trim();
  }
  if (typeof description !== 'undefined') {
    if (typeof description !== 'string') return res.status(400).json({ message: 'Description must be a string.' });
    course.description = description.trim();
  }
  if (typeof status !== 'undefined') {
    if (!['Published', 'Draft'].includes(status)) return res.status(400).json({ message: 'Status must be Published or Draft.' });
    course.status = status;
  }
  await course.save();
  return res.json({ course });
}

async function deleteCourse(req, res) {
  const course = await findOwnedCourse(req.params.courseId, req.user.id);
  if (!course) return res.status(404).json({ message: 'Course not found.' });
  await Promise.all([
    course.deleteOne(),
    Assignment.deleteMany({ courseId: course._id }),
    Announcement.deleteMany({ courseId: course._id })
  ]);
  return res.json({ message: 'Course and related assignments and announcements deleted.' });
}

async function addLesson(req, res) {
  const course = await findOwnedCourse(req.params.courseId, req.user.id);
  if (!course) return res.status(404).json({ message: 'Course not found.' });
  const { title, description, content } = req.body || {};
  if (typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ message: 'Lesson title is required.' });
  }
  course.lessons.push({
    title: title.trim(),
    description: typeof description === 'string' ? description.trim() : '',
    content: typeof content === 'string' ? content : '',
    order: course.lessons.length
  });
  await course.save();
  return res.status(201).json({ course, lesson: course.lessons[course.lessons.length - 1] });
}

async function updateLesson(req, res) {
  const course = await findOwnedCourse(req.params.courseId, req.user.id);
  if (!course) return res.status(404).json({ message: 'Course not found.' });
  const lesson = course.lessons.id(req.params.lessonId);
  if (!lesson) return res.status(404).json({ message: 'Lesson not found.' });

  const { title, description, content, order } = req.body || {};
  if (typeof title !== 'undefined') {
    if (typeof title !== 'string' || !title.trim()) return res.status(400).json({ message: 'Lesson title cannot be empty.' });
    lesson.title = title.trim();
  }
  if (typeof description !== 'undefined') {
    if (typeof description !== 'string') return res.status(400).json({ message: 'Description must be a string.' });
    lesson.description = description.trim();
  }
  if (typeof content !== 'undefined') {
    if (typeof content !== 'string') return res.status(400).json({ message: 'Content must be a string.' });
    lesson.content = content;
  }
  if (typeof order !== 'undefined') {
    const parsedOrder = Number(order);
    if (!Number.isInteger(parsedOrder) || parsedOrder < 0) return res.status(400).json({ message: 'Order must be a non-negative integer.' });
    lesson.order = parsedOrder;
  }
  await course.save();
  return res.json({ course, lesson });
}

async function deleteLesson(req, res) {
  const course = await findOwnedCourse(req.params.courseId, req.user.id);
  if (!course) return res.status(404).json({ message: 'Course not found.' });
  const lesson = course.lessons.id(req.params.lessonId);
  if (!lesson) return res.status(404).json({ message: 'Lesson not found.' });
  lesson.deleteOne();
  await course.save();
  return res.json({ message: 'Lesson deleted.', course });
}

async function listSubmissions(req, res) {
  const courses = await Course.find({ instructorId: req.user.id }).select('_id title');
  const courseIds = courses.map((course) => course._id);
  const assignments = await Assignment.find({ courseId: { $in: courseIds } })
    .populate('courseId', 'title')
    .populate('submissions.studentId', 'username displayName')
    .sort({ createdAt: -1 });
  return res.json({
    submissions: assignments.flatMap((assignment) => assignment.submissions.map((submission) => ({
      id: submission._id,
      assignmentId: assignment._id,
      assignmentTitle: assignment.title,
      courseId: assignment.courseId._id,
      courseTitle: assignment.courseId.title,
      student: submission.studentId,
      content: submission.content,
      grade: submission.grade,
      feedback: submission.feedback,
      status: submission.status,
      submittedAt: submission.submittedAt
    })))
  });
}

async function gradeSubmission(req, res) {
  const { grade, feedback } = req.body || {};
  const numericGrade = Number(grade);
  if (
    grade === null ||
    typeof grade === 'undefined' ||
    (typeof grade === 'string' && !grade.trim()) ||
    !Number.isFinite(numericGrade) ||
    numericGrade < 0 ||
    numericGrade > 100
  ) {
    return res.status(400).json({ message: 'Grade must be a number from 0 to 100.' });
  }
  if (typeof feedback !== 'undefined' && typeof feedback !== 'string') {
    return res.status(400).json({ message: 'Feedback must be a string.' });
  }

  const assignment = await Assignment.findById(req.params.assignmentId);
  if (!assignment) return res.status(404).json({ message: 'Assignment not found.' });
  const course = await findOwnedCourse(assignment.courseId, req.user.id);
  if (!course) return res.status(404).json({ message: 'Assignment not found.' });
  const submission = assignment.submissions.id(req.params.submissionId);
  if (!submission) return res.status(404).json({ message: 'Submission not found.' });

  submission.grade = numericGrade;
  submission.feedback = typeof feedback === 'string' ? feedback.trim() : submission.feedback;
  submission.status = 'Graded';
  await assignment.save();
  return res.json({ submission });
}

async function listStudents(req, res) {
  const courses = await Course.find({ instructorId: req.user.id })
    .populate('enrolledStudents', 'username displayName')
    .select('title enrolledStudents');
  const roster = new Map();
  for (const course of courses) {
    for (const student of course.enrolledStudents) {
      const id = student._id.toString();
      if (!roster.has(id)) {
        roster.set(id, {
          id,
          username: student.username,
          displayName: student.displayName,
          courses: []
        });
      }
      roster.get(id).courses.push({ id: course._id, title: course.title });
    }
  }
  return res.json({ students: Array.from(roster.values()) });
}

async function listAnnouncements(req, res) {
  const announcements = await Announcement.find({ authorId: req.user.id })
    .populate('courseId', 'title')
    .sort({ createdAt: -1 });
  return res.json({ announcements });
}

async function createAnnouncement(req, res) {
  const { courseId, title, message } = req.body || {};
  if (typeof title !== 'string' || !title.trim() || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ message: 'Course, title, and message are required.' });
  }
  if (typeof courseId !== 'string' || !courseId) {
    return res.status(400).json({ message: 'A courseId is required.' });
  }
  const course = await findOwnedCourse(courseId, req.user.id);
  if (!course) return res.status(404).json({ message: 'Course not found.' });
  if (course.status !== 'Published') {
    return res.status(400).json({ message: 'Announcements can only be posted to published courses.' });
  }

  const announcement = await Announcement.create({
    courseId: course._id,
    authorId: req.user.id,
    title: title.trim(),
    message: message.trim()
  });
  return res.status(201).json({ announcement });
}

module.exports = {
  listCourses,
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
  addLesson,
  updateLesson,
  deleteLesson,
  listSubmissions,
  gradeSubmission,
  listStudents,
  listAnnouncements,
  createAnnouncement
};
