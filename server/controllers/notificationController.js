import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

// Route 1: Save device token (when user opens app)
export const saveDeviceToken = async (req, res) => {
    try {
        // Get user from cookie
        const token = req.cookies?.authToken;
        if (!token) {
            return res.status(401).json({ message: "Not logged in" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { deviceToken, platform } = req.body;

        // Save token to user
        await User.updateOne(
            { _id: decoded.id },
            { $addToSet: { deviceTokens: { token: deviceToken, platform } } }
        );

        res.json({ message: "Device token saved" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Route 2: Remove device token (when user logs out)
export const removeDeviceToken = async (req, res) => {
    try {
        const token = req.cookies?.authToken;
        if (!token) {
            return res.status(401).json({ message: "Not logged in" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { deviceToken } = req.body;

        // Remove token from user
        await User.updateOne(
            { _id: decoded.id },
            { $pull: { deviceTokens: { token: deviceToken } } }
        );

        res.json({ message: "Device token removed" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};