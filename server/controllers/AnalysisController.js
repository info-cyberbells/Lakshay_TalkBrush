// import Analysis from "../models/AnalysisModel.js";
import { User } from "../models/userModel.js";


const mockAnalysisData = [
    {
        type: 3,
        duration: 282,
        createdAt: "2025-01-17T04:32:11.120Z",
        updatedAt: "2025-01-17T04:38:22.120Z",
        __v: 0
    },
    {
        type: 3,
        duration: 198,
        createdAt: "2025-02-05T09:15:44.228Z",
        updatedAt: "2025-02-05T09:18:02.228Z",
        __v: 0
    },
    {
        type: 3,
        duration: 421,
        createdAt: "2024-12-29T14:21:32.772Z",
        updatedAt: "2024-12-29T14:27:10.772Z",
        __v: 0
    },
    {
        type: 3,
        duration: 110,
        createdAt: "2024-11-14T18:41:01.993Z",
        updatedAt: "2024-11-14T18:45:30.993Z",
        __v: 0
    },
    {
        type: 3,
        duration: 355,
        createdAt: "2024-10-08T06:14:44.901Z",
        updatedAt: "2024-10-08T06:21:11.901Z",
        __v: 0
    },
    {
        type: 3,
        duration: 291,
        createdAt: "2024-09-20T10:55:17.633Z",
        updatedAt: "2024-09-20T10:59:40.633Z",
        __v: 0
    },
    {
        type: 3,
        duration: 78,
        createdAt: "2024-09-05T23:31:52.441Z",
        updatedAt: "2024-09-05T23:35:02.441Z",
        __v: 0
    },
    {
        type: 3,
        duration: 302,
        createdAt: "2024-08-15T15:12:21.441Z",
        updatedAt: "2024-08-15T15:18:59.441Z",
        __v: 0
    },
    {
        type: 3,
        duration: 487,
        createdAt: "2024-08-03T08:45:12.244Z",
        updatedAt: "2024-08-03T08:53:02.244Z",
        __v: 0
    },
    {
        type: 3,
        duration: 134,
        createdAt: "2024-07-09T19:21:34.900Z",
        updatedAt: "2024-07-09T19:26:01.900Z",
        __v: 0
    },
    {
        type: 3,
        duration: 402,
        createdAt: "2024-06-28T22:19:41.511Z",
        updatedAt: "2024-06-28T22:27:02.511Z",
        __v: 0
    },
    {
        type: 3,
        duration: 244,
        createdAt: "2024-06-11T04:32:18.992Z",
        updatedAt: "2024-06-11T04:36:12.992Z",
        __v: 0
    },
    {
        type: 3,
        duration: 311,
        createdAt: "2024-05-17T13:05:11.201Z",
        updatedAt: "2024-05-17T13:11:01.201Z",
        __v: 0
    },
    {
        type: 3,
        duration: 165,
        createdAt: "2024-04-30T17:19:28.700Z",
        updatedAt: "2024-04-30T17:23:31.700Z",
        __v: 0
    },
    {
        type: 3,
        duration: 350,
        createdAt: "2024-04-12T21:44:58.122Z",
        updatedAt: "2024-04-12T21:51:00.122Z",
        __v: 0
    },
    {
        type: 3,
        duration: 89,
        createdAt: "2024-03-29T11:25:44.510Z",
        updatedAt: "2024-03-29T11:29:01.510Z",
        __v: 0
    },
    {
        type: 3,
        duration: 415,
        createdAt: "2024-03-09T06:22:41.882Z",
        updatedAt: "2024-03-09T06:30:12.882Z",
        __v: 0
    },
    {
        type: 3,
        duration: 102,
        createdAt: "2024-02-25T09:55:02.441Z",
        updatedAt: "2024-02-25T09:59:10.441Z",
        __v: 0
    },
    {
        type: 3,
        duration: 366,
        createdAt: "2024-02-14T14:41:51.221Z",
        updatedAt: "2024-02-14T14:48:00.221Z",
        __v: 0
    },
    {
        type: 3,
        duration: 288,
        createdAt: "2024-02-01T22:35:29.002Z",
        updatedAt: "2024-02-01T22:39:31.002Z",
        __v: 0
    },
    {
        type: 3,
        duration: 366,
        createdAt: "2025-11-20T22:41:51.221Z",
        updatedAt: "2025-11-14T14:48:00.221Z",
        __v: 0
    },
    {
        type: 3,
        duration: 288,
        createdAt: "2025-11-20T22:35:29.002Z",
        updatedAt: "2025-11-01T22:39:31.002Z",
        __v: 0
    },
    {
        type: 3,
        duration: 366,
        createdAt: "2025-11-16T22:41:51.221Z",
        updatedAt: "2025-11-16T14:48:00.221Z",
        __v: 0
    },
    {
        type: 3,
        duration: 288,
        createdAt: "2025-11-16T22:35:29.002Z",
        updatedAt: "2025-11-16T22:39:31.002Z",
        __v: 0
    }
];

