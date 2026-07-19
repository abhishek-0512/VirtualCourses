import jwt from "jsonwebtoken";


export const genToken = (userId) => {

    try {


        if(!process.env.JWT_SECRET){

            throw new Error("JWT_SECRET is missing in environment variables");

        }


        const token = jwt.sign(
            {
                userId
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "7d"
            }
        );


        return token;



    } catch(error){


        console.log(
            "JWT Token Generation Error:",
            error.message
        );


        throw new Error(
            "Failed to generate authentication token"
        );

    }

};