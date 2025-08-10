const User = require("../models/user.model")


exports.getUserDetails = async(req,res)=>{
    try{
        const userDetails = await User.findById(req.user?._id)
        return res.status(200).json({
            success:true,
            message:"User details fetched successfully",
            userDetails
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error?.message || "Error in fetching the user details"
        })
    }
}

exports.getAllUsers = async (req ,res)=>{
    try{
        const allUsers = await User.find({})
        return res.status(200).json({
            success:true,
            message:"All User fetched successfully",
            allUsers
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message || "Error in getting all the users",
            errorMessage:error.message
        })
    }
}


exports.updateProfile = async(req,res)=>{
    try{
        const {name,about} = req.body;
        if(!name && !about){
            return res.status(400).json({
                success:false,
                message:"Required field are missing"
            })
        }

        const data = {}
        if(name?.trim()){
            data.name = name
        }
        if(about?.trim()){
            data.about = about
        }
        data.updatedAt = Date.now()
        await User.findByIdAndUpdate(req.user._id,{$set:data})
        return res.status(200).json({
            success:true,
            message:"Profile Updated"
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error?.message || "Error in updating the user "
        })
    }
}


exports.markAsOffline = async(userId)=>{
    try{
        if(!userId){
            console.log("User id not found ")
        }
        const updatedUser = await User.findByIdAndUpdate({_id:userId},{isOnline:false,lastSeen:Date.now()})
        return updatedUser;
    }
    catch(error){
        console.log("Error in updating the user as offline: ",error)
    }
}

exports.markAsOnline = async(userId)=>{
    try{
        if(!userId){
            console.log("User id not found ")
        }
        const updatedUser = await User.findByIdAndUpdate({_id:userId},{isOnline:true,lastSeen:Date.now()})
        return updatedUser;
    }
    catch(error){
        console.log("Error in updating the user as online : ",error)
    }
}