import express from "express";
import User from "../Models/userSchema.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/* 🎯 GET TARGETS */
router.get("/", protect, async (req, res) => {
  const user = await User.findById(req.user.id).select("targets");
  res.json(user.targets);
});

/* 🎯 UPDATE TARGETS */
router.put("/", protect, async (req, res) => {
  const { calories, protein, carbs, fats } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { targets: { calories, protein, carbs, fats } },
    { new: true }
  );

  res.json(user.targets);
});

export default router;
