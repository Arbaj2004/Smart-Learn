const mongoose = require('mongoose')
const AssignmentSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructions: { type: String, required: true },
    dueDate: { type: Date, required: true },
    dueTime: { type: String, required: true },
    maxMarks: { type: Number, required: true },
});

module.exports = mongoose.model("Assignment", AssignmentSchema);
