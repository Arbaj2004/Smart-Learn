const mongoose = require('mongoose')
const FacultySchema = new mongoose.Schema({
    department: {
        type: String,
        required: [true, "Please specify the department"]
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    approved: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("Faculty", FacultySchema);
