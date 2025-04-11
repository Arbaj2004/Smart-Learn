const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");

router.get("/", courseController.getAllCourses);         // Get all courses
router.get("/:courseId", courseController.getCourseById);    // Get a single course
router.get('/:courseId/enrolled-students', courseController.getEnrolledStudents); // Get all enrolled students of a course
router.get('/')
module.exports = router;
