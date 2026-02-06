import express from 'express';
import { createTask, getTasks, updateTask, deleteTask } from '../controllers/taskController';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

router.use(verifyToken); // Protect all routes

router.route('/')
    .post(createTask)
    .get(getTasks);

router.route('/:id')
    .patch(updateTask)
    .delete(deleteTask);

export default router;
