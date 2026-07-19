import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../model/userModel.js";


// ================= GET CURRENT USER =================

export const getCurrentUser = async (req,res) => {
    try {

        const user = await User.findById(req.userId)
            .select("-password")
            .populate("enrolledCourses");


        if(!user){
            return res.status(400).json({
                message:"User does not exist"
            });
        }


        return res.status(200).json(user);


    } catch (error) {

        console.log(error);

        return res.status(400).json({
            message:"Get current user error"
        });
    }
}



// ================= UPDATE PROFILE =================

export const UpdateProfile = async (req,res) => {

    try {

        const userId = req.userId;

        const {name, description} = req.body;


        let photoUrl;


        if(req.file){

            photoUrl = await uploadOnCloudinary(req.file.path);

        }


        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                name,
                description,
                ...(photoUrl && {photoUrl})
            },
            {
                new:true
            }
        ).select("-password");


        if(!updatedUser){

            return res.status(404).json({
                message:"User not found"
            });

        }


        return res.status(200).json(updatedUser);


    } catch(error){

        console.log(error);

        return res.status(500).json({
            message:`Update Profile Error ${error.message}`
        });
    }
}