import express from "express";
import User from "../models/User.js"; // Import your User model
import { authenticateToken, isAdmin } from "../middleware/auth.js"; // Import middlewares individually
import bcrypt from "bcrypt";

const router = express.Router();

// Change user role endpoint
router.put("/:id/role", authenticateToken, isAdmin, async (req, res) => {
  const { role } = req.body; // Get new role from request body

  if (!["admin", "user", "template_creator"].includes(role)) {
    return res.status(400).json({ message: "Invalid role specified." });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true } // Return the updated user
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User role updated successfully!", user });
  } catch (err) {
    console.error("Error changing user role:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// Get user profile (protected route)
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile (protected route)
router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const updates = req.body; // Get update data from request body
    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete user account (protected route)
router.delete("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json({ message: "User account deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users (admin route)
router.get("/", authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user by ID (admin route)
router.get("/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Change password (protected route)
router.put("/change-password", authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    // Check if the current password matches
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Current password is incorrect." });
    }

    // Hash and update the password
    const hashedPassword = await bcrypt.hash(newPassword, 10); // 10 is the salt rounds
    user.password = hashedPassword;
    await user.save();
    res.json({ message: "Password updated successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete user by ID (admin route)
router.delete("/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json({ message: "User deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
