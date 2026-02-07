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
exports.getTodayStats = exports.calculateWeeklyAnalytics = exports.calculateDailyProductivity = void 0;
const Task_1 = __importDefault(require("../models/Task"));
const DailyLog_1 = __importDefault(require("../models/DailyLog"));
/**
 * Calculate productivity score for a given day
 * Formula: (tasksCompleted / totalTasks) * 0.5 + (focusHours / targetHours) * 0.3 + energyBonus * 0.2
 */
const calculateDailyProductivity = (userId_1, date_1, ...args_1) => __awaiter(void 0, [userId_1, date_1, ...args_1], void 0, function* (userId, date, targetFocusHours = 6) {
    // Get tasks for the day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    const tasks = yield Task_1.default.find({
        user: userId,
        scheduledFor: { $gte: startOfDay, $lte: endOfDay }
    });
    const tasksCompleted = tasks.filter(t => t.completed).length;
    const totalTasks = tasks.length;
    // Get daily log
    const log = yield DailyLog_1.default.findOne({ user: userId, date });
    const focusHours = (log === null || log === void 0 ? void 0 : log.studyHours) || 0;
    const mood = (log === null || log === void 0 ? void 0 : log.mood) || null;
    const energyLevel = (log === null || log === void 0 ? void 0 : log.energyLevel) || null;
    // Calculate score components
    const taskScore = totalTasks > 0 ? (tasksCompleted / totalTasks) : 0;
    const focusScore = Math.min(focusHours / targetFocusHours, 1);
    // Energy bonus: high = 1, medium = 0.5, low = 0.2
    let energyBonus = 0.5;
    if (energyLevel === 'high')
        energyBonus = 1;
    else if (energyLevel === 'low')
        energyBonus = 0.2;
    // Weighted productivity score (0-100)
    const productivityScore = Math.round((taskScore * 0.5 + focusScore * 0.3 + energyBonus * 0.2) * 100);
    return {
        date,
        productivityScore,
        tasksCompleted,
        totalTasks,
        focusHours,
        mood,
        energyLevel
    };
});
exports.calculateDailyProductivity = calculateDailyProductivity;
/**
 * Calculate weekly analytics for a user
 */
const calculateWeeklyAnalytics = (userId_1, ...args_1) => __awaiter(void 0, [userId_1, ...args_1], void 0, function* (userId, endDate = new Date()) {
    // Get last 7 days
    const dates = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date(endDate);
        d.setDate(d.getDate() - i);
        dates.push(d.toISOString().split('T')[0]);
    }
    const dailyBreakdown = [];
    const moodCount = {};
    const energyCount = {};
    let totalProductivity = 0;
    let totalTasksCompleted = 0;
    let totalFocusHours = 0;
    let daysWithData = 0;
    for (const date of dates) {
        const stats = yield (0, exports.calculateDailyProductivity)(userId, date);
        dailyBreakdown.push(stats);
        if (stats.productivityScore > 0 || stats.totalTasks > 0) {
            daysWithData++;
            totalProductivity += stats.productivityScore;
        }
        totalTasksCompleted += stats.tasksCompleted;
        totalFocusHours += stats.focusHours;
        if (stats.mood) {
            moodCount[stats.mood] = (moodCount[stats.mood] || 0) + 1;
        }
        if (stats.energyLevel) {
            energyCount[stats.energyLevel] = (energyCount[stats.energyLevel] || 0) + 1;
        }
    }
    // Calculate averages
    const averageProductivity = daysWithData > 0
        ? Math.round(totalProductivity / daysWithData)
        : 0;
    // Consistency score: % of days with logged data
    const consistencyScore = Math.round((daysWithData / 7) * 100);
    // Burnout risk detection
    const lowEnergyDays = energyCount['low'] || 0;
    const badMoodDays = (moodCount['bad'] || 0) + (moodCount['terrible'] || 0);
    let burnoutRisk = 'low';
    if (lowEnergyDays >= 4 || badMoodDays >= 3) {
        burnoutRisk = 'high';
    }
    else if (lowEnergyDays >= 2 || badMoodDays >= 2) {
        burnoutRisk = 'medium';
    }
    // Format trend data
    const moodTrend = Object.entries(moodCount).map(([mood, count]) => ({ mood, count }));
    const energyTrend = Object.entries(energyCount).map(([energy, count]) => ({ energy, count }));
    return {
        startDate: dates[0],
        endDate: dates[dates.length - 1],
        averageProductivity,
        totalTasksCompleted,
        totalFocusHours,
        moodTrend,
        energyTrend,
        dailyBreakdown,
        consistencyScore,
        burnoutRisk
    };
});
exports.calculateWeeklyAnalytics = calculateWeeklyAnalytics;
/**
 * Get today's dashboard stats
 */
const getTodayStats = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date().toISOString().split('T')[0];
    const stats = yield (0, exports.calculateDailyProductivity)(userId, today);
    // Get next priority task
    const nextTask = yield Task_1.default.findOne({
        user: userId,
        completed: false,
        scheduledFor: { $gte: new Date() }
    }).sort({ scheduledFor: 1, priority: -1 });
    return Object.assign(Object.assign({}, stats), { nextPriorityTask: nextTask ? {
            title: nextTask.title,
            duration: nextTask.duration,
            scheduledFor: nextTask.scheduledFor
        } : null });
});
exports.getTodayStats = getTodayStats;
