import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
{
    name:{
        type:String,
        required:[true,"Name is required"],
        trim:true,
        minlength:2,
        maxlength:50
    },


    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        lowercase:true,
        trim:true
    },


    password:{
        type:String,
        required:function(){
            return !this.googleId;
        },
        minlength:8,
        select:false
    },


    googleId:{
        type:String,
        default:null,
        unique:true,
        sparse:true
    },


    description:{
        type:String,
        default:"",
        maxlength:500,
        trim:true
    },


    role:{
        type:String,
        enum:[
            "student",
            "educator"
        ],
        default:"student",
        required:true
    },


    photoUrl:{
        type:String,
        default:""
    },


    enrolledCourses:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Course"
        }
    ],


    resetOtp:{
        type:String,
        default:null
    },


    otpExpires:{
        type:Date,
        default:null
    },


    isOtpVerified:{
        type:Boolean,
        default:false
    }

},
{
    timestamps:true
});




// Remove sensitive data before sending response

userSchema.methods.toJSON=function(){

    const user=this.toObject();


    delete user.password;
    delete user.resetOtp;
    delete user.otpExpires;
    delete user.isOtpVerified;


    return user;

};



const User = mongoose.model(
    "User",
    userSchema
);


export default User;