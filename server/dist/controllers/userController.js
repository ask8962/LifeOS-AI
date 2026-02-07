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
exports.syncUser = void 0;
const User_1 = __importDefault(require("../models/User"));
// @desc    Register or Sync User after Firebase Login
// @route   POST /api/users/sync
// @access  Private
const syncUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userPayload = req.user;
        const uid = userPayload === null || userPayload === void 0 ? void 0 : userPayload.uid;
        const email = userPayload === null || userPayload === void 0 ? void 0 : userPayload.email;
        const name = userPayload === null || userPayload === void 0 ? void 0 : userPayload.name; // Cast to access potential custom claims or profile data
        if (!uid || !email) {
            return res.status(400).json({ message: 'User data missing from token' });
        }
        let user = yield User_1.default.findOne({ firebaseUid: uid });
        if (!user) {
            // Create new user
            user = yield User_1.default.create({
                firebaseUid: uid,
                email,
                name: name || 'User',
                isAdmin: email === 'ganukalp70@gmail.com',
            });
            res.status(201).json(user);
        }
        else {
            // Check if admin status needs update (if previously registered before this change)
            if (email === 'ganukalp70@gmail.com' && !user.isAdmin) {
                user.isAdmin = true;
                yield user.save();
            }
            // Return existing user
            res.status(200).json(user);
        }
    }
    catch (error) {
        console.error('Error syncing user:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.syncUser = syncUser;
