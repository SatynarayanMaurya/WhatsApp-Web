
const cloudinary = require('cloudinary').v2


exports.uploadImageToCloudinary = async (file, folder,rename, height, quality)=>{
    const options = {
        folder,
        public_id:rename
    }
    if(height){
        options.height = height
    }
    if(quality){
        options.quality = quality

    }
    options.resource_type = "auto";
    return await cloudinary.uploader.upload(file.tempFilePath, options)
}