// while (mockAnalysisData.length < 50) {
//   const daysAgo = Math.floor(Math.random() * 365);
//   const created = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

//   mockAnalysisData.push({
//     type: 3,
//     duration: Math.floor(Math.random() * 480) + 20,
//     createdAt: created.toISOString(),
//     updatedAt: new Date(created.getTime() + 5 * 60 * 1000).toISOString(),
//     __v: 0
//   });
// }

const countInRange = (start, end) =>
    mockAnalysisData.filter(
        (d) =>
            new Date(d.createdAt) >= new Date(start) &&
            new Date(d.createdAt) <= new Date(end)
    ).length;



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
            const activeUsers = await User.countDocuments({
                type: "3",
                lastLogin: { $gte: startDate },
            });
            const inactiveUsers = await User.countDocuments({
                type: "3",
                $or: [{ lastLogin: { $lt: startDate } }],
            });

            return res.json({
                status: true,
                period,
                totalUsers,
                activeUsers,
                inactiveUsers,
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
            const activeUsers = await User.countDocuments({
                type: "3",
                lastLogin: { $gte: startDate },
            });
            const inactiveUsers = await User.countDocuments({
                type: "3",
                $or: [{ lastLogin: { $lt: startDate } }],
            });

            return res.json({
                status: true,
                period,
                totalUsers,
                activeUsers,
                inactiveUsers,
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
            const activeUsers = await User.countDocuments({
                type: "3",
                lastLogin: { $gte: startDate },
            });
            const inactiveUsers = await User.countDocuments({
                type: "3",
                $or: [{ lastLogin: { $lt: startDate } }],
            });

            return res.json({
                status: true,
                period,
                totalUsers,
                activeUsers,
                inactiveUsers,
                data: results,
            });
        }

        // ----------------------------------------
        // 📌 4) YEAR (6 windows × 2 months)
        // ----------------------------------------
        if (period === "year") {
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const windows = [];

            const startDate = new Date(now);
            startDate.setFullYear(startDate.getFullYear() - 1);

            let currentStart = new Date(startDate);

            for (let i = 0; i < 6; i++) {
                const end = new Date(currentStart);
                end.setMonth(end.getMonth() + 2);

                const label = `${currentStart.getDate()}-${monthNames[currentStart.getMonth()]}-${String(currentStart.getFullYear()).slice(2)} to ${end.getDate()}-${monthNames[end.getMonth()]}-${String(end.getFullYear()).slice(2)}`;

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
            const activeUsers = await User.countDocuments({
                type: "3",
                lastLogin: { $gte: startDate },
            });
            const inactiveUsers = await User.countDocuments({
                type: "3",
                $or: [{ lastLogin: { $lt: startDate } }],
            });

            return res.json({
                status: true,
                period,
                totalUsers,
                activeUsers,
                inactiveUsers,
                data: results,
            });
        }

        return res.status(400).json({ status: false, message: "Invalid period" });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};