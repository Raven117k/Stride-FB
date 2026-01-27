import express from "express";
import User from "../Models/userSchema.js";
import { protect } from "../middleware/auth.js";
import bcrypt from "bcryptjs";
import { uploadAvatar } from "../middleware/upload.js";

const router = express.Router();

/**
 * ======================
 * GET current user
 * ======================
 */
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * ======================
 * UPDATE current user
 * ======================
 */
router.put("/me", protect, async (req, res) => {
  try {
    const { password, preferences, notifications, ...otherUpdates } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Update flat fields
    for (const key in otherUpdates) {
      if (otherUpdates[key] !== undefined) user[key] = otherUpdates[key];
    }

    // Update nested objects safely
    if (preferences) user.preferences = { ...user.preferences, ...preferences };
    if (notifications) user.notifications = { ...user.notifications, ...notifications };

    // Update password if provided and not masked
    if (password && password !== "********" && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    // Prepare response (without password)
    const updatedUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      location: user.location,
      age: user.age,
      weight: user.weight,
      height: user.height,
      preferences: user.preferences,
      notifications: user.notifications,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.json({ success: true, message: "User updated successfully", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update user" });
  }
});

/**
 * ======================
 * UPDATE avatar
 * ======================
 */
router.put(
  "/me/avatar",
  protect,
  uploadAvatar.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
      }

      const user = await User.findById(req.user.id);
      user.avatar = `/uploads/avatars/${req.file.filename}`;
      await user.save();

      res.json({
        success: true,
        message: "Avatar updated",
        avatar: user.avatar,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

/**
 * ======================
 * DELETE current user
 * ======================
 */
router.delete("/me", protect, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ success: true, message: "Account deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
