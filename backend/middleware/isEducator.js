import User from "../model/userModel.js";


const isEducator = async (req, res, next) => {

    try {

        const user = await User.findById(req.userId);


        if(!user){

            return res.status(404).json({
                message:"User not found"
            });

        }


        if(user.role !== "educator"){

            return res.status(403).json({
                message:"Only educators can perform this action"
            });

        }


        next();


    } catch(error){

        console.log(error);

        return res.status(500).json({
            message:"Educator verification failed"
        });

    }

};


export default isEducator;