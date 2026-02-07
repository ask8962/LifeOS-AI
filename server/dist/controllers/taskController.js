"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.getTasks = exports.createTask = void 0;
const Task_1 = __importDefault(require("../models/Task"));
// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { title, description, duration, priority, scheduledFor, goal } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uid; // We should probably lookup the Mongo _id from the middleware using firebaseUid, but for now lets rely on Sync.
        // In a real app, we might want to attach the actual Mongo User ObjectId here. 
        // For MVP, we'll need to fetch the user first or store ObjectId in token (requires custom claims).
        // Let's fetch user by firebaseUid for now to get the ObjectId.
        const User = require('../models/User').default;
        const user = yield User.findOne({ firebaseUid: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const task = yield Task_1.default.create({
            user: user._id,
            title,
            description,
            duration,
            priority,
            scheduledFor,
            goal
        });
        res.status(201).json(task);
    }
    catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.createTask = createTask;
// @desc    Get all tasks for user
// @route   GET /api/tasks
// @access  Private
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uid;
        const User = require('../models/User').default;
        const user = yield User.findOne({ firebaseUid: userId });
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        const tasks = yield Task_1.default.find({ user: user._id }).sort({ createdAt: -1 });
        res.status(200).json(tasks);
    }
    catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.getTasks = getTasks;
// @desc    Update a task (mark complete, edit details)
// @route   PATCH /api/tasks/:id
// @access  Private
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uid;
        const User = require('../models/User').default;
        const user = yield User.findOne({ firebaseUid: userId });
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        const task = yield Task_1.default.findOne({ _id: id, user: user._id });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        // Update fields
        Object.assign(task, req.body);
        // Logic for completion
        if (req.body.completed && !task.completed) {
            task.completedAt = new Date();
        }
        else if (req.body.completed === false) {
            task.completedAt = undefined;
        }
        yield task.save();
        res.status(200).json(task);
    }
    catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.updateTask = updateTask;
// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uid;
        const User = require('../models/User').default;
        const user = yield User.findOne({ firebaseUid: userId });
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        const task = yield Task_1.default.findOneAndDelete({ _id: id, user: user._id });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({ message: 'Task deleted' });
    }
    catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.deleteTask = deleteTask;
