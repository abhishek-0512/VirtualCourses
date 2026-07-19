import { v2 as cloudinary } from "cloudinary";
import fs from "fs";


console.log("Cloudinary Config Check:");
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY);
console.log("API Secret:", process.env.CLOUDINARY_API_SECRET ? "Loaded" : "Missing");



cloudinary.config({

    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,

    api_key: process.env.CLOUDINARY_API_KEY,

    api_secret: process.env.CLOUDINARY_API_SECRET,

});



const uploadOnCloudinary = async (filePath) => {

    try {


        if (!filePath) {

            console.log("❌ No file path received.");

            return "";

        }



        console.log("📂 Uploading file:", filePath);



        const uploadResult = await cloudinary.uploader.upload(
            filePath,
            {
                resource_type: "auto",
                folder: "VirtualCourses",
            }
        );



        console.log("✅ Cloudinary Upload Success");

        console.log("🌐 URL:", uploadResult.secure_url);



        if (fs.existsSync(filePath)) {

            fs.unlinkSync(filePath);

        }



        return uploadResult.secure_url;



    } catch (error) {


        console.log("❌ Cloudinary Upload Failed");

        console.log(error.message);



        if (filePath && fs.existsSync(filePath)) {

            fs.unlinkSync(filePath);

        }


        return "";

    }

};


export default uploadOnCloudinary;