import express from "express";
import isAuth from "../middleware/isAuth.js";
import { getCurrentUser, UpdateProfile } from "../controller/userController.js";
import upload from "../middleware/multer.js";


const userRouter = express.Router();


// Get logged in user
userRouter.get(
    "/currentuser",
    isAuth,
    getCurrentUser
);


// Update profile
userRouter.put(
    "/updateprofile",
    isAuth,
    upload.single("photo"),
    UpdateProfile
);


export default userRouter;