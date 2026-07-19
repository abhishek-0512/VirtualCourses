import express from "express";

import isAuth from "../middleware/isAuth.js";

import {
    addReview,
    getAllReviews,
    getCourseReviews
} from "../controller/reviewController.js";


const reviewRouter = express.Router();



// Add review
reviewRouter.post(
    "/add",
    isAuth,
    addReview
);



// Get reviews of a course
reviewRouter.get(
    "/course/:courseId",
    getCourseReviews
);



// Get all reviews
reviewRouter.get(
    "/all",
    getAllReviews
);



export default reviewRouter;