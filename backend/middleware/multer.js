import multer from "multer";
import fs from "fs";
import path from "path";


const uploadDir = path.join(
    process.cwd(),
    "uploads"
);



if(!fs.existsSync(uploadDir)){

    fs.mkdirSync(
        uploadDir,
        {
            recursive:true
        }
    );

}



const storage = multer.diskStorage({

    destination:(req,file,cb)=>{

        cb(
            null,
            uploadDir
        );

    },


    filename:(req,file,cb)=>{

        const timestamp = Date.now();


        cb(
            null,
            `${timestamp}-${file.originalname}`
        );

    }

});





const fileFilter = (req,file,cb)=>{


    const allowedTypes = [

        "image/jpeg",
        "image/png",
        "image/webp",
        "video/mp4",
        "video/webm"

    ];



    if(
        allowedTypes.includes(file.mimetype)
    ){

        cb(null,true);

    }
    else{

        cb(
            new Error(
                "Invalid file type"
            ),
            false
        );

    }

};





const upload = multer({

    storage,


    limits:{

        fileSize:
        200 * 1024 * 1024

    },


    fileFilter

});



export default upload;