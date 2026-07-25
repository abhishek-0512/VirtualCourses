import express from "express";
import isAuth from "../middleware/isAuth.js";
import {
    addReview,
    getAllReviews,
    getCourseReviews
} from "../controller/reviewController.js";

const reviewRouter = express.Router();

// Add review
reviewRouter.post("/add", isAuth, addReview);

// Get reviews of a course
reviewRouter.get("/course/:courseId", getCourseReviews);

// Get all reviews (aliased for /all, /getall, and /allreviews)
reviewRouter.get("/all", getAllReviews);
reviewRouter.get("/getall", getAllReviews);
reviewRouter.get("/allreviews", getAllReviews);

export default reviewRouter;