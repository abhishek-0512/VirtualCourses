import express from "express";

import isAuth from "../middleware/isAuth.js";
import isEducator from "../middleware/isEducator.js";

import {
    createCourse,
    createLecture,
    editCourse,
    editLecture,
    getCourseById,
    getCourseLecture,
    getCreatorById,
    getCreatorCourses,
    getPublishedCourses,
    removeCourse,
    removeLecture
} from "../controller/courseController.js";

import upload from "../middleware/multer.js";


const courseRouter = express.Router();



// ================= PUBLIC =================


courseRouter.get(
    "/getpublishedcourses",
    getPublishedCourses
);



courseRouter.get(
    "/getcourse/:courseId",
    getCourseById
);



// ================= COURSE =================


courseRouter.post(
    "/create",
    isAuth,
    isEducator,
    upload.single("thumbnail"),
    createCourse
);



courseRouter.get(
    "/getcreatorcourses",
    isAuth,
    isEducator,
    getCreatorCourses
);



courseRouter.put(
    "/editcourse/:courseId",
    isAuth,
    isEducator,
    upload.single("thumbnail"),
    editCourse
);



courseRouter.delete(
    "/removecourse/:courseId",
    isAuth,
    isEducator,
    removeCourse
);



// ================= LECTURES =================


courseRouter.post(
    "/createlecture/:courseId",
    isAuth,
    isEducator,
    createLecture
);



courseRouter.get(
    "/getcourselecture/:courseId",
    getCourseLecture
);



courseRouter.put(
    "/editlecture/:lectureId",
    isAuth,
    isEducator,
    upload.single("video"),
    editLecture
);



courseRouter.delete(
    "/removelecture/:lectureId",
    isAuth,
    isEducator,
    removeLecture
);



// ================= CREATOR =================


courseRouter.get(
    "/getcreator/:userId",
    getCreatorById
);



export default courseRouter;