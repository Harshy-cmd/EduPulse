const express = require('express');
const {
  browseCourses,
  enrollCourse,
  listAssignments,
  submitAssignment,
  listGrades,
  listAnnouncements
} = require('../controllers/student.controller');
const { allowRoles, protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect, allowRoles('student'));
router.get('/courses', browseCourses);
router.post('/courses/:courseId/enroll', enrollCourse);
router.get('/assignments', listAssignments);
router.post('/assignments/:assignmentId/submissions', submitAssignment);
router.get('/grades', listGrades);
router.get('/announcements', listAnnouncements);

module.exports = router;
