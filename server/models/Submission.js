const mongoose = require('mongoose')
const SubmissionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment", required: true },
    fileUrl: { type: String, required: true }, // Student's uploaded assignment file
    submittedAt: { type: Date },
    plagiarismScore: { type: Number, default: 0 },
    status: { type: String, enum: ["Pending", "Submitted", "Graded"], default: "Pending" },
    grade: { type: Number, default: 0 }
});

module.exports = mongoose.model("Submisssion", SubmissionSchema);
