import { getGeminiModel } from '../config/gemini';
import { calculateWeeklyAnalytics } from './analyticsService';
import mongoose from 'mongoose';
import Task from '../models/Task';
import DailyLog from '../models/DailyLog';

interface AIInsight {
    type: 'observation' | 'suggestion' | 'warning' | 'prediction';
    title: string;
    content: string;
    priority: 'low' | 'medium' | 'high';
}

/**
 * Build context prompt from user data
 */
const buildUserContext = async (userId: mongoose.Types.ObjectId): Promise<string> => {
    const analytics = await calculateWeeklyAnalytics(userId);

    // Get recent tasks
    const recentTasks = await Task.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(10);

    // Get recent logs
    const recentLogs = await DailyLog.find({ user: userId })
        .sort({ date: -1 })
        .limit(7);

    const tasksSummary = recentTasks.map(t =>
        `- ${t.title} (${t.completed ? 'Done' : 'Pending'}, Priority: ${t.priority})`
    ).join('\n');

    const logsSummary = recentLogs.map(l =>
        `- ${l.date}: Sleep ${l.sleepHours || '?'}h, Study ${l.studyHours || '?'}h, Mood: ${l.mood || '?'}, Energy: ${l.energyLevel || '?'}`
    ).join('\n');

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
};

/**
 * Generate AI insights using Gemini
 */
export const generateInsights = async (userId: mongoose.Types.ObjectId): Promise<AIInsight[]> => {
    try {
        const model = getGeminiModel();
        const userContext = await buildUserContext(userId);

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

        const result = await model.generateContent(prompt);
        const response = result.response.text();

        // Parse JSON from response
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            console.error('Failed to parse AI response:', response);
            return getDefaultInsights();
        }

        const insights: AIInsight[] = JSON.parse(jsonMatch[0]);
        return insights;
    } catch (error) {
        console.error('Error generating AI insights:', error);
        return getDefaultInsights();
    }
};

/**
 * Default insights when AI is unavailable
 */
const getDefaultInsights = (): AIInsight[] => {
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
export const getDailySuggestion = async (userId: mongoose.Types.ObjectId): Promise<string> => {
    try {
        const model = getGeminiModel();
        const userContext = await buildUserContext(userId);

        const prompt = `Based on this user's data, give ONE short, actionable suggestion for today (max 100 chars):

${userContext}

Respond with just the suggestion text, no quotes or formatting.`;

        const result = await model.generateContent(prompt);
        return result.response.text().trim();
    } catch (error) {
        console.error('Error generating daily suggestion:', error);
        return 'Focus on your highest priority task first thing today.';
    }
};
