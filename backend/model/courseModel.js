import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subTitle: { type: String, default: "" },
    description: { type: String, default: "" },
    category: { type: String, default: "Others" },
    level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
    price: { type: Number, default: 0 },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    lectures: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lecture" }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    thumbnail: { type: String, default: "" },
    isPublished: { type: Boolean, default: false },
    enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);
export default Course;