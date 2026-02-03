const mongoose = require("mongoose");

const standardSchema = new mongoose.Schema({
    standard : {
        type : Number,
        required : true,
    }
})

module.exports = mongoose.model("Standard",standardSchema);