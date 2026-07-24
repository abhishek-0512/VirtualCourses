import express from "express";
import rateLimit from "express-rate-limit";

import {
    googleSignup,
    login,
    logOut,
    signUp,
    getCurrentUser
} from "../controller/authController.js";

import isAuth from "../middleware/isAuth.js";

const authRouter = express.Router();

/* ==========================================
            RATE LIMITER
========================================== */

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many authentication requests. Try again later."
    }
});

/* ==========================================
              AUTH ROUTES
========================================== */

authRouter.post(
    "/signup",
    authLimiter,
    signUp
);

authRouter.post(
    "/login",
    authLimiter,
    login
);

authRouter.post(
    "/googlesignup",
    authLimiter,
    googleSignup
);

/* ==========================================
            CURRENT USER
========================================== */

authRouter.get(
    "/current",
    isAuth,
    getCurrentUser
);

authRouter.get(
    "/logout",
    isAuth,
    logOut
);

export default authRouter;