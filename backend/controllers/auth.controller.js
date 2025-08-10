const User = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

exports.signup = async(req,res)=>{
    try{
        const {name,phone,about,password} = req.body;
        if(!name || !phone || !password){
            return res.status(400).json({
                success:false,
                message:"Required field are missing"
            })
        }

        const existingUser = await User.findOne({phone})
        if(existingUser){
            return res.status(401).json({
                success:false,
                message :"This phone number is already associated with an existing account."
            })
        }
        const aboutValue = about?.trim() || undefined;
        const hashPassword = await bcrypt.hash(password,10)
        await User.create({name,phone,about:aboutValue,password:hashPassword})
        return res.status(201).json({
            success:true,
            message:"Registration completed successfully."
        })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error?.message ||"Sign-up failed. Please check your details and try again.",
            errorMessage:error?.message
        })
    }
}


exports.login = async(req,res)=>{
    try{
        const {phone,password} = req.body;
        if(!phone || !password){
            return res.status(400).json({
                success:false,
                message:"Required Field are missing"
            })
        }
        const existingUser = await User.findOne({phone})
        if(!existingUser){
            return res.status(403).json({
                success:false,
                message:"User is not registered with this phone no."
            })
        }

        const matchPassword = await bcrypt.compare(password,existingUser?.password)
        if(!matchPassword){
            return res.status(403).json({
                success:false,
                message:"Password incorrect"
            })
        }

        const token =  jwt.sign(
            {
                phone:existingUser?.phone,
                name:existingUser?.name,
                _id:existingUser?._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"7d"
            }
        )

        const isProduction = process.env.NODE_ENV === "production";

        const cookieOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "None" : "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
        };

        return res.cookie("token",token,cookieOptions).status(200).json({
            success:true,
            message:"Login Successful",
            userDetails:existingUser,
            token
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message || "Error while login ",
            errorMessage:error.message
        })
    }
}



exports.logout = async (req, res) => {
    try{
        res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV==="production", sameSite: "Strict" });
        res.status(200).json({ message: "Logged out successfully 🥺" });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Error in logout in backend ",
            errorMessage:error.message
        })
    }
}