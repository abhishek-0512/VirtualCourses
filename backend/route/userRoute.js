import express from "express";
import isAuth from "../middleware/isAuth.js";
import { getCurrentUser, UpdateProfile } from "../controller/userController.js";
import upload from "../middleware/multer.js";

const userRouter = express.Router();

// Get logged in user details
userRouter.get(
    "/currentuser",
    isAuth,
    getCurrentUser
);

// Alternative path alias if requested by profile views
userRouter.get(
    "/profile",
    isAuth,
    getCurrentUser
);

// Update profile (supports file upload field 'photo' or 'photoUrl')
userRouter.put(
    "/updateprofile",
    isAuth,
    upload.single("photo"),
    UpdateProfile
);

export default userRouter;