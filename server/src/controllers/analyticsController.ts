import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import {
    getTodayStats,
    calculateWeeklyAnalytics,
    calculateDailyProductivity
} from '../services/analyticsService';
import User from '../models/User';

// @desc    Get today's dashboard stats
// @route   GET /api/analytics/today
// @access  Private
export const getDashboardStats = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.uid;
        const user = await User.findOne({ firebaseUid: userId });

        if (!user) return res.status(404).json({ message: 'User not found' });

        const stats = await getTodayStats(user._id as any);
        res.status(200).json(stats);
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get weekly analytics
// @route   GET /api/analytics/weekly
// @access  Private
export const getWeeklyAnalytics = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.uid;
        const user = await User.findOne({ firebaseUid: userId });

        if (!user) return res.status(404).json({ message: 'User not found' });

        const analytics = await calculateWeeklyAnalytics(user._id as any);
        res.status(200).json(analytics);
    } catch (error) {
        console.error('Error fetching weekly analytics:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get productivity for a specific date
// @route   GET /api/analytics/daily/:date
// @access  Private
export const getDailyAnalytics = async (req: AuthRequest, res: Response) => {
    try {
        const date = req.params.date as string;
        const userId = req.user?.uid;
        const user = await User.findOne({ firebaseUid: userId });

        if (!user) return res.status(404).json({ message: 'User not found' });

        // Validate date format
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD' });
        }

        const stats = await calculateDailyProductivity(user._id as any, date);
        res.status(200).json(stats);
    } catch (error) {
        console.error('Error fetching daily analytics:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
