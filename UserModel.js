const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    email:{type:String,required:true},
    password:{type:String,required:true,minlength:8},
    displayName:{type:String}
})


module.exports = User = mongoose.model("user",UserSchema)