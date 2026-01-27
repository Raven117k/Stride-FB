import express from "express";
import Meal from "../Models/mealSchema";

const router = express.Router();

/* 📅 GET DAILY MEALS + TOTALS */
router.get("/:userId/:date", async (req, res) => {
  try {
    const { userId, date } = req.params;

    const meals = await Meal.find({
      userId,
      date: new Date(date),
    });

    const dailyTotals = meals.reduce(
      (acc, meal) => {
        acc.calories += meal.totals.calories;
        acc.protein += meal.totals.protein;
        acc.carbs += meal.totals.carbs;
        acc.fats += meal.totals.fats;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );

    res.json({ meals, dailyTotals });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ➕ ADD FOOD TO MEAL */
router.post("/add-food", async (req, res) => {
  try {
    const { mealId, food } = req.body;

    const meal = await Meal.findById(mealId);
    if (!meal) return res.status(404).json({ message: "Meal not found" });

    meal.foods.push(food);
    await meal.save();

    res.json(meal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* 🍽️ CREATE MEAL */
router.post("/create", async (req, res) => {
  try {
    const meal = await Meal.create(req.body);
    res.status(201).json(meal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
