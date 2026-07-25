import express from "express";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";
import {
  createCourse,
  getPublishedCourses,
  getCreatorCourses,
  getCourseById,
  editCourse,
  removeCourse,
  getCreatorById,
  toggleLectureCompletion,
} from "../controller/courseController.js";

const courseRouter = express.Router();

// 1. Static and Specific Routes First (Prevents parameter capturing errors)
courseRouter.post("/create", isAuth, upload.single("thumbnail"), createCourse);
courseRouter.get("/published", getPublishedCourses);
courseRouter.get("/creator-courses", isAuth, getCreatorCourses);
courseRouter.post("/toggle-complete", isAuth, toggleLectureCompletion);

// 2. Creator Specific Profile Route
courseRouter.get("/creator/profile/:userId", getCreatorById);

// 3. Dynamic Course Parameter Routes Last
courseRouter.get("/:courseId", isAuth, getCourseById);
courseRouter.put("/edit/:courseId", isAuth, upload.single("thumbnail"), editCourse);
courseRouter.delete("/remove/:courseId", isAuth, removeCourse);

export default courseRouter;