import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { generateOptimizations } from '../services/optimizationService';
import User from '../models/User';

// @desc    Get optimization recommendations
// @route   GET /api/optimize
// @access  Private
export const getOptimizations = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.uid;
        const user = await User.findOne({ firebaseUid: userId });

        if (!user) return res.status(404).json({ message: 'User not found' });

        const optimizations = await generateOptimizations(user._id as any);
        res.status(200).json(optimizations);
    } catch (error) {
        console.error('Error generating optimizations:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
