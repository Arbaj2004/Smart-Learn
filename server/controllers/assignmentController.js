const Assignment = require("../models/Assignment");
const Course = require("../models/Course");
const Submission = require("../models/Submission");
const User = require("../models/User");
const Student = require("../models/Student");

// Create an assignment
exports.createAssignment = async (req, res) => {
    try {
        const { courseId, title, description, instructions, dueDate, dueTime, maxMarks } = req.body;

        // Check if the course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ status: "fail", message: "Course not found" });
        }

        const assignment = await Assignment.create({
            courseId,
            title,
            description,
            instructions,
            dueDate,
            dueTime,
            maxMarks
        });

        res.status(201).json({
            status: "success",
            data: assignment
        });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

// Get all assignments of a course
exports.getAssignmentsByCourse = async (req, res) => {
    try {
        const assignments = await Assignment.find({ courseId: req.params.courseId });

        res.status(200).json({
            status: "success",
            results: assignments.length,
            data: assignments
        });
    } catch (error) {
        res.status(500).json({ status: "fail", message: error.message });
    }
};

// Get a single assignment by ID
exports.getAssignmentById = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.assignmentId);
        if (!assignment) {
            return res.status(404).json({ status: "fail", message: "Assignment not found" });
        }

        res.status(200).json({
            status: "success",
            data: assignment
        });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

// Update an assignment
exports.updateAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findByIdAndUpdate(req.params.assignmentId, req.body, {
            new: true,
            runValidators: true
        });

        if (!assignment) {
            return res.status(404).json({ status: "fail", message: "Assignment not found" });
        }

        res.status(200).json({
            status: "success",
            data: assignment
        });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

// Delete an assignment
exports.deleteAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findByIdAndDelete(req.params.assignmentId);
        if (!assignment) {
            return res.status(404).json({ status: "fail", message: "Assignment not found" });
        }

        res.status(204).json({
            status: "success",
            message: "Assignment deleted"
        });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};



// Submit an assignment
exports.submitAssignment = async (req, res) => {
    try {
        const { assignmentId, fileUrl } = req.body;
        const userId = req.user._id; // Assuming user is authenticated and is a student
        // console.log(userId);
        // Check if assignment exists
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ status: "fail", message: "Assignment not found" });
        }

        const submission = await Submission.create({
            assignmentId,
            userId,
            fileUrl,
            submittedAt: new Date(),
            status: "Submitted"
        });

        res.status(201).json({
            status: "success",
            data: submission
        });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

// Get all submissions for an assignment
exports.getSubmissionsByAssignment = async (req, res) => {
    try {
        const submissions = await Submission.find({ assignmentId: req.params.assignmentId }).populate("userId")

        console.log("submissions")
        console.log(submissions)
        res.status(200).json({
            status: "success",
            results: submissions.length,
            data: submissions
        });
    } catch (error) {
        res.status(500).json({ status: "fail", message: error.message });
    }
};

// Get a specific submission by ID
exports.getSubmissionById = async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.submissionId).populate("userId");

        if (!submission) {
            return res.status(404).json({ status: "fail", message: "Submission not found" });
        }

        res.status(200).json({
            status: "success",
            data: submission
        });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

// Grade an assignment submission
exports.gradeSubmission = async (req, res) => {
    try {
        const { grade, feedback } = req.body;

        const submission = await Submission.findByIdAndUpdate(
            req.params.submissionId,
            { grade, status: "Graded", feedback },
            { new: true, runValidators: true }
        );

        if (!submission) {
            return res.status(404).json({ status: "fail", message: "Submission not found" });
        }

        res.status(200).json({
            status: "success",
            data: submission
        });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

exports.fetchSubmissionDetails = async (req, res) => {
    try {
        const submission = await Submission.findOne({ assignmentId: req.params.assignmentId, userId: req.user._id });

        if (!submission) {
            return res.status(404).json({ status: "fail", message: "Submission not found" });
        }

        res.status(200).json({
            status: "success",
            data: submission
        });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
}

exports.deleteSubmission = async (req, res) => {
    try {
        const submission = await Submission.findByIdAndDelete(req.params.submissionId);
        if (!submission) {
            return res.status(404).json({ status: "fail", message: "Submission not found" });
        }

        res.status(204).json({
            status: "success",
            message: "Submission deleted"
        });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
}

exports.fetchSubmissionDetails1 = async (req, res) => {
    try {
        const submission = await Submission.find({ assignmentId: req.params.assignmentId })
            .populate("userId", "name email")
            .populate("assignmentId", "title dueDate dueTime maxMarks");
        if (!submission) {
            return res.status(404).json({ status: "fail", message: "Submission not found" });
        }
        console.log(submission)
        res.status(200).json({
            status: "success",
            data: submission
        });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
}

// exports.fetchSubmissionDetails = async (req, res) => {
//     try {
//         const submissions = await Submission.find({ assignmentId: req.params.assignmentId })
//             .populate("studentId", "name email")
//             .populate("assignmentId", "title dueDate dueTime maxMarks");
//         if (!submission) {
//             return res.status(404).json({ status: "fail", message: "Submission not found" });
//         }

//         res.status(200).json({
//             status: "success",
//             data: submission
//         });
//     } catch (error) {
//         res.status(400).json({ status: "fail", message: error.message });
//     }
// }