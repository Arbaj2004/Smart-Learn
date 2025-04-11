const Course = require("../models/Course");
const Faculty = require("../models/Faculty");
const Student = require("../models/Student");
const User = require("../models/User");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getUnapprovedFaculty = async (req, res, next) => {
    try {
        const unapprovedFaculty = await Faculty.find({ approved: false }).populate('userId');

        res.status(200).json({
            status: "success",
            results: unapprovedFaculty.length,
            data: {
                faculty: unapprovedFaculty
            }
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

exports.approveFaculty = async (req, res, next) => {
    try {
        const { facultyId } = req.params;
        const updatedFaculty = await Faculty.findByIdAndUpdate(
            facultyId,
            { approved: true },
            { new: true, runValidators: true }
        ).populate('userId');
        if (!updatedFaculty) {
            return res.status(404).json({
                status: "fail",
                message: "Faculty not found"
            });
        }
        res.status(200).json({
            status: "success",
            message: "Faculty approved successfully",
            data: {
                faculty: updatedFaculty
            }
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

exports.deleteFaculty = async (req, res, next) => {
    try {
        const { facultyId } = req.params;
        const faculty = await Faculty.findById(facultyId);
        const user = await User.findById(faculty.userId);
        await user.deleteOne();
        const deletedFaculty = await Faculty.findByIdAndDelete(facultyId);
        if (!deletedFaculty) {
            return res.status(404).json({
                status: "fail",
                message: "Faculty not found"
            });
        }
        res.status(204).json({
            status: "success",
            message: "Faculty deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
}

exports.getAllFaculty = async (req, res, next) => {
    try {
        const faculty = await Faculty.find().populate('userId');
        res.status(200).json({
            status: "success",
            results: faculty.length,
            data: {
                faculty
            }
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
}

exports.getStats = catchAsync(async (req, res, next) => {
    try {
        const [totalStudents, totalFaculty, totalCourses, pendingApprovals] = await Promise.all([
            Student.countDocuments(), // Total number of students
            Faculty.countDocuments(), // Total number of faculty
            Course.countDocuments(),  // Total courses
            Faculty.countDocuments({ isApproved: false }), // Pending faculty approvals
        ]);
        console.log(totalStudents, totalFaculty, totalCourses, pendingApprovals);

        res.status(200).json({
            status: "success",
            data: {
                totalStudents,
                totalFaculty,
                totalCourses,
                pendingApprovals,
                // activeEnrollments
            }
        });
    } catch (error) {
        next(new AppError(error.message, 500));
    }
});