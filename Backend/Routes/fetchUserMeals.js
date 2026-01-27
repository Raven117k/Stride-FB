// routes/meals.js (for getting available meals)
import express from "express";
import Meal from "../Models/mealSchema.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Get all available meals (for users to choose from)
router.get("/", protect, async (req, res) => {
    try {
        const meals = await Meal.find().sort({ createdAt: -1 });
        res.json(meals);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;