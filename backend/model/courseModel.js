import mongoose from "mongoose";


const courseSchema = new mongoose.Schema(

{

    title:{
        type:String,
        required:true,
        trim:true,
        maxlength:100
    },


    subTitle:{
        type:String,
        default:"",
        trim:true
    },


    description:{
        type:String,
        default:"",
        trim:true
    },


    category:{
        type:String,
        enum:[
            "Web Development",
            "Data Science",
            "AI",
            "Mobile Development",
            "Programming",
            "App Development",
            "AI/ML",
            "AI Tools",
            "Data Analytics",
            "Ethical Hacking",
            "UI UX Designing",
            "Others"
        ],
        default:"Others"
    },


    level:{
        type:String,
        enum:[
            "Beginner",
            "Intermediate",
            "Advanced"
        ],
        default:"Beginner"
    },


    price:{
        type:Number,
        default:0,
        min:0
    },


    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },


    lectures:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Lecture"
        }
    ],


    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review"
        }
    ],


    thumbnail:{
        type:String,
        default:""
    },


    isPublished:{
        type:Boolean,
        default:false
    },


    enrolledStudents:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],


    totalLectures:{
        type:Number,
        default:0
    },


    averageRating:{
        type:Number,
        default:0
    },


    totalReviews:{
        type:Number,
        default:0
    },


    slug:{
        type:String,
        unique:true,
        sparse:true
    }

},

{
    timestamps:true
}

);



// Create slug automatically

courseSchema.pre(
    "save",
    function(next){

        if(this.isModified("title")){

            this.slug = this.title
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9]+/g,"-")
                .replace(/^-+|-+$/g,"");

        }

        next();

    }
);



// Search optimization

courseSchema.index({
    title:"text",
    description:"text"
});



const Course = mongoose.model(
    "Course",
    courseSchema
);


export default Course;