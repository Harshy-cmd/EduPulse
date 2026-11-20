const express = require('express');
const {
  getOverview,
  listUsers,
  updateUser,
  deleteUser,
  listCourses,
  updateCourse,
  deleteCourse
} = require('../controllers/admin.controller');
const { allowRoles, protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect, allowRoles('admin'));
router.get('/overview', getOverview);
router.get('/users', listUsers);
router.patch('/users/:userId', updateUser);
router.delete('/users/:userId', deleteUser);
router.get('/courses', listCourses);
router.patch('/courses/:courseId', updateCourse);
router.delete('/courses/:courseId', deleteCourse);

module.exports = router;
