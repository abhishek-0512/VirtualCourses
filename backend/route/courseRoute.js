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

router.get("/published", getPublishedCourses);

router.get("/:courseId", getCourseById);

router.get("/creator/:userId", getCreatorById);

/* ==========================================
            EDUCATOR ROUTES
========================================== */

router.post(
  "/create",
  isAuth,
  isEducator,
  upload.single("thumbnail"),
  createCourse
);

router.get(
  "/creator/courses",
  isAuth,
  isEducator,
  getCreatorCourses
);

router.put(
  "/:courseId",
  isAuth,
  isEducator,
  upload.single("thumbnail"),
  editCourse
);

router.delete(
  "/:courseId",
  isAuth,
  isEducator,
  removeCourse
);

export default router;