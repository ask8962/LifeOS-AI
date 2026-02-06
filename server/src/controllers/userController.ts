import { Request, Response } from 'express';
import User from '../models/User';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Register or Sync User after Firebase Login
// @route   POST /api/users/sync
// @access  Private
export const syncUser = async (req: AuthRequest, res: Response) => {
    try {
        const userPayload = req.user;
        const uid = userPayload?.uid;
        const email = userPayload?.email;
        const name = (userPayload as any)?.name; // Cast to access potential custom claims or profile data

        if (!uid || !email) {
            return res.status(400).json({ message: 'User data missing from token' });
        }

        let user = await User.findOne({ firebaseUid: uid });

        if (!user) {
            // Create new user
            user = await User.create({
                firebaseUid: uid,
                email,
                name: name || 'User',
                isAdmin: email === 'ganukalp70@gmail.com',
            });
            res.status(201).json(user);
        } else {
            // Check if admin status needs update (if previously registered before this change)
            if (email === 'ganukalp70@gmail.com' && !user.isAdmin) {
                user.isAdmin = true;
                await user.save();
            }
            // Return existing user
            res.status(200).json(user);
        }
    } catch (error) {
        console.error('Error syncing user:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
