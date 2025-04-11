const express = require("express");
const assignmentController = require("../controllers/assignmentController");
const authController = require("../controllers/authController");
const router = express.Router();

router.post("/", authController.protect, authController.isFaculty, assignmentController.createAssignment);
router.get("/:courseId", assignmentController.getAssignmentsByCourse);
router.get("/assignment/:assignmentId", assignmentController.getAssignmentById);
router.put("/:assignmentId", authController.protect, authController.isFaculty, assignmentController.updateAssignment);
router.delete("/:assignmentId", authController.protect, authController.isFaculty, assignmentController.deleteAssignment);


router.post("/submit", authController.protect, authController.isStudent, assignmentController.submitAssignment);
router.get("/submissions/:assignmentId", assignmentController.getSubmissionsByAssignment);
router.get('/fetch-submission-details/:assignmentId', authController.protect, assignmentController.fetchSubmissionDetails);
router.get("/submission/:submissionId", assignmentController.getSubmissionById);
router.delete("/submission/:submissionId", assignmentController.deleteSubmission);
router.patch("/grade/:submissionId", authController.protect, authController.isFaculty, assignmentController.gradeSubmission);

router.get("/fetch-submission-details1/:assignmentId", assignmentController.getSubmissionsByAssignment);
module.exports = router;
