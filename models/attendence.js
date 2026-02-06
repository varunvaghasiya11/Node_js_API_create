const mongoose = require("mongoose")

const attendanceSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    records: [{
        studentId: { type: mongoose.Schema.ObjectId, required: true },
        status: {
            type: String,
            enum: ["present", "absent"],
            required: true
        }
    }],
    markedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    }
})

const attendenceModel = mongoose.model("attendence", attendanceSchema)

module.exports = attendenceModel;