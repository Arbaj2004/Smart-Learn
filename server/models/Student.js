const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    department: {
        type: String,
        required: [true, "Please specify the department"]
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    mis: {
        type: String,
        required: true,
        unique: true
    }

});

module.exports = mongoose.model("Student", StudentSchema);
