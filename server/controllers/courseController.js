const Course = require("../models/Course");
const Faculty = require("../models/Faculty");

// Create a new course
exports.createCourse = async (req, res) => {
    try {
        const user = req.user._id;
        const faculty = await Faculty.findOne({ userId: user });
        req.body.faculty = faculty;
        const course = await Course.create(req.body);
        res.status(201).json({
            status: "success",
            data: course
        });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find()
            .populate({
                path: "faculty",
                populate: {
                    path: "userId",
                    select: "name email role profilePic"
                }
            });

        res.status(200).json({
            status: "success",
            results: courses.length,
            data: courses
        });
    } catch (error) {
        res.status(500).json({ status: "fail", message: error.message });
    }
};

// Get a single course by ID with faculty and user details
exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId)
            .populate({
                path: "faculty",
                populate: { path: "userId", select: "name email profilePic" }
            })
            .populate({
                path: "studentsEnrolled",
                populate: { path: "userId", select: "name email profilePic" }
            })

        if (!course) {
            return res.status(404).json({ status: "fail", message: "Course not found" });
        }

        res.status(200).json({ status: "success", data: course });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};


// Update a course
exports.updateCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, {
            new: true,
            runValidators: true
        });
        if (!course) {
            return res.status(404).json({ status: "fail", message: "Course not found" });
        }
        res.status(200).json({ status: "success", data: course });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

// Delete a course
exports.deleteCourse = async (req, res) => {
    try {
        const user = req.user._id;
        const course = await Course.findById(req.params.courseId).populate("faculty");
        console.log(course.faculty.userId, user);
        if (course.faculty.userId.toString() !== user.toString()) {
            return res.status(401).json({ status: "fail", message: "You are not authorized to delete this course" });
        }
        await Course.findByIdAndDelete(req.params.courseId);
        if (!course) {
            return res.status(404).json({ status: "fail", message: "Course not found" });
        }
        res.status(204).json({ status: "success", message: "Course deleted" });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

exports.getCoursesOfFaculty = async (req, res) => {
    try {
        const user = req.user._id;
        console.log(user)
        const faculty = await Faculty.findOne({ userId: user });
        const courses = await Course.find({ faculty: faculty._id })
            .populate({
                path: "faculty",
                populate: {
                    path: "userId",
                    select: "name email role profilePic"
                }
            });
        res.status(200).json({
            status: "success",
            results: courses.length,
            data: courses
        });
    } catch (error) {
        res.status(500).json({ status: "fail", message: error.message });
    }
};

exports.getEnrolledStudents = async (req, res) => {
    try {

        const course = await Course.findById(req.params.courseId)
            .populate({
                path: "studentsEnrolled",
                populate: { path: "userId", select: "name email profilePic" } // Nested population
            });

        if (!course) {
            return res.status(404).json({ status: "fail", message: "Course not found" });
        }
        // console.log(course.studentsEnrolled);
        res.status(200).json({
            status: "success",
            results: course.studentsEnrolled.length,
            data: course.studentsEnrolled
        });
    }
    catch (error) {
        res.status(500).json({ status: "fail", message: error.message });
    }
}
