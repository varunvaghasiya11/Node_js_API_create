const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    username :{
        type : String,
        required : true,
        unique : true
    },
    firstname : {
        type : String,
        required : true
    },
    lastname : {
        type : String,
        required : true
    },  
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    role : {
        type : String,
        enum : ['Admin','student','teacher'],
        default : 'Admin'
    },
    standard : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Standard",
        required : true
    },
    subject : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Subject",
        required : true
    }],
    isDeleted : {
        type : Boolean,
        default : false
    },
    deletedAt : {
        type : Date,
        default : null
    }
})

module.exports = mongoose.model("User",userSchema);
