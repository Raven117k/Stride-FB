// routes/progressRoutes.js - COMPATIBLE VERSION
import express from "express";
import UserWorkout from "../Models/userWorkoutSchema.js";
import User from "../Models/userSchema.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/* 🎯 GET PROGRESS ANALYTICS */
router.get("/", protect, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user workouts - only completed ones for most calculations
    const userWorkouts = await UserWorkout.find({ 
      userId, 
      status: "completed"
    })
    .populate("exerciseId")
    .sort({ completedAt: -1, addedAt: -1, createdAt: -1 });

    // Fetch user profile for weight data and other stats
    const user = await User.findById(userId).select("weight stats createdAt");

    // Calculate stats
    const stats = calculateStats(userWorkouts, user);
    const weightData = calculateWeightData(userWorkouts, user);

    res.json({
      success: true,
      stats,
      weightData,
      userWorkouts: userWorkouts,
      lastUpdated: new Date()
    });
  } catch (err) {
    console.error("Progress route error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch progress data",
      error: err.message 
    });
  }
});

/* 🎯 HELPER FUNCTIONS */

function calculateStats(workouts, user) {
  if (!workouts.length) {
    return { 
      total: 0, 
      completed: 0, 
      streak: 0, 
      calories: 0, 
      weeklyAvg: "0.0",
      completionRate: "0%",
      lastWorkout: null
    };
  }

  const totalCompleted = workouts.length;
  
  // Calculate total calories from completed workouts
  const calories = workouts.reduce((sum, w) => {
    const workoutCalories = w.exerciseId?.calories || 
                           w.exerciseId?.estimatedCalories || 
                           w.calories || 
                           0;
    return sum + Number(workoutCalories);
  }, 0);

  // Get completion dates - use completedAt if available, otherwise use addedAt/createdAt
  const workoutDates = workouts
    .map(w => w.completedAt || w.addedAt || w.createdAt)
    .filter(date => date)
    .map(date => new Date(date));

  // Calculate streak
  const streak = calculateStreak(workoutDates);

  // Calculate weekly average
  const userJoinDate = user?.createdAt || new Date();
  const firstWorkoutDate = workoutDates.length > 0 
    ? new Date(Math.min(...workoutDates.map(d => d.getTime())))
    : new Date();
    
  const startDate = workoutDates.length > 0 ? firstWorkoutDate : userJoinDate;
  const diffMs = new Date() - startDate;
  const diffDays = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  const diffWeeks = Math.max(1, Math.ceil(diffDays / 7));
  const weeklyAvg = (totalCompleted / diffWeeks).toFixed(1);

  // Get last workout date
  const lastWorkout = workoutDates.length > 0 
    ? new Date(Math.max(...workoutDates.map(d => d.getTime())))
    : null;

  return { 
    total: totalCompleted, 
    completed: totalCompleted, 
    streak, 
    calories, 
    weeklyAvg,
    completionRate: "100%",
    lastWorkout: lastWorkout ? lastWorkout.toISOString() : null
  };
}

function calculateStreak(dates) {
  if (!dates.length) return 0;

  // Get unique dates (ignore time)
  const uniqueDates = [...new Set(
    dates.map(d => {
      const date = new Date(d);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    })
  )].sort((a, b) => b - a);

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let checkDate = new Date(today);
  
  while (uniqueDates.includes(checkDate.getTime())) {
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
    checkDate.setHours(0, 0, 0, 0);
  }

  return streak;
}

function calculateWeightData(workouts, user) {
  const weightEntries = [];

  // Add weight entries from workouts
  workouts
    .filter(w => w.weight && !isNaN(Number(w.weight)))
    .forEach(w => {
      const date = w.completedAt || w.addedAt || w.createdAt;
      weightEntries.push({
        date: new Date(date),
        weight: Number(w.weight),
        source: 'workout'
      });
    });

  // Add current weight from user profile
  if (user?.weight) {
    weightEntries.push({
      date: new Date(),
      weight: Number(user.weight),
      source: 'profile'
    });
  }

  // Sort by date
  weightEntries.sort((a, b) => a.date - b.date);

  // Handle edge cases
  if (weightEntries.length === 0) {
    weightEntries.push(
      { date: new Date(Date.now() - 86400000), weight: 70, source: 'placeholder' },
      { date: new Date(), weight: 70, source: 'placeholder' }
    );
  } else if (weightEntries.length === 1) {
    const singleEntry = weightEntries[0];
    weightEntries.unshift({
      date: new Date(singleEntry.date.getTime() - 86400000),
      weight: singleEntry.weight,
      source: 'generated'
    });
  }

  return weightEntries;
}

export default router;