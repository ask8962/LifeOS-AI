import { Response } from 'express';
import DailyLog from '../models/DailyLog';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Create or Update Daily Log
// @route   POST /api/logs
// @access  Private
export const logDay = async (req: AuthRequest, res: Response) => {
    try {
        const { date, sleepHours, studyHours, mood, energyLevel, notes } = req.body;
        const userId = req.user?.uid;

        // Fetch User ID
        const User = require('../models/User').default;
        const user = await User.findOne({ firebaseUid: userId });

        if (!user) return res.status(404).json({ message: 'User not found' });

        // Validate Date format YYYY-MM-DD
        if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD' });
        }

        // Upsert logic
        let log = await DailyLog.findOne({ user: user._id, date });

        if (log) {
            // Update existing
            if (sleepHours !== undefined) log.sleepHours = sleepHours;
            if (studyHours !== undefined) log.studyHours = studyHours;
            if (mood !== undefined) log.mood = mood;
            if (energyLevel) log.energyLevel = energyLevel;
            if (notes !== undefined) log.notes = notes;
            await log.save();
        } else {
            // Create new
            log = await DailyLog.create({
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
    } catch (error) {
        console.error('Error logging day:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Daily Log by Date
// @route   GET /api/logs/:date
// @access  Private
export const getDailyLog = async (req: AuthRequest, res: Response) => {
    try {
        const { date } = req.params;
        const userId = req.user?.uid;

        const User = require('../models/User').default;
        const user = await User.findOne({ firebaseUid: userId });

        if (!user) return res.status(404).json({ message: 'User not found' });

        const log = await DailyLog.findOne({ user: user._id, date });

        if (!log) {
            return res.status(404).json({ message: 'No log found for this date' });
        }

        res.status(200).json(log);
    } catch (error) {
        console.error('Error fetching daily log:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Logs for range (e.g. last 7 days)
// @route   GET /api/logs?startDate=...&endDate=...
// @access  Private
export const getLogsRange = async (req: AuthRequest, res: Response) => {
    try {
        const { startDate, endDate } = req.query;
        const userId = req.user?.uid;

        const User = require('../models/User').default;
        const user = await User.findOne({ firebaseUid: userId });

        if (!user) return res.status(404).json({ message: 'User not found' });

        const query: any = { user: user._id };

        if (startDate && endDate) {
            query.date = { $gte: startDate, $lte: endDate };
        }

        const logs = await DailyLog.find(query).sort({ date: 1 });
        res.status(200).json(logs);
    } catch (error) {
        console.error('Error fetching logs range:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
