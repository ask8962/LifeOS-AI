import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { generateInsights, getDailySuggestion } from '../services/aiService';
import User from '../models/User';

// @desc    Get AI-generated insights
// @route   GET /api/insights
// @access  Private
export const getInsights = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.uid;
        const user = await User.findOne({ firebaseUid: userId });

        if (!user) return res.status(404).json({ message: 'User not found' });

        const insights = await generateInsights(user._id as any);
        res.status(200).json({ insights });
    } catch (error) {
        console.error('Error fetching insights:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get daily AI suggestion
// @route   GET /api/insights/daily
// @access  Private
export const getDailySuggestionEndpoint = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.uid;
        const user = await User.findOne({ firebaseUid: userId });

        if (!user) return res.status(404).json({ message: 'User not found' });

        const suggestion = await getDailySuggestion(user._id as any);
        res.status(200).json({ suggestion });
    } catch (error) {
        console.error('Error fetching daily suggestion:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
