import express from "express";
import UserWorkout from "../Models/userWorkoutSchema.js";

const router = express.Router();

// 1. Get user's current workout plan
router.get("/:userId", async (req, res) => {
  try {
    const plan = await UserWorkout.find({ userId: req.params.userId })
      .populate("exerciseId")
      .sort({ addedAt: -1 });

    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. Add exercise to user's plan
router.post("/add", async (req, res) => {
  try {
    const { userId, exerciseId } = req.body;

    const newEntry = new UserWorkout({ userId, exerciseId });
    await newEntry.save();

    const populated = await newEntry.populate("exerciseId");
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. Toggle status
router.patch("/toggle/:id", async (req, res) => {
  try {
    const item = await UserWorkout.findById(req.params.id);

    item.status =
      item.status === "completed" ? "pending" : "completed";

    await item.save();
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 4. Remove workout
router.delete("/remove/:id", async (req, res) => {
  try {
    await UserWorkout.findByIdAndDelete(req.params.id);
    res.json({ message: "Removed from plan" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
