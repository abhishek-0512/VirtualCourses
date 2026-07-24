import express from "express";
import upload from "../middleware/multer.js";
import isAuth from "../middleware/isAuth.js";
import isEducator from "../middleware/isEducator.js";

import {
  createCourse,
  editCourse,
  getPublishedCourses,
  getCreatorCourses,
  getCourseById,
  removeCourse,
  getCreatorById,
} from "../controller/courseController.js";

const router = express.Router();

/* ==========================================
            PUBLIC ROUTES
========================================== */

// Get all published courses
router.get("/published", getPublishedCourses);

/* ==========================================
            EDUCATOR ROUTES
========================================== */

// Create Course
router.post(
  "/create",
  isAuth,
  isEducator,
  upload.single("thumbnail"),
  createCourse
);

// Get Logged-in Educator Courses
// IMPORTANT: Keep this BEFORE /creator/:userId
router.get(
  "/creator/courses",
  isAuth,
  isEducator,
  getCreatorCourses
);

/* ==========================================
            PUBLIC ROUTES
========================================== */

// Get creator profile
router.get(
  "/creator/:userId",
  getCreatorById
);

// Update Course
router.put(
  "/:courseId",
  isAuth,
  isEducator,
  upload.single("thumbnail"),
  editCourse
);

// Delete Course
router.delete(
  "/:courseId",
  isAuth,
  isEducator,
  removeCourse
);

// Get Course By ID
// KEEP THIS LAST
router.get(
  "/:courseId",
  getCourseById
);

export default router;