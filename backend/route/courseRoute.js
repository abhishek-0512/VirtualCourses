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



// ================= PUBLIC ROUTES =================


// All published courses
courseRouter.get(
    "/getpublishedcourses",
    getPublishedCourses
);


// Single course details
courseRouter.get(
    "/getcourse/:courseId",
    getCourseById
);




// ================= EDUCATOR ROUTES =================


// Create course
courseRouter.post(
    "/create",
    isAuth,
    isEducator,
    upload.single("thumbnail"),
    createCourse
);



// Get educator courses
courseRouter.get(
    "/getcreatorcourses",
    isAuth,
    isEducator,
    getCreatorCourses
);



// Edit course
courseRouter.post(
    "/editcourse/:courseId",
    isAuth,
    isEducator,
    upload.single("thumbnail"),
    editCourse
);



// Delete course
courseRouter.delete(
    "/removecourse/:courseId",
    isAuth,
    isEducator,
    removeCourse
);




// ================= LECTURE ROUTES =================



// Create lecture
courseRouter.post(
    "/createlecture/:courseId",
    isAuth,
    isEducator,
    createLecture
);



// Get course lectures
courseRouter.get(
    "/getcourselecture/:courseId",
    getCourseLecture
);



// Edit lecture
courseRouter.post(
    "/editlecture/:lectureId",
    isAuth,
    isEducator,
    upload.single("videoUrl"),
    editLecture
);



// Delete lecture
courseRouter.delete(
    "/removelecture/:lectureId",
    isAuth,
    isEducator,
    removeLecture
);




// ================= CREATOR =================


courseRouter.post(
    "/getcreator",
    isAuth,
    getCreatorById
);



export default courseRouter;