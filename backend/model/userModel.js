import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {

    name: {
      type: String,
      required: true,
      trim: true
    },


    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },


    password: {
      type: String,
      required: function(){
        return !this.googleId;
      }
    },


    googleId: {
      type: String,
      default: ""
    },


    description: {
      type: String,
      default: ""
    },


    role: {
      type: String,
      enum: ["educator", "student"],
      required: true
    },


    photoUrl: {
      type: String,
      default: ""
    },


    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
      }
    ],


    resetOtp: {
      type: String,
      default: undefined
    },


    otpExpires: {
      type: Date,
      default: undefined
    },


    isOtpVerified: {
      type: Boolean,
      default: false
    }

  },

  {
    timestamps: true
  }

);


const User = mongoose.model("User", userSchema);


export default User;