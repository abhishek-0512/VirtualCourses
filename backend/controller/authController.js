import { genToken } from "../config/token.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import User from "../model/userModel.js";


/* ==========================================
              COOKIE OPTIONS
========================================== */

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/"
};



/* ==========================================
                    SIGN UP
========================================== */

export const signUp = async (req,res)=>{

    try {

        let {name,email,password,role} = req.body;


        if(!name || !email || !password || !role){

            return res.status(400).json({
                success:false,
                message:"All fields are required"
            });

        }


        name = name.trim();
        email = email.trim().toLowerCase();



        if(!validator.isEmail(email)){

            return res.status(400).json({
                success:false,
                message:"Invalid email address"
            });

        }



        if(!["student","educator"].includes(role)){

            return res.status(400).json({
                success:false,
                message:"Invalid role"
            });

        }



        if(password.length < 8){

            return res.status(400).json({
                success:false,
                message:"Password must contain minimum 8 characters"
            });

        }



        const existingUser = await User.findOne({email});


        if(existingUser){

            return res.status(409).json({
                success:false,
                message:"Email already exists"
            });

        }



        const hashPassword = await bcrypt.hash(password,10);



        const user = await User.create({

            name,
            email,
            password:hashPassword,
            role

        });



        const token = genToken(user._id);


        res.cookie(
            "token",
            token,
            cookieOptions
        );



        return res.status(201).json({

            success:true,
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

        console.log("Signup Error:",error);


        return res.status(500).json({

            success:false,
            message:"Internal server error"

        });

    }

};





/* ==========================================
                    LOGIN
========================================== */

export const login = async(req,res)=>{

    try {


        let {email,password} = req.body;



        if(!email || !password){

            return res.status(400).json({

                success:false,
                message:"Email and password required"

            });

        }



        email = email.trim().toLowerCase();



        const user = await User.findOne({email})
        .select("+password");



        if(!user){

            return res.status(404).json({

                success:false,
                message:"User not found"

            });

        }



        const isMatch = await bcrypt.compare(
            password,
            user.password
        );



        if(!isMatch){

            return res.status(401).json({

                success:false,
                message:"Incorrect password"

            });

        }



        const token = genToken(user._id);



        res.cookie(
            "token",
            token,
            cookieOptions
        );



        return res.status(200).json({

            success:true,
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


        console.log("Login Error:",error);


        return res.status(500).json({

            success:false,
            message:"Internal server error"

        });

    }

};






/* ==========================================
                    LOGOUT
========================================== */

export const logOut = async(req,res)=>{

    try {


        res.clearCookie(
            "token",
            {
                httpOnly:true,
                secure:process.env.NODE_ENV === "production",
                sameSite:process.env.NODE_ENV === "production" 
                ? "None" 
                : "Lax",
                path:"/"
            }
        );



        return res.status(200).json({

            success:true,
            message:"Logged out successfully"

        });



    } catch(error){


        console.log("Logout Error:",error);


        return res.status(500).json({

            success:false,
            message:"Internal server error"

        });

    }

};





/* ==========================================
              GOOGLE LOGIN / SIGNUP
========================================== */

export const googleSignup = async(req,res)=>{

    try {


        let {name,email,role} = req.body;



        if(!name || !email){

            return res.status(400).json({

                success:false,
                message:"Google information missing"

            });

        }



        name = name.trim();
        email = email.trim().toLowerCase();



        if(!validator.isEmail(email)){

            return res.status(400).json({

                success:false,
                message:"Invalid email"

            });

        }



        if(!role){
            role="student";
        }



        if(!["student","educator"].includes(role)){


            return res.status(400).json({

                success:false,
                message:"Invalid role"

            });

        }




        let user = await User.findOne({email});



        if(!user){


            user = await User.create({

                name,
                email,
                role,
                googleId:email,
                photoUrl:""

            });


        }
        else{


            user.name = name;


            if(!user.googleId){

                user.googleId = email;

            }


            await user.save();

        }



        const token = genToken(user._id);



        res.cookie(
            "token",
            token,
            cookieOptions
        );



        return res.status(200).json({

            success:true,
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


        console.log("Google Login Error:",error);


        return res.status(500).json({

            success:false,
            message:"Internal server error"

        });

    }

};
/* ==========================================
              GET CURRENT USER
========================================== */

export const getCurrentUser = async (req, res) => {
    try {

        const user = await User.findById(req.userId)
            .select("-password")
            .populate("enrolledCourses");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {

        console.log("Get Current User Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
};