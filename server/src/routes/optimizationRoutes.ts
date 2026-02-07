import express from 'express';
import { getOptimizations } from '../controllers/optimizationController';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

router.use(verifyToken);

router.get('/', getOptimizations);

export default router;
