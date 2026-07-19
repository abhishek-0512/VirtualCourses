import Review from "../model/reviewModel.js";
import Course from "../model/courseModel.js";



// ==========================================
// ADD REVIEW
// ==========================================

export const addReview = async(req,res)=>{

    try{


        const {
            rating,
            comment,
            courseId
        } = req.body;


        const userId = req.userId;



        if(!rating || rating < 1 || rating > 5){

            return res.status(400).json({

                success:false,
                message:"Rating must be between 1 and 5"

            });

        }



        const course = await Course.findById(courseId);



        if(!course){

            return res.status(404).json({

                success:false,
                message:"Course not found"

            });

        }



        const alreadyReviewed = await Review.findOne({

            course:courseId,
            user:userId

        });



        if(alreadyReviewed){

            return res.status(400).json({

                success:false,
                message:"You already reviewed this course"

            });

        }




        const review = await Review.create({

            course:courseId,
            user:userId,
            rating,
            comment

        });



        course.reviews.push(review._id);



        course.totalReviews = course.reviews.length;



        const allReviews = await Review.find({

            course:courseId

        });



        const totalRating = allReviews.reduce(
            (sum,item)=>sum + item.rating,
            0
        );



        course.averageRating =
            totalRating / allReviews.length;



        await course.save();



        return res.status(201).json({

            success:true,
            message:"Review added successfully",
            review

        });



    }
    catch(error){

        console.log(
            "Add Review Error:",
            error
        );


        return res.status(500).json({

            success:false,
            message:"Server error"

        });

    }

};





// ==========================================
// GET COURSE REVIEWS
// ==========================================

export const getCourseReviews = async(req,res)=>{

    try{


        const {courseId}=req.params;



        const reviews = await Review.find({

            course:courseId

        })
        .populate(
            "user",
            "name photoUrl"
        )
        .sort({
            createdAt:-1
        });



        return res.status(200).json({

            success:true,
            reviews

        });



    }
    catch(error){


        return res.status(500).json({

            success:false,
            message:"Error fetching reviews"

        });

    }

};





// ==========================================
// GET ALL REVIEWS
// ==========================================

export const getAllReviews = async(req,res)=>{

    try{


        const reviews = await Review.find({})

        .populate(
            "user",
            "name photoUrl role"
        )

        .populate(
            "course",
            "title thumbnail"
        )

        .sort({
            createdAt:-1
        });



        return res.status(200).json({

            success:true,
            reviews

        });



    }
    catch(error){


        console.log(error);


        return res.status(500).json({

            success:false,
            message:"Failed to fetch reviews"

        });

    }

};