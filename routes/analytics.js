// routes/analytics.js
import express from "express";
import User from "../models/User.js"; // Import the User model

const router = express.Router();

// Function to fetch analytics data
const getAnalyticsData = async () => {
  // Get total users
  const totalUsers = await User.countDocuments();

  // Get active and inactive users
  const activeUsers = await User.countDocuments({ isActive: true });
  const inactiveUsers = await User.countDocuments({ isActive: false });

  // Fetch user activity
  const userActivity = await User.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, // Group by date
        activeUsers: { $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] } },
        inactiveUsers: {
          $sum: { $cond: [{ $eq: ["$isActive", false] }, 1, 0] },
        },
      },
    },
    {
      $project: {
        date: "$_id",
        activeUsers: "$activeUsers",
        inactiveUsers: "$inactiveUsers",
        _id: 0, // Exclude the default MongoDB _id field
      },
    },
    { $sort: { date: 1 } }, // Sort by date
  ]);

  return {
    totalUsers,
    activeUsers,
    inactiveUsers,
    userActivity,
  };
};

// Define the analytics endpoint
router.get("/", async (req, res) => {
  try {
    const analyticsData = await getAnalyticsData();
    res.json(analyticsData);
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    res.status(500).json({ message: "Error fetching analytics data" });
  }
});

export default router;
