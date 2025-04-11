const Course = require("../models/Course");
const Student = require("../models/Student");

exports.enrollInCourse = async (req, res) => {
    try {
        const userId = req.user._id;
        // console.log(">>>", userId);
        // console.log(">>>", req.user);
        const student = await Student.findOne({ userId: req.user._id });


        const { courseId } = req.params;

        if (!student) {
            return res.status(404).json({ status: "fail", message: "Student not found" });
        }

        // Extract semester from MIS (first character)
        // const studentSemester = parseInt(student.mis.charAt(0));
        // console.log(">>>", student);
        const studentSemester = 5;
        if (isNaN(studentSemester)) {
            return res.status(400).json({ status: "fail", message: "Invalid MIS format" });
        }

        // Fetch course details
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ status: "fail", message: "Course not found" });
        }

        // Check if course is approved and visible
        if (!course.visibility) {
            return res.status(403).json({ status: "fail", message: "Course is not available for enrollment" });
        }

        // Check department match
        if (course.restrictions && course.department !== student.department) {
            return res.status(403).json({ status: "fail", message: "You are not eligible for this course" });
        }

        // Check semester match
        if (course.restrictions && course.semester !== studentSemester) {
            return res.status(403).json({ status: "fail", message: "This course is not for your semester" });
        }

        // Check if already enrolled
        if (course.studentsEnrolled.includes(student._id)) {
            return res.status(400).json({ status: "fail", message: "You are already enrolled in this course" });
        }

        // Enroll student
        course.studentsEnrolled.push(student._id);
        await course.save();

        res.status(200).json({
            status: "success",
            message: "Successfully enrolled in the course",
            data: course
        });

    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

exports.getEnrolledCourses = async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.user._id });
        if (!student) {
            return res.status(404).json({ status: "fail", message: "Student not found" });
        }

        const courses = await Course.find({ studentsEnrolled: student._id });
        res.status(200).json({
            status: "success",
            results: courses.length,
            data: courses
        });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
}