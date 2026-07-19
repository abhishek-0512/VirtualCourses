import mongoose from "mongoose";


const lectureSchema = new mongoose.Schema(

{

    lectureTitle:{
        type:String,
        required:true,
        trim:true,
        maxlength:100
    },


    description:{
        type:String,
        default:"",
        trim:true
    },


    videoUrl:{
        type:String,
        default:""
    },


    duration:{
        type:Number,
        default:0
    },


    order:{
        type:Number,
        default:0
    },


    isPreviewFree:{
        type:Boolean,
        default:false
    },


    resources:[
        {
            title:{
                type:String
            },

            url:{
                type:String
            }
        }
    ],


    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
        required:true
    },


    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }

},

{
    timestamps:true
}

);



// Faster lecture fetching
lectureSchema.index({
    course:1,
    order:1
});


const Lecture = mongoose.model(
    "Lecture",
    lectureSchema
);


export default Lecture;