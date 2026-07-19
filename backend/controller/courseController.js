import uploadOnCloudinary from "../config/cloudinary.js";
import Course from "../model/courseModel.js";
import Lecture from "../model/lectureModel.js";
import User from "../model/userModel.js";


/* ===========================================================
                    CREATE COURSE
=========================================================== */

export const createCourse = async (req, res) => {

  try {

    let { title, category } = req.body;


    if (!title || !category) {

      return res.status(400).json({
        success:false,
        message:"Title and category are required."
      });

    }


    title = title.trim();
    category = category.trim();


    let thumbnail = "";


    if(req.file){

      const thumbnailUrl = await uploadOnCloudinary(
        req.file.path
      );


      if(!thumbnailUrl){

        return res.status(500).json({
          success:false,
          message:"Thumbnail upload failed."
        });

      }


      thumbnail = thumbnailUrl;

    }



    const course = await Course.create({

      title,

      category,

      thumbnail,

      creator:req.userId

    });



    return res.status(201).json({

      success:true,

      message:"Course created successfully.",

      course

    });


  } catch(error){


    console.error(
      "Create Course Error:",
      error
    );


    return res.status(500).json({

      success:false,

      message:error.message

    });

  }

};




/* ===========================================================
                GET ALL PUBLISHED COURSES
=========================================================== */

export const getPublishedCourses = async(req,res)=>{

  try{


    const courses = await Course.find({
      isPublished:true
    })
    .populate(
      "lectures reviews"
    )
    .populate(
      "creator",
      "name email photoUrl"
    )
    .sort({
      createdAt:-1
    });



    return res.status(200).json({

      success:true,

      totalCourses:courses.length,

      courses

    });



  }catch(error){


    console.error(
      "Get Published Courses Error:",
      error
    );


    return res.status(500).json({

      success:false,

      message:error.message

    });


  }

};





/* ===========================================================
                GET CREATOR COURSES
=========================================================== */


export const getCreatorCourses = async(req,res)=>{

  try{


    const courses = await Course.find({

      creator:req.userId

    })
    .populate("lectures")
    .sort({
      createdAt:-1
    });



    return res.status(200).json({

      success:true,

      totalCourses:courses.length,

      courses

    });



  }catch(error){


    console.error(
      "Creator Course Error:",
      error
    );


    return res.status(500).json({

      success:false,

      message:error.message

    });


  }

};





/* ===========================================================
                    EDIT COURSE
=========================================================== */


export const editCourse = async(req,res)=>{


try{


const {courseId}=req.params;


const course = await Course.findById(courseId);


if(!course){

return res.status(404).json({

success:false,

message:"Course not found."

});

}



if(course.creator.toString() !== req.userId){

return res.status(403).json({

success:false,

message:"Not authorized."

});

}



const {
title,
subTitle,
description,
category,
level,
price,
isPublished
}=req.body;



if(title)
course.title=title.trim();


if(subTitle)
course.subTitle=subTitle.trim();


if(description)
course.description=description.trim();


if(category)
course.category=category.trim();


if(level)
course.level=level;


if(price!==undefined)
course.price=Number(price);



if(isPublished!==undefined)
course.isPublished=isPublished;



if(req.file){

const thumbnailUrl =
await uploadOnCloudinary(req.file.path);


if(!thumbnailUrl){

return res.status(500).json({

success:false,

message:"Thumbnail upload failed."

});

}


course.thumbnail=thumbnailUrl;

}



await course.save();



return res.status(200).json({

success:true,

message:"Course updated successfully.",

course

});



}catch(error){


console.log(error);


return res.status(500).json({

success:false,

message:error.message

});


}


};





/* ===========================================================
                    GET COURSE BY ID
=========================================================== */


export const getCourseById = async(req,res)=>{

try{


const {courseId}=req.params;


const course = await Course.findById(courseId)

.populate("lectures")

.populate(
"creator",
"name description email photoUrl"
);



if(!course){

return res.status(404).json({

success:false,

message:"Course not found."

});

}



return res.status(200).json({

success:true,

course

});


}catch(error){


return res.status(500).json({

success:false,

message:error.message

});


}


};





