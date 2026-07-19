import mongoose from "mongoose";


const connectDb = async()=>{

    try{


        if(!process.env.MONGODB_URL){

            throw new Error(
                "MONGODB_URL is missing in environment variables"
            );

        }



        const connection = await mongoose.connect(
            process.env.MONGODB_URL
        );



        console.log(
            `DB connected: ${connection.connection.host}`
        );



    }
    catch(error){


        console.error(
            "Database Connection Error:",
            error.message
        );


        process.exit(1);

    }

};


export default connectDb;