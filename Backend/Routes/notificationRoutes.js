import express from "express";
import Notification from "../Models/notificationSchema.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

let io; // Will be injected from server

export const setNotificationIO = (socketIO) => {
  io = socketIO;
};

// Get user notifications
router.get("/", protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mark specific notification as read
router.put("/:id", protect, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isRead: true },
      { new: true }
    );
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mark all as read
router.put("/read-all", protect, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ message: "All marked as read" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete specific notification
router.delete("/:id", protect, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    console.log(`Deleting notification ${req.params.id} for user ${userId}`);
    const deleted = await Notification.findOneAndDelete({ _id: req.params.id, userId });
    if (!deleted) {
      return res.status(404).json({ message: "Notification not found or not yours" });
    }
    res.json({ message: "Deleted", notification: deleted });
  } catch (err) {
    console.error("Error deleting notification:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;