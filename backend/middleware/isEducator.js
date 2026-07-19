import User from "../model/userModel.js";


const isEducator = async (req,res,next)=>{

    try {


        const user = await User.findById(req.userId)
            .select("role");



        if(!user){

            return res.status(404).json({

                success:false,
                message:"User not found"

            });

        }



        if(user.role !== "educator"){

            return res.status(403).json({

                success:false,
                message:"Only educators can perform this action"

            });

        }



        next();



    } catch(error){


        console.log(
            "Educator Middleware Error:",
            error.message
        );



        return res.status(500).json({

            success:false,
            message:"Educator verification failed"

        });

    }

};


export default isEducator;