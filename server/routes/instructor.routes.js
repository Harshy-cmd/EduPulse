const express = require('express');
const {
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
} = require('../controllers/instructor.controller');
const { allowRoles, protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect, allowRoles('instructor'));
router.get('/courses', listCourses);
router.post('/courses', createCourse);
router.get('/courses/:courseId', getCourse);
router.patch('/courses/:courseId', updateCourse);
router.delete('/courses/:courseId', deleteCourse);
router.post('/courses/:courseId/lessons', addLesson);
router.patch('/courses/:courseId/lessons/:lessonId', updateLesson);
router.delete('/courses/:courseId/lessons/:lessonId', deleteLesson);
router.get('/submissions', listSubmissions);
router.patch('/assignments/:assignmentId/submissions/:submissionId/grade', gradeSubmission);
router.get('/students', listStudents);
router.get('/announcements', listAnnouncements);
router.post('/announcements', createAnnouncement);

module.exports = router;
