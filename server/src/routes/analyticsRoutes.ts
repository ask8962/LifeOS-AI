import express from 'express';
import {
    getDashboardStats,
    getWeeklyAnalytics,
    getDailyAnalytics
} from '../controllers/analyticsController';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

router.use(verifyToken);

router.get('/today', getDashboardStats);
router.get('/weekly', getWeeklyAnalytics);
router.get('/daily/:date', getDailyAnalytics);

export default router;
