import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    lectureTitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    // Cloudinary Video URL
    videoUrl: {
      type: String,
      default: "",
    },

    // Cloudinary Public ID
    videoPublicId: {
      type: String,
      default: "",
    },

    // Duration in seconds
    duration: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Lecture Order
    order: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Preview without enrollment
    isPreviewFree: {
      type: Boolean,
      default: false,
    },

    // Downloadable Resources
    resources: [
      {
        title: {
          type: String,
          trim: true,
        },

        url: {
          type: String,
          trim: true,
        },
      },
    ],

    // Parent Course
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    // Educator
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

/* ===========================================================
        UNIQUE LECTURE ORDER INSIDE A COURSE
=========================================================== */

lectureSchema.index(
  {
    course: 1,
    order: 1,
  },
  {
    unique: true,
  }
);

const Lecture = mongoose.model("Lecture", lectureSchema);

export default Lecture;