/* ===========================================================
                    REMOVE COURSE
=========================================================== */


export const removeCourse = async(req,res)=>{

try{


const {courseId}=req.params;


const course =
await Course.findById(courseId);



if(!course){

return res.status(404).json({

success:false,

message:"Course not found."

});

}



if(course.creator.toString()!==req.userId){

return res.status(403).json({

success:false,

message:"Not authorized."

});

}



await Lecture.deleteMany({

course:course._id

});



await User.updateMany(

{
enrolledCourses:course._id
},

{
$pull:{
enrolledCourses:course._id
}
}

);



await course.deleteOne();



return res.status(200).json({

success:true,

message:"Course deleted successfully."

});



}catch(error){


return res.status(500).json({

success:false,

message:error.message

});


}


};





/* ===========================================================
                    CREATE LECTURE
=========================================================== */


export const createLecture = async(req,res)=>{


try{


const {courseId}=req.params;


let {lectureTitle}=req.body;



if(!lectureTitle){

return res.status(400).json({

success:false,

message:"Lecture title required."

});

}



const course =
await Course.findById(courseId);



if(!course){

return res.status(404).json({

success:false,

message:"Course not found."

});

}



if(course.creator.toString()!==req.userId){

return res.status(403).json({

success:false,

message:"Not authorized."

});

}



const lecture =
await Lecture.create({

lectureTitle:lectureTitle.trim(),

course:course._id,

creator:req.userId

});



course.lectures.push(
lecture._id
);


await course.save();



return res.status(201).json({

success:true,

message:"Lecture created successfully.",

lecture

});



}catch(error){


return res.status(500).json({

success:false,

message:error.message

});


}


};





/* ===========================================================
                GET COURSE LECTURES
=========================================================== */


export const getCourseLecture = async(req,res)=>{


try{


const {courseId}=req.params;



const course =
await Course.findById(courseId)
.populate({

path:"lectures",

options:{
sort:{
createdAt:1
}
}

});



if(!course){

return res.status(404).json({

success:false,

message:"Course not found."

});

}



return res.status(200).json({

success:true,

lectures:course.lectures

});



}catch(error){


return res.status(500).json({

success:false,

message:error.message

});


}


};





/* ===========================================================
                    EDIT LECTURE
=========================================================== */


export const editLecture = async(req,res)=>{

try{


const {lectureId}=req.params;


const lecture =
await Lecture.findById(lectureId);



if(!lecture){

return res.status(404).json({

success:false,

message:"Lecture not found."

});

}



if(req.body.lectureTitle){

lecture.lectureTitle =
req.body.lectureTitle.trim();

}



if(req.body.isPreviewFree!==undefined){

lecture.isPreviewFree =
req.body.isPreviewFree;

}



if(req.file){

const videoUrl =
await uploadOnCloudinary(
req.file.path
);


lecture.videoUrl=videoUrl;

}



await lecture.save();



return res.status(200).json({

success:true,

message:"Lecture updated successfully.",

lecture

});


}catch(error){


return res.status(500).json({

success:false,

message:error.message

});


}

};





/* ===========================================================
                    REMOVE LECTURE
=========================================================== */


export const removeLecture = async(req,res)=>{


try{


const {lectureId}=req.params;



const lecture =
await Lecture.findById(lectureId);



if(!lecture){

return res.status(404).json({

success:false,

message:"Lecture not found."

});

}



const course =
await Course.findOne({

lectures:lectureId

});



course.lectures.pull(
lectureId
);


await course.save();


await lecture.deleteOne();



return res.status(200).json({

success:true,

message:"Lecture deleted successfully."

});


}catch(error){


return res.status(500).json({

success:false,

message:error.message

});


}


};





/* ===========================================================
                    GET CREATOR DETAILS
=========================================================== */


export const getCreatorById = async(req,res)=>{


try{


const {userId}=req.params;



const creator =
await User.findById(userId)
.select("-password -resetOtp -otpExpires -isOtpVerified");



if(!creator){

return res.status(404).json({

success:false,

message:"Creator not found."

});

}



return res.status(200).json({

success:true,

creator

});



}catch(error){


return res.status(500).json({

success:false,

message:error.message

});


}


};