"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGeminiModel = void 0;
const generative_ai_1 = require("@google/generative-ai");
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.warn('⚠️ GEMINI_API_KEY not found. AI features will be disabled.');
}
const genAI = apiKey ? new generative_ai_1.GoogleGenerativeAI(apiKey) : null;
const getGeminiModel = () => {
    if (!genAI) {
        throw new Error('Gemini API not configured');
    }
    return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
};
exports.getGeminiModel = getGeminiModel;
exports.default = genAI;
