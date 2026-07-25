import { GoogleGenAI } from "@google/genai";
import Course from "../model/courseModel.js";

// Safe API Client Initialization
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ GEMINI_API_KEY is missing in backend .env file!");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

// ================= 1. AI COURSE SEARCH =================
export const searchWithAi = async (req, res) => {
  try {
    const input = req.body.input || req.body.query || req.body.prompt;

    if (!input || !input.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const safeInput = input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const CATEGORY_KEYWORDS = [
      "App Development",
      "AI/ML",
      "AI Tools",
      "Data Science",
      "Data Analytics",
      "Ethical Hacking",
      "UI UX Designing",
      "Web Development",
      "Others",
      "Beginner",
      "Intermediate",
      "Advanced",
    ];

    let keyword = input;

    try {
      const ai = getAiClient();
      if (ai) {
        const promptText = `You are an LMS search assistant. Return ONLY one keyword from this list: ${CATEGORY_KEYWORDS.join(
          ", "
        )}. User query: ${input}`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: promptText,
        });

        if (response && response.text) {
          keyword = response.text.trim();
        }
      }
    } catch (error) {
      console.log("Gemini categorization fallback to regex:", error.message);
    }

    const courses = await Course.find({
      isPublished: true,
      $or: [
        { title: { $regex: safeInput, $options: "i" } },
        { courseTitle: { $regex: safeInput, $options: "i" } },
        { category: { $regex: keyword, $options: "i" } },
        { level: { $regex: keyword, $options: "i" } },
        { subTitle: { $regex: safeInput, $options: "i" } },
      ],
    }).populate("creator", "name photoUrl");

    const aiMessage =
      courses.length > 0
        ? `I analyzed your request for "${input}". Here are the matching courses found:`
        : `No exact matches found for "${input}". Try searching for categories like Web Development or Data Science!`;

    return res.status(200).json({
      success: true,
      message: aiMessage,
      aiResponse: aiMessage,
      courses,
      matchedCourses: courses,
    });
  } catch (error) {
    console.error("AI Search Error:", error);
    return res.status(500).json({
      success: false,
      message: "AI search service error",
    });
  }
};

// ================= 2. ASK AI TUTOR ABOUT LECTURE =================
export const askLectureAi = async (req, res) => {
  try {
    const { question, lectureTitle, lectureDescription, courseTitle } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    const ai = getAiClient();
    if (!ai) {
      return res.status(200).json({
        success: true,
        answer: "Gemini API key is not configured in backend .env file.",
      });
    }

    const promptText = `
You are an expert AI tutor assisting a student in an online course.

Course Title: ${courseTitle || "General Course"}
Lesson Title: ${lectureTitle || "Current Lesson"}
Lesson Description: ${lectureDescription || "No description provided"}

Student Question:
"${question}"

Provide a clear, concise, and helpful response. If code is relevant, format it cleanly.
`;

    let responseText = "";

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: promptText,
      });
      responseText = response?.text;
    } catch (modelErr) {
      console.warn("gemini-2.5-flash failed, trying gemini-1.5-flash:", modelErr.message);
      try {
        const fallbackResponse = await ai.models.generateContent({
          model: "gemini-1.5-flash",
          contents: promptText,
        });
        responseText = fallbackResponse?.text;
      } catch (e) {
        responseText = `In this lesson (${lectureTitle || "Current Lesson"}), focusing on core concepts step-by-step is key. What specific part would you like help with?`;
      }
    }

    return res.status(200).json({
      success: true,
      answer: responseText || "I couldn't generate an answer right now.",
    });
  } catch (error) {
    console.error("Ask AI Tutor Error:", error);
    return res.status(200).json({
      success: true,
      answer: "I am having trouble connecting to Gemini right now. Please try again in a moment!",
    });
  }
};

// ================= 3. GENERATE AI QUIZ =================
export const generateLectureQuiz = async (req, res) => {
  try {
    const { lectureTitle, lectureDescription, courseTitle } = req.body;

    const fallbackQuiz = [
      {
        question: `What is the primary objective of ${lectureTitle || "this lesson"}?`,
        options: [
          "Understanding core principles and syntax",
          "Ignoring security standard practices",
          "Writing unmaintainable software",
          "Skipping basic testing procedures",
        ],
        correctIndex: 0,
        explanation: "Mastering core principles ensures robust software design.",
      },
      {
        question: "Which approach is recommended when tackling complex code problems?",
        options: [
          "Breaking down the problem step-by-step",
          "Guessing solution patterns randomly",
          "Avoiding documentation completely",
          "Ignoring error messages",
        ],
        correctIndex: 0,
        explanation: "Modular problem solving allows easier debugging.",
      },
      {
        question: "Why are structured lessons valuable in a software course?",
        options: [
          "They build knowledge progressively from basic to advanced",
          "They eliminate the need for practice",
          "They restrict creative coding",
          "They replace practical implementation",
        ],
        correctIndex: 0,
        explanation: "Progressive learning builds solid foundational skills.",
      },
    ];

    const ai = getAiClient();
    if (!ai) {
      return res.status(200).json({
        success: true,
        quiz: fallbackQuiz,
      });
    }

    const promptText = `
Create a 3-question multiple-choice quiz based on this lesson:
Course: ${courseTitle || "General Course"}
Lesson: ${lectureTitle || "Current Lesson"}
Description: ${lectureDescription || "Lesson overview"}

Return ONLY raw JSON with no markdown syntax (\`\`\`json), no trailing commas, and no intro text.
JSON Structure:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Brief explanation."
  }
]
`;

    let rawText = "";

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: promptText,
      });
      rawText = response?.text || "";
    } catch (err) {
      console.warn("gemini-2.5-flash failed for quiz, trying gemini-1.5-flash:", err.message);
      try {
        const fallbackRes = await ai.models.generateContent({
          model: "gemini-1.5-flash",
          contents: promptText,
        });
        rawText = fallbackRes?.text || "";
      } catch (err2) {
        console.error("Gemini model execution failed:", err2.message);
      }
    }

    const cleanedText = rawText.replace(/```json|```/gi, "").trim();

    let quizData = fallbackQuiz;
    if (cleanedText) {
      try {
        const parsed = JSON.parse(cleanedText);
        if (Array.isArray(parsed) && parsed.length > 0) {
          quizData = parsed;
        }
      } catch (parseErr) {
        console.error("Quiz JSON Parse error, using fallback quiz:", parseErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      quiz: quizData,
    });
  } catch (error) {
    console.error("Quiz Generator Error:", error);
    return res.status(200).json({
      success: true,
      quiz: [
        {
          question: "What is the key focus of this lesson?",
          options: [
            "Understanding fundamental principles",
            "Skipping code architecture",
            "Ignoring runtime errors",
            "Overcomplicating setup",
          ],
          correctIndex: 0,
          explanation: "Focusing on fundamentals ensures long-term mastery.",
        },
      ],
    });
  }
};