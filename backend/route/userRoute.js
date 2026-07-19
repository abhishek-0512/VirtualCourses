import express from "express"
import isAuth from "../middleware/isAuth.js"
import { getCurrentUser, UpdateProfile } from "../controller/userController.js"
import upload from "../middleware/multer.js"



let userRouter = express.Router()

userRouter.get("/currentuser",isAuth,getCurrentUser)
userRouter.post("/updateprofile",isAuth,upload.single("photoUrl"),UpdateProfile)


export default userRouter