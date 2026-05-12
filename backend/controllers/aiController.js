import axios from "axios";
import dotenv from "dotenv";
import Course from "../models/courseModel.js";
import Mistake from "../models/mistakeModel.js";
import fs from "fs";

dotenv.config();

/* ---------------- GEMINI CONFIG ---------------- */

const GEMINI_API_URL =
"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

/* ---------------- SAFE GEMINI CALL ---------------- */

const callGemini = async (prompt) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY missing in env");
    }

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${apiKey}`,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      }
    );

    const text =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("Invalid Gemini response");
    }

    return text;
  } catch (error) {
    console.log("🔥 GEMINI ERROR:", error.response?.data || error.message);

    fs.appendFileSync(
      "debug_ai.txt",
      `Gemini Error: ${JSON.stringify(error.response?.data || error.message)}\n`
    );

    throw error;
  }
};

/* ---------------- SAFE JSON PARSER ---------------- */

const parseJsonFromAi = (text) => {
  try {
    let clean = text.trim();

    if (clean.startsWith("```json")) {
      clean = clean.replace(/```json/, "").replace(/```/, "").trim();
    } else if (clean.startsWith("```")) {
      clean = clean.replace(/```/, "").replace(/```/, "").trim();
    }

    return JSON.parse(clean);
  } catch (e) {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);

    throw new Error("Invalid JSON from AI");
  }
};

/* ===================================================== */
/*                       AI SEARCH                       */
/* ===================================================== */

export const searchWithAi = async (req, res) => {
  try {
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({ message: "Search query required" });
    }

    const prompt = `
You are SkillUp AI.

User query: "${input}"

Return JSON:
{
  "message": "friendly response",
  "keywords": ["keyword1", "keyword2"]
}
`;

    const aiText = await callGemini(prompt);
    const aiData = parseJsonFromAi(aiText);

    const searchTerms = [...new Set([...(aiData?.keywords || []), input])];

    const courses = await Course.find({
      isPublished: true,
      $or: searchTerms.map((term) => ({
        $or: [
          { title: { $regex: term, $options: "i" } },
          { category: { $regex: term, $options: "i" } }
        ]
      }))
    });

    return res.status(200).json({
      message: aiData?.message || "Here are courses",
      courses
    });
  } catch (error) {
    console.log("AI Search Error:", error.message);

    return res.status(200).json({
      message: "Fallback search",
      courses: []
    });
  }
};

/* ===================================================== */
/*                     ROADMAP                           */
/* ===================================================== */

export const generateRoadmap = async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ message: "Topic required" });
    }

    const prompt = `
Create roadmap for ${topic}.

Return JSON:
{
  "title": "Roadmap",
  "phases": [
    {
      "name": "Phase 1",
      "items": [
        { "title": "...", "description": "..." }
      ]
    }
  ]
}
`;

    const aiText = await callGemini(prompt);
    const data = parseJsonFromAi(aiText);

    return res.status(200).json(data);
  } catch (error) {
    console.log("Roadmap Error:", error.message);

    return res.status(500).json({
      message: "Failed to generate roadmap"
    });
  }
};

/* ===================================================== */
/*                INTERVIEW QUESTIONS                    */
/* ===================================================== */

export const generateInterviewQuestions = async (req, res) => {
  try {
    const { role, level } = req.body;

    if (!role) {
      return res.status(400).json({ message: "Role required" });
    }

    const prompt = `
Generate 5 interview questions for:
Role: ${role}
Level: ${level || "Intermediate"}

Return JSON:
{
  "questions": [
    {
      "question": "...",
      "keyPoints": ["..."],
      "difficulty": "easy"
    }
  ]
}
`;

    const aiText = await callGemini(prompt);
    const data = parseJsonFromAi(aiText);

    return res.status(200).json(data);
  } catch (error) {
    console.log("Interview Error:", error.message);

    return res.status(500).json({
      message: "Failed to generate questions"
    });
  }
};

/* ===================================================== */
/*                     QUIZ                              */
/* ===================================================== */

export const generateQuiz = async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ message: "Topic required" });
    }

    const prompt = `
Generate MCQ quiz for ${topic}.

Return JSON:
{
  "quiz": [
    {
      "question": "...",
      "options": ["A","B","C","D"],
      "correctAnswerIndex": 0,
      "explanation": "..."
    }
  ]
}
`;

    const aiText = await callGemini(prompt);
    const data = parseJsonFromAi(aiText);

    return res.status(200).json(data.quiz);
  } catch (error) {
    console.log("Quiz Error:", error.message);

    return res.status(500).json({
      message: "Failed to generate quiz"
    });
  }
};

/* ===================================================== */
/*                 OTHER FUNCTIONS                       */
/* ===================================================== */

export const evaluateResponse = async (req, res) => {
  try {
    return res.status(200).json({ message: "OK" });
  } catch (err) {
    return res.status(500).json({ message: "Error" });
  }
};

export const generateStudyPlan = async (req, res) => {
  try {
    return res.status(200).json({ plan: [] });
  } catch (err) {
    return res.status(500).json({ message: "Error" });
  }
};

export const trackMistake = async (req, res) => {
  try {
    return res.status(200).json({ message: "Tracked" });
  } catch (err) {
    return res.status(500).json({ message: "Error" });
  }
};

export const analyzeMistakes = async (req, res) => {
  try {
    return res.status(200).json({ message: "OK" });
  } catch (err) {
    return res.status(500).json({ message: "Error" });
  }
};