import Activity from "../models/activityModel.js";

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
