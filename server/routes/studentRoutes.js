const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const studentController = require("../controllers/studentController");

router.use(authController.protect);
router.use(authController.isStudent);

router.post("/enroll-course/:courseId", studentController.enrollInCourse);         // Create a course
router.get("/enrolled-courses", studentController.getEnrolledCourses);         // Get all courses



module.exports = router;

