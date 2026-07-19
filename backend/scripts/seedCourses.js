import dotenv from "dotenv";
import mongoose from "mongoose";
import Course from "../model/courseModel.js";

dotenv.config();

const sampleCourses = [
  {
    title: "Full Stack Web Development",
    subTitle: "Build modern web apps from scratch",
    description: "Learn frontend, backend, databases, and deployment with a hands-on full-stack curriculum.",
    category: "Web Development",
    level: "Beginner",
    price: 1999,
    isPublished: true,
    thumbnail: "",
  },
  {
    title: "AI and Machine Learning Essentials",
    subTitle: "From basics to implementation",
    description: "Explore AI concepts, Python, neural networks, and practical ML projects.",
    category: "AI/ML",
    level: "Intermediate",
    price: 2499,
    isPublished: true,
    thumbnail: "",
  },
  {
    title: "UI/UX Design for Modern Products",
    subTitle: "Design user-centered experiences",
    description: "Master wireframes, prototypes, usability testing, and design systems.",
    category: "UI UX Designing",
    level: "Beginner",
    price: 1499,
    isPublished: true,
    thumbnail: "",
  },
  {
    title: "Data Science with Python",
    subTitle: "Analyze data and build insights",
    description: "Learn Python, statistics, visualization, and predictive modeling with real datasets.",
    category: "Data Science",
    level: "Intermediate",
    price: 2299,
    isPublished: true,
    thumbnail: "",
  },
];

async function seedCourses() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    const existing = await Course.countDocuments({ isPublished: true });

    if (existing > 0) {
      console.log(`Courses already exist (${existing}). No seed needed.`);
      process.exit(0);
    }

    await Course.insertMany(sampleCourses);
    console.log("Seeded sample courses successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed courses:", error);
    process.exit(1);
  }
}

seedCourses();
