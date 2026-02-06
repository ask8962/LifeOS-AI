import { Response } from 'express';
import Task from '../models/Task';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, duration, priority, scheduledFor, goal } = req.body;
        const userId = req.user?.uid; // We should probably lookup the Mongo _id from the middleware using firebaseUid, but for now lets rely on Sync.

        // In a real app, we might want to attach the actual Mongo User ObjectId here. 
        // For MVP, we'll need to fetch the user first or store ObjectId in token (requires custom claims).
        // Let's fetch user by firebaseUid for now to get the ObjectId.
        const User = require('../models/User').default;
        const user = await User.findOne({ firebaseUid: userId });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const task = await Task.create({
            user: user._id,
            title,
            description,
            duration,
            priority,
            scheduledFor,
            goal
        });

        res.status(201).json(task);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all tasks for user
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.uid;
        const User = require('../models/User').default;
        const user = await User.findOne({ firebaseUid: userId });

        if (!user) return res.status(404).json({ message: 'User not found' });

        const tasks = await Task.find({ user: user._id }).sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a task (mark complete, edit details)
// @route   PATCH /api/tasks/:id
// @access  Private
export const updateTask = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.uid;
        const User = require('../models/User').default;
        const user = await User.findOne({ firebaseUid: userId });

        if (!user) return res.status(404).json({ message: 'User not found' });

        const task = await Task.findOne({ _id: id, user: user._id });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Update fields
        Object.assign(task, req.body);

        // Logic for completion
        if (req.body.completed && !task.completed) {
            task.completedAt = new Date();
        } else if (req.body.completed === false) {
            task.completedAt = undefined;
        }

        await task.save();
        res.status(200).json(task);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.uid;
        const User = require('../models/User').default;
        const user = await User.findOne({ firebaseUid: userId });

        if (!user) return res.status(404).json({ message: 'User not found' });

        const task = await Task.findOneAndDelete({ _id: id, user: user._id });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ message: 'Task deleted' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
