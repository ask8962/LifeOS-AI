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
exports.getDailyAnalytics = exports.getWeeklyAnalytics = exports.getDashboardStats = void 0;
const analyticsService_1 = require("../services/analyticsService");
const User_1 = __importDefault(require("../models/User"));
// @desc    Get today's dashboard stats
// @route   GET /api/analytics/today
// @access  Private
const getDashboardStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uid;
        const user = yield User_1.default.findOne({ firebaseUid: userId });
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        const stats = yield (0, analyticsService_1.getTodayStats)(user._id);
        res.status(200).json(stats);
    }
    catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.getDashboardStats = getDashboardStats;
// @desc    Get weekly analytics
// @route   GET /api/analytics/weekly
// @access  Private
const getWeeklyAnalytics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uid;
        const user = yield User_1.default.findOne({ firebaseUid: userId });
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        const analytics = yield (0, analyticsService_1.calculateWeeklyAnalytics)(user._id);
        res.status(200).json(analytics);
    }
    catch (error) {
        console.error('Error fetching weekly analytics:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.getWeeklyAnalytics = getWeeklyAnalytics;
// @desc    Get productivity for a specific date
// @route   GET /api/analytics/daily/:date
// @access  Private
const getDailyAnalytics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const date = req.params.date;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uid;
        const user = yield User_1.default.findOne({ firebaseUid: userId });
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        // Validate date format
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD' });
        }
        const stats = yield (0, analyticsService_1.calculateDailyProductivity)(user._id, date);
        res.status(200).json(stats);
    }
    catch (error) {
        console.error('Error fetching daily analytics:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.getDailyAnalytics = getDailyAnalytics;
