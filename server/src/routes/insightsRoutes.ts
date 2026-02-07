import express from 'express';
import { getInsights, getDailySuggestionEndpoint } from '../controllers/insightsController';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

router.use(verifyToken);

router.get('/', getInsights);
router.get('/daily', getDailySuggestionEndpoint);

export default router;
