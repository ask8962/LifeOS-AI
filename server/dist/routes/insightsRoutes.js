"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const insightsController_1 = require("../controllers/insightsController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.use(authMiddleware_1.verifyToken);
router.get('/', insightsController_1.getInsights);
router.get('/daily', insightsController_1.getDailySuggestionEndpoint);
exports.default = router;
