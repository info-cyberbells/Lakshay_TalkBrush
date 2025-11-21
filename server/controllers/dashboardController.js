import { User } from "../models/userModel.js";

export const getDashboardOverview = async (req, res) => {
  try {
    const { type } = req.query;

    // Allowed types
    const allowedTypes = ["week", "month", "year"];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        message: "Invalid type. Use week, month, or year."
      });
    }

    // Helper → Active users
    const getActiveUsers = async (days) => {
      const activeSince = new Date();
      activeSince.setDate(activeSince.getDate() - days);

      return await User.countDocuments({
        type: "3",
        lastLogin: { $exists: true, $ne: null }
      });
    };

    const totalAdmins = await User.countDocuments({ type: "2" });

    // Default response structure
    let responseData = {
      totalAdmins,
      statistics: {},
      impression: {}
    };

    // -------------------- WEEK --------------------
    if (type === "week") {
      responseData.totalActiveUsers = await getActiveUsers(7);
      responseData.conversationsToday = 12;
      responseData.avgConversationTime = 5.8;

      responseData.stats = {
        thisPeriod: 20,
        lastPeriod: 13
      };

      responseData.statistics = {
        labels: [0, 20, 40, 60, 80, 100],
        thisWeekData: [4, 3, 5, 7, 6, 8, 10],
        lastWeekData: [3, 4, 6, 5, 7, 6, 8]
      };

      responseData.impression = {
        count: 12345,
        change: -5.4
      };
    }

    // -------------------- MONTH --------------------
    if (type === "month") {
      responseData.totalActiveUsers = await getActiveUsers(30);
      responseData.conversationsToday = 42;
      responseData.avgConversationTime = 6.2;

      responseData.stats = {
        thisPeriod: 78,
        lastPeriod: 69
      };

      responseData.statistics = {
        labels: [0, 50, 100, 150, 200, 250],
        thisWeekData: [10, 12, 14, 18],
        lastWeekData: [8, 11, 12, 13]
      };

      responseData.impression = {
        count: 54321,
        change: 3.1
      };
    }

    // -------------------- YEAR --------------------
    if (type === "year") {
      responseData.totalActiveUsers = await getActiveUsers(365);
      responseData.conversationsToday = 110;
      responseData.avgConversationTime = 7.1;

      responseData.stats = {
        thisPeriod: 450,
        lastPeriod: 380
      };

      responseData.statistics = {
        labels: ["Q1", "Q2", "Q3", "Q4"],
        thisWeekData: [100, 120, 140, 160, 180, 155, 142, 160, 190, 210, 220, 230],
        lastWeekData: [80, 110, 130, 150, 120, 130, 130, 155, 170, 182, 195, 200]
      };

      responseData.impression = {
        count: 98765,
        change: 12.7
      };
    }

    return res.status(200).json(responseData);

  } catch (error) {
    console.error("Dashboard Error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};
