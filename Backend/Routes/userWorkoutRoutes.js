// routes/userWorkoutRoutes.js - FIXED VERSION (No Exercise model)
import express from "express";
import mongoose from "mongoose";
import UserWorkout from "../Models/userWorkoutSchema.js";
import { sendAlert } from "./system/createNotification.js";

const router = express.Router();

// Helper function to validate ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// 1. Get user's current workout plan
router.get("/:userId", async (req, res) => {
  try {
    if (!isValidObjectId(req.params.userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const plan = await UserWorkout.find({ userId: req.params.userId })
      .sort({ addedAt: -1 });

    res.json(plan);
  } catch (err) {
    console.error("Error fetching workouts:", err);
    res.status(500).json({ message: err.message });
  }
});

// 2. Add exercise to user's plan - SIMPLIFIED (No Exercise checks)
router.post("/add", async (req, res) => {
  try {
    console.log("Add workout request body:", req.body);

    const { userId, exerciseId } = req.body;

    // Basic validation
    if (!userId || !exerciseId) {
      return res.status(400).json({ 
        message: "userId and exerciseId are required" 
      });
    }

    // Check if workout already exists (simple check without date restriction)
    const existingWorkout = await UserWorkout.findOne({
      userId,
      exerciseId,
      status: "pending"
    });

    if (existingWorkout) {
      return res.status(409).json({ 
        message: "This exercise is already in your plan" 
      });
    }

    // Create workout
    const workoutData = {
      userId,
      exerciseId,
      status: "pending",
      completedAt: null,
      addedAt: new Date()
    };

    console.log("Creating workout with data:", workoutData);

    // Create the workout
    const newWorkout = await UserWorkout.create(workoutData);
    
    console.log("Workout created successfully:", newWorkout._id);

    res.status(201).json(newWorkout);
  } catch (err) {
    console.error("Error adding workout:", err);
    
    // More specific error handling
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ 
        message: "Validation error", 
        errors 
      });
    }

    if (err.code === 11000) {
      return res.status(400).json({ 
        message: "Duplicate entry found" 
      });
    }

    res.status(500).json({ 
      message: "Failed to add workout",
      error: err.message 
    });
  }
});

// 3. Toggle status - SIMPLIFIED
router.patch("/toggle/:id", async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid workout ID" });
    }

    const workout = await UserWorkout.findById(req.params.id);
    
    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    // Toggle status and set completedAt manually
    const newStatus = workout.status === "pending" ? "completed" : "pending";
    const completedAt = newStatus === "completed" ? new Date() : null;

    const updatedWorkout = await UserWorkout.findByIdAndUpdate(
      req.params.id,
      {
        status: newStatus,
        completedAt: completedAt
      },
      { new: true }
    );

    // If workout was just completed, send a notification to the user
    if (newStatus === "completed") {
      try {
        await sendAlert(
          req.io,
          updatedWorkout.userId,
          "🎉 Workout Complete!",
          `Great job — you completed your workout!`,
          "achievement"
        );
      } catch (err) {
        console.error("Failed to send workout notification", err);
      }
    }

    res.json(updatedWorkout);
  } catch (err) {
    console.error("Error toggling workout:", err);
    res.status(400).json({ message: err.message });
  }
});

// 4. Remove workout
router.delete("/remove/:id", async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid workout ID" });
    }

    const result = await UserWorkout.findByIdAndDelete(req.params.id);
    
    if (!result) {
      return res.status(404).json({ message: "Workout not found" });
    }
    
    res.json({ message: "Removed from plan" });
  } catch (err) {
    console.error("Error removing workout:", err);
    res.status(400).json({ message: err.message });
  }
});

export default router;