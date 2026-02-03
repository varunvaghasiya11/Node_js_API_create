const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true,
    },
    standardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Standard"
    }
})

module.exports = mongoose.model("Subject", subjectSchema);