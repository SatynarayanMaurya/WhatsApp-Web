const Status = require("../models/StatusSchema.model");
const { uploadImageToCloudinary } = require("../utils/uploadToCloudinary");
const cloudinary = require('cloudinary').v2

exports.addStatus = async(req,res)=>{
    try{
        const file = req.files.file
        if(!file){
            return res.Status(400).json({
                success:false,
                message:"File not found"
            })
        }
        const supportedTypes = ["png", "jpg", "jpeg","mp4"];
        let uploadedImageUrls = [];
        let publicIdOfImages = [];

        const existingstatusUser = await Status.findOne({user:req.user?._id})

        if(existingstatusUser){
            const mimeType = file?.mimetype?.split("/")[1];
            if (!supportedTypes.includes(mimeType)) {
                return res.status(400).json({
                success: false,
                message: "Only PNG, JPG, JPEG and mp4 file types are supported",
                });
            }

            try {
                if (existingstatusUser?.publidUrlOfstatus) {
                    try {
                        await cloudinary.uploader.destroy(existingstatusUser?.publidUrlOfstatus);
                    } catch (err) {
                        console.error(`Failed to delete image at index`, err.message);
                    }
                }
                const upload = await uploadImageToCloudinary(
                file,
                process.env.STATUS,
                `${req.user._id}`
                );

                uploadedImageUrls=upload?.secure_url || "";
                publicIdOfImages= upload?.public_id || "";
                await Status.findByIdAndUpdate(existingstatusUser?._id,{$set:{statusUrl:uploadedImageUrls,publidUrlOfstatus:publicIdOfImages,views:[],expiresAt: Date.now() + 24 * 60 * 60 * 1000,type:mimeType}})


            } catch (error) {
                return res.status(500).json({
                success: false,
                message:error.message|| `Error uploading image `,
                errorMessage: error.message,
                });
            }
        }
        else{
            const mimeType = file?.mimetype?.split("/")[1];
            if (!supportedTypes.includes(mimeType)) {
                return res.status(400).json({
                success: false,
                message: "Only PNG, JPG, JPEG and mp4 file types are supported",
                });
            }
            const upload = await uploadImageToCloudinary(
                file,
                process.env.STATUS,
                `${req.user._id}`
            );

            uploadedImageUrls=upload?.secure_url || "";
            publicIdOfImages= upload?.public_id || "";
            await Status.create({user:req.user?._id,statusUrl:uploadedImageUrls,publidUrlOfstatus:publicIdOfImages,views:[],expiresAt: Date.now() + 24 * 60 * 60 * 1000,type:mimeType})
        }

        return res.status(200).json({
            success:true,
            message:"Status Updated"
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message || "Error in add the status"
        })
    }
}

exports.getAllStatus = async (req,res)=>{
    try{
        const allStatus = await Status.find({}).populate("user", "-password").populate({path: "views.viewer",select: "-password"});
        return res.status(200).json({
            success:true,
            message:"All Status fetched successfully",
            allStatus
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message || "Error in fetching all status"
        })
    }
}

exports.seenStatus = async (data) =>{
    try{
        const {statusId,seenBy} = data
        if(!statusId || !seenBy){
            console.log("Status Id or User id not found")
            return ;
        }

        await Status.findByIdAndUpdate(statusId,{$push:{views:{viewer:seenBy}}},{new:true})
        const updatedStatus = await Status.find().populate("user", "-password").populate({path: "views.viewer",select: "-password"});
        return updatedStatus

    }
    catch(error){
        console.log("Error in updating the seen status : ",error)
    }
}

exports.getAllStatusForSocket = async()=>{
    try{
        const allStatus = await Status.find().populate("user", "-password").populate({path: "views.viewer",select: "-password"});
        return allStatus;
    }
    catch(error){
        console.log("Error in getting all the status for socket : ",error)
    }
}