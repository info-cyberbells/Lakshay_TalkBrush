
import { User } from "../models/userModel.js";

const countInRange = () => {
    return Math.floor(Math.random() * 10) + 1;
};


export const getType3Analytics = async (req, res) => {
    try {
        const period = req.query.period;
        const now = new Date();

        // ----------------------------------------
        // 📌 1) YESTERDAY (6 windows × 4 hours)
        // ----------------------------------------
        if (period === "yesterday") {
            const windows = [];
            const HOURS = 4;
            let startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);

            let currentStart = new Date(startDate);

            for (let i = 0; i < 6; i++) {
                const end = new Date(currentStart);
                end.setHours(end.getHours() + HOURS);

                const label = `${currentStart.getHours().toString().padStart(2, "0")}:${currentStart.getMinutes().toString().padStart(2, "0")} - ${end.getHours().toString().padStart(2, "0")}:${end.getMinutes().toString().padStart(2, "0")}`;

                windows.push({ start: new Date(currentStart), end, label });

                currentStart = new Date(end);
                currentStart.setMinutes(currentStart.getMinutes() + 1);
            }

            windows.reverse();

            const results = windows.map((w) => ({
                label: w.label,
                count: countInRange(w.start, w.end),
            }));

            const totalUsers = await User.countDocuments({ type: "3" });

            const missingLoginUsers = await User.countDocuments({
                type: "3",
                $or: [
                    { lastLogin: { $exists: false } },
                    { lastLogin: null }
                ]
            });

            const usersWithLogin = await User.countDocuments({
                type: "3",
                lastLogin: { $exists: true, $ne: null }
            });

            const activeUsers = await User.countDocuments({
                type: "3",
                lastLogin: { $gte: startDate },
            });

            const inactiveUsers = usersWithLogin - activeUsers;


            return res.json({
                status: true,
                period,
                totalUsers,
                activeUsers,
                inactiveUsers,
                missingLoginUsers,
                data: results,
            });
        }

        // ----------------------------------------
        // 📌 2) WEEK (daily)
        // ----------------------------------------
        if (period === "week") {
            const startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

            const results = [];

            for (let i = 0; i < 7; i++) {
                const dayStart = new Date(startDate);
                dayStart.setDate(startDate.getDate() + i);

                const dayEnd = new Date(dayStart);
                dayEnd.setHours(23, 59, 59);

                const label = `${dayStart.getDate()}/${dayStart.getMonth() + 1}`;

                results.push({
                    label,
                    count: countInRange(dayStart, dayEnd),
                });
            }

            const totalUsers = await User.countDocuments({ type: "3" });

            const missingLoginUsers = await User.countDocuments({
                type: "3",
                $or: [
                    { lastLogin: { $exists: false } },
                    { lastLogin: null }
                ]
            });

            const usersWithLogin = await User.countDocuments({
                type: "3",
                lastLogin: { $exists: true, $ne: null }
            });

            const activeUsers = await User.countDocuments({
                type: "3",
                lastLogin: { $gte: startDate },
            });

            const inactiveUsers = usersWithLogin - activeUsers;



            return res.json({
                status: true,
                period,
                totalUsers,
                activeUsers,
                inactiveUsers,
                missingLoginUsers,
                data: results,
            });
        }

        // ----------------------------------------
        // 📌 3) MONTH (6 windows × 5 days)
        // ----------------------------------------
        if (period === "month") {
            const windows = [];
            const startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

            let currentStart = new Date(startDate);

            for (let i = 0; i < 6; i++) {
                const end = new Date(currentStart);
                end.setDate(end.getDate() + 5);

                const label = `${currentStart.getDate()}-${currentStart.getMonth() + 1} to ${end.getDate()}-${end.getMonth() + 1}`;

                windows.push({ start: new Date(currentStart), end, label });

                currentStart = new Date(end);
                currentStart.setDate(currentStart.getDate() + 1);
            }

            windows.reverse();

            const results = windows.map((w) => ({
                label: w.label,
                count: countInRange(w.start, w.end),
            }));

            const totalUsers = await User.countDocuments({ type: "3" });

            const missingLoginUsers = await User.countDocuments({
                type: "3",
                $or: [
                    { lastLogin: { $exists: false } },
                    { lastLogin: null }
                ]
            });

            const usersWithLogin = await User.countDocuments({
                type: "3",
                lastLogin: { $exists: true, $ne: null }
            });

            const activeUsers = await User.countDocuments({
                type: "3",
                lastLogin: { $gte: startDate },
            });

            const inactiveUsers = usersWithLogin - activeUsers;



            return res.json({
                status: true,
                period,
                totalUsers,
                activeUsers,
                inactiveUsers,
                missingLoginUsers,
                data: results,
            });
        }

        // ----------------------------------------
        // 📌 4) YEAR (6 windows × 2 months)
        // ----------------------------------------
        if (period === "year") {
            const windows = [];

            const startDate = new Date(now);
            startDate.setFullYear(startDate.getFullYear() - 1);

            let currentStart = new Date(startDate);

            for (let i = 0; i < 6; i++) {
                const end = new Date(currentStart);
                end.setMonth(end.getMonth() + 2);

                const label = `${String(currentStart.getDate()).padStart(2, "0")}-${String(currentStart.getMonth() + 1).padStart(2, "0")}-${currentStart.getFullYear()} - ${String(end.getDate()).padStart(2, "0")}-${String(end.getMonth() + 1).padStart(2, "0")}-${end.getFullYear()}`;

                windows.push({ start: new Date(currentStart), end, label });

                currentStart = new Date(end);
                currentStart.setDate(currentStart.getDate() + 1);
            }

            windows.reverse();

            const results = windows.map((w) => ({
                label: w.label,
                count: countInRange(w.start, w.end),
            }));

            const totalUsers = await User.countDocuments({ type: "3" });

            const missingLoginUsers = await User.countDocuments({
                type: "3",
                $or: [
                    { lastLogin: { $exists: false } },
                    { lastLogin: null }
                ]
            });

            const usersWithLogin = await User.countDocuments({
                type: "3",
                lastLogin: { $exists: true, $ne: null }
            });

            const activeUsers = await User.countDocuments({
                type: "3",
                lastLogin: { $gte: startDate },
            });

            const inactiveUsers = usersWithLogin - activeUsers;


            return res.json({
                status: true,
                period,
                totalUsers,
                activeUsers,
                inactiveUsers,
                missingLoginUsers,
                data: results,
            });
        }

        return res.status(400).json({ status: false, message: "Invalid period" });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};