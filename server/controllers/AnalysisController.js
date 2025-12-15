
import { User } from "../models/userModel.js";
import { Room } from "../models/RoomModel.js";

const countInRange = async (start, end) => {
    return await Room.countDocuments({
        created_at: {
            $gte: start,
            $lte: end
        }
    });
};

const getUserStats = async (startDate, endDate) => {
    const totalUsers = await User.countDocuments({ type: "3" });

    const missingLoginUsers = await User.countDocuments({
        type: "3",
        $or: [
            { lastLogin: { $exists: false } },
            { lastLogin: null }
        ]
    });

    const activeUsers = await User.countDocuments({
        type: "3",
        lastLogin: {
            $gte: startDate,
            $lte: endDate
        }
    });

    const inactiveUsers = totalUsers - activeUsers - missingLoginUsers;

    return {
        totalUsers,
        activeUsers,
        inactiveUsers,
        missingLoginUsers
    };
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
            }

            windows.reverse();

            const results = await Promise.all(
                windows.map(async (w) => ({
                    label: w.label,
                    count: await countInRange(w.start, w.end),
                }))
            );

            const userStats = await getUserStats(startDate, now);

            return res.json({
                status: true,
                period,
                ...userStats,
                data: results
            });

        }

        // ----------------------------------------
        // 📌 2) WEEK (daily)
        // ----------------------------------------
        if (period === "week") {
            const startDate = new Date(now);
            startDate.setDate(startDate.getDate() - 6);
            startDate.setHours(0, 0, 0, 0);

            const windows = [];

            for (let i = 0; i < 7; i++) {
                const dayStart = new Date(startDate);
                dayStart.setDate(startDate.getDate() + i);

                const dayEnd = new Date(dayStart);
                dayEnd.setHours(23, 59, 59, 999);

                const label = `${dayStart.getDate()}/${dayStart.getMonth() + 1}`;

                windows.push({ start: dayStart, end: dayEnd, label });
            }

            const results = await Promise.all(
                windows.map(async (w) => ({
                    label: w.label,
                    count: await countInRange(w.start, w.end),
                }))
            );

            results.reverse();

            const userStats = await getUserStats(startDate, now);

            return res.json({
                status: true,
                period,
                ...userStats,
                data: results
            });


        }


        // ----------------------------------------
        // 📌 3) MONTH (6 windows × 5 days)
        // ----------------------------------------
        if (period === "month") {
            const startDate = new Date(now);
            startDate.setDate(startDate.getDate() - 29);
            startDate.setHours(0, 0, 0, 0);

            const windows = [];
            let currentStart = new Date(startDate);

            for (let i = 0; i < 6 && currentStart < now; i++) {
                const end = new Date(currentStart);
                end.setDate(end.getDate() + 4);
                end.setHours(23, 59, 59, 999);

                const label = `${currentStart.getDate()}-${currentStart.getMonth() + 1} to ${end.getDate()}-${end.getMonth() + 1}`;

                windows.push({ start: new Date(currentStart), end, label });

                currentStart.setDate(currentStart.getDate() + 5);
            }

            windows.reverse();

            const results = await Promise.all(
                windows.map(async (w) => ({
                    label: w.label,
                    count: await countInRange(w.start, w.end),
                }))
            );

            const userStats = await getUserStats(startDate, now);

            return res.json({
                status: true,
                period,
                ...userStats,
                data: results
            });
        }


        // ----------------------------------------
        // 📌 4) YEAR (6 windows × 2 months)
        // ----------------------------------------
        if (period === "year") {
            const windows = [];

            let currentStart = new Date(now);
            currentStart.setFullYear(currentStart.getFullYear() - 1);
            currentStart.setHours(0, 0, 0, 0);

            for (let i = 0; i < 6 && currentStart < now; i++) {
                let end = new Date(currentStart);
                end.setMonth(end.getMonth() + 2);

                if (end > now) end = new Date(now);
                end.setHours(23, 59, 59, 999);

                const label = `${currentStart.getDate()}-${currentStart.getMonth() + 1}-${currentStart.getFullYear()} - ${end.getDate()}-${end.getMonth() + 1}-${end.getFullYear()}`;

                windows.push({ start: new Date(currentStart), end, label });

                currentStart = new Date(end);
                currentStart.setDate(currentStart.getDate() + 1);
            }

            windows.reverse();

            const results = await Promise.all(
                windows.map(async (w) => ({
                    label: w.label,
                    count: await countInRange(w.start, w.end),
                }))
            );

            const startDate = new Date(now);
            startDate.setFullYear(startDate.getFullYear() - 1);

            const userStats = await getUserStats(startDate, now);

            return res.json({
                status: true,
                period,
                ...userStats,
                data: results
            });
        }


        return res.status(400).json({ status: false, message: "Invalid period" });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};