
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

async function testAI() {
    try {
        console.log("Testing Gemini API (Standard SDK)...");
        console.log("API Key present:", !!process.env.GEMINI_API_KEY);

        if (!process.env.GEMINI_API_KEY) {
            console.error("ERROR: GEMINI_API_KEY is missing from environment variables.");
            return;
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const modelsToTry = "gemini-1.5-flash";
        const prompt = "Explain AI in 5 words.";

        for (const modelName of modelsToTry) {
            console.log(`\nAttempting with model: ${modelName}`);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent(prompt);
                const response = await result.response;
                console.log(`SUCCESS with ${modelName}!`);
                console.log("Response text:", response.text());
                return;
            } catch (error) {
                console.log(`Failed with ${modelName}:`, error.message);
            }
        }
        console.error("All models failed.");

    } catch (error) {
        console.error("AI Test Failed:", error);
    }
}

testAI();
