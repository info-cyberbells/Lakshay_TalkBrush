import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import { Room } from "../models/roomModel.js";
import Event from "../models/eventModel.js";

export const getDashboardOverview = async (req, res) => {
  try {
    const { type } = req.query;
    const now = new Date();

    const allowedTypes = ["week", "month", "year"];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid type" });
    }

    // ---------------- COMMON COUNTS ----------------
    const totalAdmins = await User.countDocuments({ type: "2" });

    let startDate, prevStartDate;

    if (type === "week") {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 7);

      prevStartDate = new Date(startDate);
      prevStartDate.setDate(prevStartDate.getDate() - 7);
    }

    if (type === "month") {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 30);

      prevStartDate = new Date(startDate);
      prevStartDate.setDate(prevStartDate.getDate() - 30);
    }

    if (type === "year") {
      startDate = new Date(now);
      startDate.setFullYear(startDate.getFullYear() - 1);

      prevStartDate = new Date(startDate);
      prevStartDate.setFullYear(prevStartDate.getFullYear() - 1);
    }

    // ---------------- ACTIVE USERS ----------------
    const totalActiveUsers = await User.countDocuments({
      type: "3",
      lastLogin: { $gte: startDate }
    });

    // ---------------- CONVERSATIONS ----------------
    const conversationsToday = await Room.countDocuments({
      created_at: {
        $gte: new Date(now.setHours(0, 0, 0, 0))
      }
    });

    // ---------------- AVERAGE CONVERSATION TIME ----------------
    const avgConversationAgg = await Room.aggregate([
      { $unwind: "$activity_log" },
      {
        $project: {
          duration: {
            $divide: [
              { $subtract: ["$activity_log.left_at", "$activity_log.joined_at"] },
              60000
            ]
          }
        }
      },
      { $match: { duration: { $gt: 0 } } },
      {
        $group: {
          _id: null,
          avgDuration: { $avg: "$duration" }
        }
      }
    ]);

    const avgConversationTime = Number(
      (avgConversationAgg[0]?.avgDuration || 0).toFixed(1)
    );

    // ---------------- PERIOD STATS ----------------
    const thisPeriod = await Room.countDocuments({
      created_at: { $gte: startDate, $lte: now }
    });

    const lastPeriod = await Room.countDocuments({
      created_at: { $gte: prevStartDate, $lt: startDate }
    });

    // ---------------- CHART DATA ----------------
    const buildChartData = async (days, points) => {
      const result = [];
      for (let i = points - 1; i >= 0; i--) {
        const start = new Date(now);
        start.setDate(start.getDate() - days * i);
        const end = new Date(start);
        end.setDate(end.getDate() + days);

        const count = await Room.countDocuments({
          created_at: { $gte: start, $lte: end }
        });

        result.push(count);
      }
      return result;
    };

    let statistics = {};

    if (type === "week") {
      statistics = {
        labels: [0, 20, 40, 60, 80, 100],
        thisWeekData: await buildChartData(1, 7),
        lastWeekData: await buildChartData(1, 7)
      };
    }

    if (type === "month") {
      statistics = {
        labels: [0, 50, 100, 150, 200, 250],
        thisWeekData: await buildChartData(7, 4),
        lastWeekData: await buildChartData(7, 4)
      };
    }

    if (type === "year") {
      statistics = {
        labels: ["Q1", "Q2", "Q3", "Q4"],
        thisWeekData: await buildChartData(30, 12),
        lastWeekData: await buildChartData(30, 12)
      };
    }

    // ---------------- IMPRESSION ----------------
    const totalRooms = await Room.countDocuments();

    const impressionChange =
      lastPeriod === 0 ? 0 : (((thisPeriod - lastPeriod) / lastPeriod) * 100).toFixed(1);

    return res.status(200).json({
      totalAdmins,
      totalActiveUsers,
      conversationsToday,
      avgConversationTime,
      stats: {
        thisPeriod,
        lastPeriod
      },
      statistics,
      impression: {
        count: totalRooms,
        change: Number(impressionChange)
      }
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};





export const getUserDashboard = async (req, res) => {
  try {
    // -------------------------------------------------
    // 🔐 READ TOKEN FROM COOKIE
    // -------------------------------------------------
    const token = req.cookies?.authToken || req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const userId = decoded.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const now = new Date();

    // -------------------------------------------------
    // 👤 USER INFO
    // -------------------------------------------------
    const user = await User.findById(userId).select(
      "fullName lastLogin createdAt"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // -------------------------------------------------
    // 🏠 ROOM STATS (USER JOINED ROOMS)
    // -------------------------------------------------
    const totalRooms = await Room.countDocuments({
      activity_log: {
        $elemMatch: { user_id: userId.toString() }
      }
    });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const roomsToday = await Room.countDocuments({
      activity_log: {
        $elemMatch: {
          user_id: userId.toString(),
          joined_at: { $gte: todayStart }
        }
      }
    });

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const roomsLast7Days = await Room.countDocuments({
      activity_log: {
        $elemMatch: {
          user_id: userId.toString(),
          joined_at: { $gte: last7Days }
        }
      }
    });

    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const roomsLast30Days = await Room.countDocuments({
      activity_log: {
        $elemMatch: {
          user_id: userId.toString(),
          joined_at: { $gte: last30Days }
        }
      }
    });

    // -------------------------------------------------
    // 📊 CHART DATA (LAST 7 USER ACTIVITIES – NOT CALENDAR)
    // -------------------------------------------------
    const activityAggregation = await Room.aggregate([
      { $unwind: "$activity_log" },
      {
        $match: {
          "activity_log.user_id": userId.toString()
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$activity_log.joined_at"
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 7 },
      { $sort: { _id: 1 } }
    ]);

    const chartData = activityAggregation.map(item => item.count);

    // -------------------------------------------------
    // 📅 FUTURE EVENTS ONLY
    // -------------------------------------------------
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalUpcomingEvents = await Event.countDocuments({
      date: { $gte: today }
    });

    const upcomingEventsList = await Event.find({
      date: { $gte: today }
    })
      .sort({ date: 1 })
      .limit(5)
      .select("fullName date time");

    // -------------------------------------------------
    // ⏱️ ACCOUNT META
    // -------------------------------------------------
    const accountAgeDays = Math.floor(
      (now - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)
    );

    const lastActiveDaysAgo = user.lastLogin
      ? Math.floor(
          (now - new Date(user.lastLogin)) / (1000 * 60 * 60 * 24)
        )
      : null;

    // -------------------------------------------------
    // ✅ FINAL RESPONSE
    // -------------------------------------------------
    return res.status(200).json({
      user: {
        name: user.fullName,
        lastLogin: user.lastLogin
      },
      stats: {
        totalRooms,
        roomsToday,
        roomsLast7Days,
        roomsLast30Days,
        accountAgeDays,
        lastActiveDaysAgo
      },
      events: {
        totalUpcomingEvents,
        upcomingEventsList
      },
      chartData
    });

  } catch (error) {
    console.error("User Dashboard Error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};