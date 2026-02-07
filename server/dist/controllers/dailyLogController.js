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
exports.getLogsRange = exports.getDailyLog = exports.logDay = void 0;
const DailyLog_1 = __importDefault(require("../models/DailyLog"));
// @desc    Create or Update Daily Log
// @route   POST /api/logs
// @access  Private
const logDay = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { date, sleepHours, studyHours, mood, energyLevel, notes } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uid;
        // Fetch User ID
        const User = require('../models/User').default;
        const user = yield User.findOne({ firebaseUid: userId });
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        // Validate Date format YYYY-MM-DD
        if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD' });
        }
        // Upsert logic
        let log = yield DailyLog_1.default.findOne({ user: user._id, date });
        if (log) {
            // Update existing
            if (sleepHours !== undefined)
                log.sleepHours = sleepHours;
            if (studyHours !== undefined)
                log.studyHours = studyHours;
            if (mood !== undefined)
                log.mood = mood;
            if (energyLevel)
                log.energyLevel = energyLevel;
            if (notes !== undefined)
                log.notes = notes;
            yield log.save();
        }
        else {
            // Create new
            log = yield DailyLog_1.default.create({
                user: user._id,
                date,
                sleepHours,
                studyHours,
                mood,
                energyLevel,
                notes,
                tasksCompleted: 0 // Will be updated by aggregation later
            });
        }
        res.status(200).json(log);
    }
    catch (error) {
        console.error('Error logging day:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.logDay = logDay;
// @desc    Get Daily Log by Date
// @route   GET /api/logs/:date
// @access  Private
const getDailyLog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { date } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uid;
        const User = require('../models/User').default;
        const user = yield User.findOne({ firebaseUid: userId });
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        const log = yield DailyLog_1.default.findOne({ user: user._id, date });
        if (!log) {
            return res.status(404).json({ message: 'No log found for this date' });
        }
        res.status(200).json(log);
    }
    catch (error) {
        console.error('Error fetching daily log:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.getDailyLog = getDailyLog;
// @desc    Get Logs for range (e.g. last 7 days)
// @route   GET /api/logs?startDate=...&endDate=...
// @access  Private
const getLogsRange = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { startDate, endDate } = req.query;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uid;
        const User = require('../models/User').default;
        const user = yield User.findOne({ firebaseUid: userId });
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        const query = { user: user._id };
        if (startDate && endDate) {
            query.date = { $gte: startDate, $lte: endDate };
        }
        const logs = yield DailyLog_1.default.find(query).sort({ date: 1 });
        res.status(200).json(logs);
    }
    catch (error) {
        console.error('Error fetching logs range:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.getLogsRange = getLogsRange;
