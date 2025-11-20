import { User } from "../models/userModel.js";

export const getDashboardOverview = async (req, res) => {
  try {
    // 1️⃣ Total Admins (type = "2")
    const totalAdmins = await User.countDocuments({ type: "2" });

    // 2️⃣ Total Active Users (logged in within last 7 days)
    const activeSince = new Date();
    activeSince.setDate(activeSince.getDate() - 7);
    const totalActiveUsers = await User.countDocuments({
      type: "3", 
      lastLogin: { $gte: activeSince },
    });

    // 3️⃣ Dummy data for Conversations
    const conversationsToday = 12; // hardcoded for now
    const avgConversationTime = 5.8; // in minutes (hardcoded)

    // 4️⃣ Dummy weekly data
    const weekly = {
      thisWeek: 20,
      lastWeek: 13,
    };

    // 5️⃣ Dummy statistics
    const statistics = {
      labels: [0, 20, 40, 60, 80, 100, 120],
      thisWeekData: [4, 3, 5, 7, 6, 8, 9],
      lastWeekData: [3, 4, 6, 5, 7, 6, 8],
    };

    // 6️⃣ Dummy impression data
    const impression = {
      count: 12345,
      change: -5.4,
    };

    // ✅ Response
    res.status(200).json({
      totalAdmins,
      totalActiveUsers,
      conversationsToday,
      avgConversationTime,
      weekly,
      statistics,
      impression,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};