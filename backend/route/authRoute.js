import express from "express";
import {
  signUp,
  login,
  googleAuth,
  getCurrentUser,
  logOut,
} from "../controller/authController.js";
import isAuth from "../middleware/isAuth.js";

const authRouter = express.Router();

/* ==========================================
              AUTH ROUTES
========================================== */

// Signup & Login
authRouter.post("/signup", signUp);
authRouter.post("/login", login);
authRouter.post("/googlesignup", googleAuth);

// Session & Profile
authRouter.get("/current", isAuth, getCurrentUser);
authRouter.get("/logout", logOut);

export default authRouter;