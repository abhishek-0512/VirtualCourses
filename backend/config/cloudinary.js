import { v2 as cloudinary } from "cloudinary";
import fs from "fs";


if(
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
){

    console.log(
        "Cloudinary environment variables missing"
    );

}



cloudinary.config({

    cloud_name:
    process.env.CLOUDINARY_CLOUD_NAME,


    api_key:
    process.env.CLOUDINARY_API_KEY,


    api_secret:
    process.env.CLOUDINARY_API_SECRET

});




const uploadOnCloudinary = async(filePath)=>{

    try{


        if(!filePath){

            throw new Error(
                "File path not found"
            );

        }



        const result =
        await cloudinary.uploader.upload(
            filePath,
            {
                folder:"VirtualCourses",
                resource_type:"auto"
            }
        );



        // Remove temporary file
        if(fs.existsSync(filePath)){

            fs.unlinkSync(filePath);

        }



        return result.secure_url;



    }
    catch(error){


        console.log(
            "Cloudinary Error:",
            error.message
        );


        if(
            filePath &&
            fs.existsSync(filePath)
        ){

            fs.unlinkSync(filePath);

        }



        return "";

    }

};



export default uploadOnCloudinary;