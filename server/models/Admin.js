const mongoose = require("mongoose");
const AdminSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    approvedEducators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Educator"
    }],
    approvedCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    }],
});

module.exports = mongoose.model("Admin", AdminSchema);
