const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const authController = require("../controllers/authController");

router.use(authController.protect);
router.use(authController.isFaculty);
router.post("/course", courseController.createCourse);         // Create a course
router.get("/course/get-enrolled-students/:courseId", courseController.getEnrolledStudents);         // Create a course
router.get("/courses", courseController.getCoursesOfFaculty);         // Get all courses
router.patch("/course/:courseId", courseController.updateCourse); // Update a course
router.delete("/course/:courseId", courseController.deleteCourse); // Delete a course

module.exports = router;
