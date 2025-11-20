import Activity from "../models/activityModel.js";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

// Helper: calculate "time ago"
const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1,
    };
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit}${interval !== 1 ? "s" : ""} ago`;
        }
    }
    return "just now";
};

export const getActivities = async (req, res) => {
    try {
        const { limit = 50 } = req.query;

        // Fetch all recent activities
        const allActivities = await Activity.find()
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .lean();

        // Separate into notifications and activities explicitly
        const notifications = allActivities
            .filter((a) => a.category === "notification")
            .map((activity) => ({
                id: activity._id,
                actionType: activity.actionType,
                title: activity.title,
                description: activity.description,
                entityType: activity.entityType,
                category: activity.category,
                metadata: activity.metadata,
                timeAgo: getTimeAgo(activity.createdAt),
                timestamp: activity.createdAt,
                formattedDate: new Date(activity.createdAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            }));

        const activities = allActivities
            .filter((a) => a.category === "activity")
            .map((activity) => ({
                id: activity._id,
                actionType: activity.actionType,
                title: activity.title,
                description: activity.description,
                entityType: activity.entityType,
                category: activity.category,
                metadata: activity.metadata,
                timeAgo: getTimeAgo(activity.createdAt),
                timestamp: activity.createdAt,
                formattedDate: new Date(activity.createdAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            }));

        res.json({
            success: true,
            count: {
                total: allActivities.length,
                notifications: notifications.length,
                activities: activities.length,
            },
            data: {
                notifications: notifications.slice(0, 10),
                activities: activities.slice(0, 10),
            },
        });
    } catch (err) {
        console.error("Error fetching activities:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch activities",
            error: err.message,
        });
    }
};


export const getUserActivities = async (req, res) => {
    try {
        // Get token from cookies
        const token = req.cookies?.authToken;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }

        // Verify token and get user
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        const userId = user._id;
        const { limit = 50 } = req.query;

        // Fetch ONLY activities related to THIS specific user
        const userActivities = await Activity.find({
            $and: [
                {
                    $or: [
                        { "metadata.userId": userId },
                        { "metadata.userId": userId.toString() },
                        { entityId: userId },
                        { entityId: userId.toString() }
                    ]
                }
            ]
        })
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .lean();

        const formattedActivities = userActivities.map((activity) => ({
            id: activity._id,
            actionType: activity.actionType,
            title: activity.title,
            description: activity.description,
            entityType: activity.entityType,
            category: activity.category,
            metadata: activity.metadata,
            timeAgo: getTimeAgo(activity.createdAt),
            timestamp: activity.createdAt,
            formattedDate: new Date(activity.createdAt).toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }),
        }));

        res.json({
            success: true,
            count: formattedActivities.length,
            data: formattedActivities,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        console.error("Error fetching user activities:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user activities",
            error: err.message,
        });
    }
};