import express from 'express';
import { syncUser } from '../controllers/userController';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/sync', verifyToken, syncUser);

export default router;
