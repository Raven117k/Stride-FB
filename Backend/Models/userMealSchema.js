import mongoose from "mongoose";

const userMealSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  mealId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Meal",
    required: true,
  },

  date: {
    type: String, // YYYY-MM-DD
    required: true,
  },

  type: {
    type: String,
    enum: ["breakfast", "lunch", "dinner", "snacks"],
    required: true,
  },

  isDone: {
    type: Boolean,
    default: false,
  },

  completedAt: Date,
}, { timestamps: true });

export default mongoose.model("UserMeal", userMealSchema);