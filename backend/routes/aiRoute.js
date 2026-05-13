import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { 
    searchWithAi, 
    generateRoadmap, 
    generateInterviewQuestions, 
    evaluateResponse, 
    generateStudyPlan,
    generateQuiz,
    trackMistake,
    analyzeMistakes,
    analyzeResume
} from "../controllers/aiController.js"

let aiRouter = express.Router()

aiRouter.post("/search", searchWithAi)
aiRouter.post("/generate-roadmap", generateRoadmap)
aiRouter.post("/generate-questions", generateInterviewQuestions)
aiRouter.post("/evaluate-response", evaluateResponse)
aiRouter.post("/generate-study-plan", generateStudyPlan)
aiRouter.post("/generate-quiz", generateQuiz)
aiRouter.post("/track-mistake", isAuth, trackMistake)
aiRouter.get("/analyze-mistakes", isAuth, analyzeMistakes)
aiRouter.post("/resume-analyzer", analyzeResume)

export default aiRouter