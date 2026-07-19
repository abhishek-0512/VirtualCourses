import { genToken } from "../config/token.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import User from "../model/userModel.js";
import sendMail from "../config/Mail.js";


export const signUp = async (req,res)=>{

    try {

        const {name,email,password,role} = req.body;


        const existUser = await User.findOne({email});

        if(existUser){
            return res.status(400).json({
                message:"email already exist"
            });
        }


        if(!validator.isEmail(email)){
            return res.status(400).json({
                message:"Please enter valid Email"
            });
        }


        if(password.length < 8){
            return res.status(400).json({
                message:"Please enter a Strong Password"
            });
        }


        const hashPassword = await bcrypt.hash(password,10);


        const user = await User.create({
            name,
            email,
            password:hashPassword,
            role
        });


        const token = await genToken(user._id);


        res.cookie("token",token,{
            httpOnly:true,
            secure:false,
            sameSite:"Strict",
            maxAge:7*24*60*60*1000
        });


        return res.status(201).json({
            message:"Account created successfully",
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role,
                photoUrl:user.photoUrl
            }
        });


    } catch(error){

        console.log("signup error",error);

        return res.status(500).json({
            message:`signup Error ${error}`
        });
    }
};





export const login = async(req,res)=>{

    try {

        const {email,password}=req.body;


        const user = await User.findOne({email});


        if(!user){
            return res.status(400).json({
                message:"user does not exist"
            });
        }


        const isMatch = await bcrypt.compare(
            password,
            user.password
        );


        if(!isMatch){
            return res.status(400).json({
                message:"incorrect Password"
            });
        }



        const token = await genToken(user._id);


        res.cookie("token",token,{
            httpOnly:true,
            secure:false,
            sameSite:"Strict",
            maxAge:7*24*60*60*1000
        });



        return res.status(200).json({

            message:"Login successful",

            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role,
                photoUrl:user.photoUrl
            }

        });



    } catch(error){

        console.log("login error",error);

        return res.status(500).json({
            message:`login Error ${error}`
        });
    }
};






export const logOut = async(req,res)=>{

    try {


        res.clearCookie("token",{
            httpOnly:true,
            sameSite:"Strict",
            secure:false
        });


        return res.status(200).json({
            message:"logOut Successfully"
        });


    } catch(error){

        return res.status(500).json({
            message:`logout Error ${error}`
        });
    }
};








export const googleSignup = async(req,res)=>{

    try {


        const {name,email,role}=req.body;


        let user = await User.findOne({email});


        if(!user){

            user = await User.create({

                name,
                email,
                role,
                googleId:email

            });

        }



        const token = await genToken(user._id);



        res.cookie("token",token,{
            httpOnly:true,
            secure:false,
            sameSite:"Strict",
            maxAge:7*24*60*60*1000
        });



        return res.status(200).json({

            message:"Google login successful",

            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role,
                photoUrl:user.photoUrl
            }

        });



    } catch(error){

        console.log(error);

        return res.status(500).json({
            message:`googleSignup Error ${error}`
        });
    }

};









export const sendOtp = async(req,res)=>{

    try {


        const {email}=req.body;


        const user = await User.findOne({email});


        if(!user){

            return res.status(404).json({
                message:"User not found"
            });
        }



        const otp = Math.floor(
            1000 + Math.random()*9000
        ).toString();



        user.resetOtp = otp;

        user.otpExpires =
        Date.now()+5*60*1000;

        user.isOtpVerified=false;



        await user.save();



        await sendMail(email,otp);



        return res.status(200).json({

            message:"OTP sent successfully"

        });



    } catch(error){

        return res.status(500).json({
            message:`send otp error ${error}`
        });
    }
};









export const verifyOtp = async(req,res)=>{


    try {


        const {email,otp}=req.body;



        const user = await User.findOne({email});



        if(
            !user ||
            user.resetOtp !== otp ||
            user.otpExpires < Date.now()
        ){

            return res.status(400).json({
                message:"Invalid OTP"
            });

        }



        user.isOtpVerified=true;

        user.resetOtp=undefined;

        user.otpExpires=undefined;



        await user.save();



        return res.status(200).json({

            message:"OTP verified"

        });



    } catch(error){

        return res.status(500).json({
            message:`verify otp error ${error}`
        });
    }

};









export const resetPassword = async(req,res)=>{


    try {


        const {email,password}=req.body;



        const user = await User.findOne({email});



        if(
            !user ||
            !user.isOtpVerified
        ){

            return res.status(400).json({

                message:"OTP verification required"

            });

        }



        if(password.length < 8){

            return res.status(400).json({

                message:"Password must contain minimum 8 characters"

            });

        }



        const hashPassword =
        await bcrypt.hash(password,10);



        user.password = hashPassword;

        user.isOtpVerified=false;



        await user.save();



        return res.status(200).json({

            message:"Password Reset Successfully"

        });



    } catch(error){


        return res.status(500).json({

            message:`Reset Password error ${error}`

        });

    }

};