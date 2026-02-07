"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDailySuggestion = exports.generateInsights = void 0;
const gemini_1 = require("../config/gemini");
const analyticsService_1 = require("./analyticsService");
const Task_1 = __importDefault(require("../models/Task"));
const DailyLog_1 = __importDefault(require("../models/DailyLog"));
/**
 * Build context prompt from user data
 */
const buildUserContext = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const analytics = yield (0, analyticsService_1.calculateWeeklyAnalytics)(userId);
    // Get recent tasks
    const recentTasks = yield Task_1.default.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(10);
    // Get recent logs
    const recentLogs = yield DailyLog_1.default.find({ user: userId })
        .sort({ date: -1 })
        .limit(7);
    const tasksSummary = recentTasks.map(t => `- ${t.title} (${t.completed ? 'Done' : 'Pending'}, Priority: ${t.priority})`).join('\n');
    const logsSummary = recentLogs.map(l => `- ${l.date}: Sleep ${l.sleepHours || '?'}h, Study ${l.studyHours || '?'}h, Mood: ${l.mood || '?'}, Energy: ${l.energyLevel || '?'}`).join('\n');
    return `
## User Analytics (Last 7 Days)
- Average Productivity Score: ${analytics.averageProductivity}/100
- Total Tasks Completed: ${analytics.totalTasksCompleted}
- Total Focus Hours: ${analytics.totalFocusHours}
- Consistency Score: ${analytics.consistencyScore}%
- Burnout Risk: ${analytics.burnoutRisk}

## Recent Tasks
${tasksSummary || 'No tasks recorded'}

## Daily Logs
${logsSummary || 'No logs recorded'}

## Mood Trend
${analytics.moodTrend.map(m => `${m.mood}: ${m.count} days`).join(', ') || 'No mood data'}

## Energy Trend
${analytics.energyTrend.map(e => `${e.energy}: ${e.count} days`).join(', ') || 'No energy data'}
`;
});
/**
 * Generate AI insights using Gemini
 */
const generateInsights = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const model = (0, gemini_1.getGeminiModel)();
        const userContext = yield buildUserContext(userId);
        const prompt = `You are an AI life optimization assistant. Analyze the following user data and provide 3-4 actionable insights.

${userContext}

Based on this data, provide insights in the following JSON format:
[
  {
    "type": "observation" | "suggestion" | "warning" | "prediction",
    "title": "Short title (max 50 chars)",
    "content": "Detailed insight (max 150 chars)",
    "priority": "low" | "medium" | "high"
  }
]

Focus on:
1. Productivity patterns and how to improve them
2. Sleep/energy optimization
3. Burnout prevention if risk is detected
4. Task completion strategies

Return ONLY valid JSON array, no markdown or extra text.`;
        const result = yield model.generateContent(prompt);
        const response = result.response.text();
        // Parse JSON from response
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            console.error('Failed to parse AI response:', response);
            return getDefaultInsights();
        }
        const insights = JSON.parse(jsonMatch[0]);
        return insights;
    }
    catch (error) {
        console.error('Error generating AI insights:', error);
        return getDefaultInsights();
    }
});
exports.generateInsights = generateInsights;
/**
 * Default insights when AI is unavailable
 */
const getDefaultInsights = () => {
    return [
        {
            type: 'suggestion',
            title: 'Start Logging Data',
            content: 'Log your daily tasks and metrics to unlock personalized AI insights.',
            priority: 'medium'
        },
        {
            type: 'observation',
            title: 'Track Your Progress',
            content: 'Consistent tracking helps the AI understand your patterns better.',
            priority: 'low'
        }
    ];
};
/**
 * Get daily suggestion based on current state
 */
const getDailySuggestion = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const model = (0, gemini_1.getGeminiModel)();
        const userContext = yield buildUserContext(userId);
        const prompt = `Based on this user's data, give ONE short, actionable suggestion for today (max 100 chars):

${userContext}

Respond with just the suggestion text, no quotes or formatting.`;
        const result = yield model.generateContent(prompt);
        return result.response.text().trim();
    }
    catch (error) {
        console.error('Error generating daily suggestion:', error);
        return 'Focus on your highest priority task first thing today.';
    }
});
exports.getDailySuggestion = getDailySuggestion;
