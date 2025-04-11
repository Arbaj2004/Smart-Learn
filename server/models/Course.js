const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    restrictions: { type: Boolean, default: false },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty", required: true },
    studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Assignment" }],
    department: { type: String, required: true }, // Course category (e.g., "Computer Science")
    semester: { type: Number, required: true },
    courseCode: { type: String, unique: true, required: true }, // Unique identifier (e.g., "CS101")
    startDate: { type: Date, required: true }, // Course start date
    endDate: { type: Date }, // Optional course end date
    visibility: { type: Boolean, default: true }, // Whether the course is visible to students
    credits: { type: Number, default: 3 }, // Number of credits (if applicable)
    syllabus: { type: String }, // URL or description of syllabus
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Course", CourseSchema);
