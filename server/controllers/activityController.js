import Activity from "../models/activityModel.js";

export const getActivities = async (req, res) => {
    try {
        const activities = await Activity.find()
            .sort({ createdAt: -1 })
            .limit(100);
        res.json(activities);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
