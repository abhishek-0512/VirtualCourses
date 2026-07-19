import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import Course from "../model/courseModel.js";
dotenv.config();


export const searchWithAi = async (req,res) => {

    try {
         const { input } = req.body;
     
    if (!input) {
      return res.status(400).json({ message: "Search query is required" });
    }
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

      function heuristicKeyword(input) {
        if (!input) return "";
        const lower = input.toLowerCase();
        // Look for direct matches
        for (const k of CATEGORY_KEYWORDS) {
          const lk = k.toLowerCase();
          if (lower.includes(lk.split(" ")[0])) return k; // match first word
        }
        // fallback: return the input (will be used as regex)
        return input;
      }

      let keyword = null;

      // Try using Google GenAI if available, otherwise fall back to heuristic
      try {
        const ai = new GoogleGenAI({});
        const prompt = `You are an intelligent assistant for an LMS platform. A user will type any query about what they want to learn. Your task is to understand the intent and return one most relevant keyword from the following list of course categories and levels: ${CATEGORY_KEYWORDS.join(", ")}. Only reply with one single keyword from the list above that best matches the query. No extra text. Query: ${input}`;

        const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
        keyword = (response?.text || "").trim();
      } catch (err) {
        console.warn("GoogleGenAI unavailable or failed, falling back to local heuristic:", err?.message || err);
        keyword = heuristicKeyword(input);
      }

      // First try direct match using user input
      const directMatches = await Course.find({
        isPublished: true,
        $or: [
          { title: { $regex: input, $options: "i" } },
          { subTitle: { $regex: input, $options: "i" } },
          { description: { $regex: input, $options: "i" } },
          { category: { $regex: input, $options: "i" } },
          { level: { $regex: input, $options: "i" } },
        ],
      });

      if (directMatches && directMatches.length > 0) {
        return res.status(200).json(directMatches);
      }

      // If no direct matches, try using the keyword (from AI or heuristic)
      const keywordRegex = keyword || input;
      const fallbackMatches = await Course.find({
        isPublished: true,
        $or: [
          { title: { $regex: keywordRegex, $options: "i" } },
          { subTitle: { $regex: keywordRegex, $options: "i" } },
          { description: { $regex: keywordRegex, $options: "i" } },
          { category: { $regex: keywordRegex, $options: "i" } },
          { level: { $regex: keywordRegex, $options: "i" } },
        ],
      });

      return res.status(200).json(fallbackMatches || []);
    } catch (error) {
      console.error("AI search error:", error);
      return res.status(500).json({ message: "AI search failed" });
    }
}