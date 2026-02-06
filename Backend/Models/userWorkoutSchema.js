// Models/userWorkoutSchema.js - SIMPLE VERSION
import mongoose from "mongoose";

const userWorkoutSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  exerciseId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },
  completedAt: {
    type: Date,
    default: null,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true // This adds createdAt and updatedAt automatically
});

const UserWorkout = mongoose.model("UserWorkout", userWorkoutSchema);
export default UserWorkout;