import jwt from "jsonwebtoken";


const isAuth = async (req,res,next)=>{

    try {


        const token = req.cookies?.token;


        if(!token){

            return res.status(401).json({
                message:"User does not have token"
            });

        }



        if(!process.env.JWT_SECRET){

            return res.status(500).json({
                message:"JWT secret missing"
            });

        }



        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );



        if(!decoded?.userId){

            return res.status(401).json({
                message:"Invalid token"
            });

        }



        req.userId = decoded.userId;


        next();



    } catch(error){


        console.log("Auth Error:",error.message);



        if(error.name === "TokenExpiredError"){

            return res.status(401).json({
                message:"Token expired. Please login again"
            });

        }



        if(error.name === "JsonWebTokenError"){

            return res.status(401).json({
                message:"Invalid token"
            });

        }



        return res.status(500).json({
            message:"Authentication failed"
        });

    }

};


export default isAuth;