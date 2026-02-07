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
exports.getDailySuggestionEndpoint = exports.getInsights = void 0;
const aiService_1 = require("../services/aiService");
const User_1 = __importDefault(require("../models/User"));
// @desc    Get AI-generated insights
// @route   GET /api/insights
// @access  Private
const getInsights = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uid;
        const user = yield User_1.default.findOne({ firebaseUid: userId });
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        const insights = yield (0, aiService_1.generateInsights)(user._id);
        res.status(200).json({ insights });
    }
    catch (error) {
        console.error('Error fetching insights:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.getInsights = getInsights;
// @desc    Get daily AI suggestion
// @route   GET /api/insights/daily
// @access  Private
const getDailySuggestionEndpoint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uid;
        const user = yield User_1.default.findOne({ firebaseUid: userId });
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        const suggestion = yield (0, aiService_1.getDailySuggestion)(user._id);
        res.status(200).json({ suggestion });
    }
    catch (error) {
        console.error('Error fetching daily suggestion:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.getDailySuggestionEndpoint = getDailySuggestionEndpoint;
