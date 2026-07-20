import express from "express";
import upload from "../middleware/multer.js";
import isAuth from "../middleware/isAuth.js";
import isEducator from "../middleware/isEducator.js";

import {
  createLecture,
  getCourseLectures,
  getLectureById,
  updateLecture,
  deleteLecture,
} from "../controller/lectureController.js";

const lectureRouter = express.Router();

/* ===========================================================
                    CREATE LECTURE
=========================================================== */

lectureRouter.post(
  "/course/:courseId",
  isAuth,
  isEducator,
  createLecture
);

/* ===========================================================
                GET ALL LECTURES OF A COURSE
=========================================================== */

lectureRouter.get(
  "/course/:courseId",
  getCourseLectures
);

/* ===========================================================
                GET SINGLE LECTURE
=========================================================== */

lectureRouter.get(
  "/:lectureId",
  getLectureById
);

/* ===========================================================
                UPDATE LECTURE
=========================================================== */

lectureRouter.put(
  "/:lectureId",
  isAuth,
  isEducator,
  upload.single("video"),
  updateLecture
);

/* ===========================================================
                DELETE LECTURE
=========================================================== */

lectureRouter.delete(
  "/:lectureId",
  isAuth,
  isEducator,
  deleteLecture
);

export default lectureRouter;