import express from 'express';
import { logDay, getDailyLog, getLogsRange } from '../controllers/dailyLogController';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

router.use(verifyToken);

router.post('/', logDay);
router.get('/', getLogsRange); // ?startDate=...&endDate=...
router.get('/:date', getDailyLog);

export default router;
