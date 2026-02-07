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
exports.generateOptimizations = void 0;
const Task_1 = __importDefault(require("../models/Task"));
const DailyLog_1 = __importDefault(require("../models/DailyLog"));
const analyticsService_1 = require("./analyticsService");
/**
 * Rule-Based Optimization Engine
 * Analyzes patterns and provides actionable recommendations
 */
const generateOptimizations = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const recommendations = [];
    const riskFactors = [];
    // Get analytics data
    const analytics = yield (0, analyticsService_1.calculateWeeklyAnalytics)(userId);
    // Get recent logs
    const recentLogs = yield DailyLog_1.default.find({ user: userId })
        .sort({ date: -1 })
        .limit(7);
    // Get pending tasks
    const pendingTasks = yield Task_1.default.find({
        user: userId,
        completed: false
    }).sort({ priority: -1, scheduledFor: 1 });
    // ============= RULE 1: Burnout Prevention =============
    if (analytics.burnoutRisk === 'high') {
        recommendations.push({
            type: 'recovery',
            priority: 'high',
            title: 'Recovery Day Recommended',
            description: 'Your energy and mood patterns indicate high burnout risk. Schedule a rest day.',
            action: 'Take a break from intense work for at least one day'
        });
        riskFactors.push('High burnout risk detected from energy/mood patterns');
    }
    else if (analytics.burnoutRisk === 'medium') {
        recommendations.push({
            type: 'recovery',
            priority: 'medium',
            title: 'Watch Your Energy',
            description: 'You\'re showing early signs of fatigue. Prioritize sleep and leisure.',
            action: 'Aim for 8 hours of sleep tonight'
        });
        riskFactors.push('Moderate burnout indicators present');
    }
    // ============= RULE 2: Consistency Improvement =============
    if (analytics.consistencyScore < 50) {
        recommendations.push({
            type: 'habit',
            priority: 'high',
            title: 'Improve Daily Logging',
            description: `You've only logged ${analytics.consistencyScore}% of days. Consistent tracking unlocks better insights.`,
            action: 'Set a daily reminder to log your metrics'
        });
        riskFactors.push('Low data consistency - insights may be unreliable');
    }
    // ============= RULE 3: Sleep Optimization =============
    const avgSleep = recentLogs.reduce((sum, log) => sum + (log.sleepHours || 0), 0) / Math.max(recentLogs.length, 1);
    let suggestedSleepTarget = 8;
    if (avgSleep < 6) {
        recommendations.push({
            type: 'schedule',
            priority: 'high',
            title: 'Critical: Increase Sleep',
            description: `You're averaging only ${avgSleep.toFixed(1)}h of sleep. This significantly impacts productivity.`,
            action: 'Go to bed 1 hour earlier tonight'
        });
        suggestedSleepTarget = 8;
        riskFactors.push('Chronic sleep deprivation');
    }
    else if (avgSleep < 7) {
        recommendations.push({
            type: 'schedule',
            priority: 'medium',
            title: 'Optimize Sleep',
            description: `You're averaging ${avgSleep.toFixed(1)}h. Aim for 7-8 hours for optimal performance.`,
            action: 'Maintain a consistent sleep schedule'
        });
        suggestedSleepTarget = 7.5;
    }
    // ============= RULE 4: Task Overload Detection =============
    if (pendingTasks.length > 10) {
        recommendations.push({
            type: 'focus',
            priority: 'high',
            title: 'Task Overload',
            description: `You have ${pendingTasks.length} pending tasks. Consider prioritizing or delegating.`,
            action: 'Review and prune your task list - delete or defer low-priority items'
        });
        riskFactors.push('Task accumulation leading to overwhelm');
    }
    // ============= RULE 5: Productivity Trend =============
    if (analytics.averageProductivity < 40) {
        recommendations.push({
            type: 'focus',
            priority: 'medium',
            title: 'Boost Productivity',
            description: 'Your productivity score is below optimal. Focus on completing high-impact tasks.',
            action: 'Use Pomodoro technique: 25 min work, 5 min break'
        });
    }
    else if (analytics.averageProductivity > 75) {
        recommendations.push({
            type: 'habit',
            priority: 'low',
            title: 'Great Performance!',
            description: `You're averaging ${analytics.averageProductivity}% productivity. Keep up the momentum!`,
            action: 'Share your success strategies with others'
        });
    }
    // ============= RULE 6: Study Hours Analysis =============
    const avgStudy = recentLogs.reduce((sum, log) => sum + (log.studyHours || 0), 0) / Math.max(recentLogs.length, 1);
    if (analytics.totalFocusHours < 20 && analytics.consistencyScore > 50) {
        recommendations.push({
            type: 'focus',
            priority: 'medium',
            title: 'Increase Focus Time',
            description: `You logged only ${analytics.totalFocusHours}h this week. Target 4-6 hours daily.`,
            action: 'Block 2 distraction-free hours each morning'
        });
    }
    // ============= Determine Optimal Focus Time =============
    // Based on energy patterns (simplified heuristic)
    const highEnergyDays = ((_a = analytics.energyTrend.find(e => e.energy === 'high')) === null || _a === void 0 ? void 0 : _a.count) || 0;
    let optimalFocusTime = '9:00 AM - 12:00 PM';
    if (highEnergyDays >= 3) {
        optimalFocusTime = '9:00 AM - 12:00 PM (Morning peak detected)';
    }
    else {
        optimalFocusTime = '2:00 PM - 5:00 PM (Consider experimenting with different times)';
    }
    // Add default recommendation if none generated
    if (recommendations.length === 0) {
        recommendations.push({
            type: 'habit',
            priority: 'low',
            title: 'Keep Going!',
            description: 'Your metrics look healthy. Stay consistent with your current routine.',
            action: 'Continue logging daily for more personalized insights'
        });
    }
    return {
        recommendations: recommendations.sort((a, b) => {
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        }),
        optimalFocusTime,
        suggestedSleepTarget,
        riskFactors
    };
});
exports.generateOptimizations = generateOptimizations;
