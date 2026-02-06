// routes/userMeals.js
import express from "express";
import UserMeal from "../Models/userMealSchema.js";
import Meal from "../Models/mealSchema.js";
import { protect } from "../middleware/auth.js";
import { sendAlert } from "./system/createNotification.js";

const router = express.Router();

// Get user's meals (only for today, no date filtering)
router.get("/", protect, async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        
        const userMeals = await UserMeal.find({
            userId: req.user.id,
            date: today
        }).populate('mealId');
        
        res.json(userMeals);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a meal to user's plan
router.post("/", protect, async (req, res) => {
    try {
        const { mealId, type } = req.body;
        const today = new Date().toISOString().split('T')[0];
        
        // Check if meal exists
        const meal = await Meal.findById(mealId);
        if (!meal) {
            return res.status(404).json({ error: "Meal not found" });
        }
        
        const userMeal = new UserMeal({
            userId: req.user.id,
            mealId,
            date: today,
            type: type || meal.type,
            isDone: false
        });
        
        await userMeal.save();
        await userMeal.populate('mealId');
        
        res.json(userMeal);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update meal status (mark as done/undone)
router.put("/:id", protect, async (req, res) => {
    try {
        const { isDone, completedAt } = req.body;
        
        const userMeal = await UserMeal.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user.id
            },
            {
                isDone,
                completedAt: isDone ? (completedAt || new Date()) : null
            },
            { new: true }
        ).populate('mealId');
        
        if (!userMeal) {
            return res.status(404).json({ error: "User meal not found" });
        }
        
        // If user marked the meal as done, send a notification
        if (isDone) {
            try {
                const mealName = userMeal?.mealId?.name || 'your meal';
                await sendAlert(
                    req.io,
                    req.user.id,
                    "🍽️ Meal Completed",
                    `You've logged ${mealName}. Great job!`,
                    "reminder"
                );
            } catch (err) {
                console.error("Failed to send meal notification", err);
            }
        }

        res.json(userMeal);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Remove meal from user's plan
router.delete("/:id", protect, async (req, res) => {
    try {
        const userMeal = await UserMeal.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });
        
        if (!userMeal) {
            return res.status(404).json({ error: "User meal not found" });
        }
        
        res.json({ message: "Meal removed from plan" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;