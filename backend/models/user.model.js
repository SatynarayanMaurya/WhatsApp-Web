const mongoose =  require("mongoose")

const userSchema = new mongoose.Schema({
    phone:{
        type:Number,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    about:{
        type:String,
        default:"Hey there! I am using WhatsApp."
    },
    profileImage: {
        type: String,
        default: "", // URL to profile picture (can be base64 or Cloudinary URL)
    },
    isOnline: {
        type: Boolean,
        default: false,
    },
    lastSeen: {
        type: Date,
        default: Date.now,
    },
    socketId: {
        type: String,           // For real-time online tracking
    },
    password:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    updatedAt:{
        type:Date,
        default:Date.now()
    }
})


module.exports = mongoose.model("User", userSchema);
