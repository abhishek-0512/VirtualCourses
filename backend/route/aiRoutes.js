import express from "express";
import isAuth from "../middleware/isAuth.js";
import {
  searchWithAi,
  askLectureAi,
  generateLectureQuiz,
} from "../controller/aiController.js";

const aiRouter = express.Router();

// 1. Course Search with AI
aiRouter.post("/search", isAuth, searchWithAi);

// 2. In-Lesson AI Voice/Text Tutor
aiRouter.post("/ask-lecture", isAuth, askLectureAi);

// 3. AI Quiz Generator
aiRouter.post("/generate-quiz", isAuth, generateLectureQuiz);

export default aiRouter;