import express from "express"
import isAuth from "../middleware/isAuth.js"
import { addReview, getAllReviews } from "../controller/reviewController.js"



let reviewRouter = express.Router()

reviewRouter.post("/givereview",isAuth,addReview)
reviewRouter.get("/allReview",getAllReviews)


export default reviewRouter