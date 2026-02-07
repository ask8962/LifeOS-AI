"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dailyLogController_1 = require("../controllers/dailyLogController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.use(authMiddleware_1.verifyToken);
router.post('/', dailyLogController_1.logDay);
router.get('/', dailyLogController_1.getLogsRange); // ?startDate=...&endDate=...
router.get('/:date', dailyLogController_1.getDailyLog);
exports.default = router;
