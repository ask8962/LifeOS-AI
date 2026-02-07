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
exports.getOptimizations = void 0;
const optimizationService_1 = require("../services/optimizationService");
const User_1 = __importDefault(require("../models/User"));
// @desc    Get optimization recommendations
// @route   GET /api/optimize
// @access  Private
const getOptimizations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uid;
        const user = yield User_1.default.findOne({ firebaseUid: userId });
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        const optimizations = yield (0, optimizationService_1.generateOptimizations)(user._id);
        res.status(200).json(optimizations);
    }
    catch (error) {
        console.error('Error generating optimizations:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.getOptimizations = getOptimizations;
