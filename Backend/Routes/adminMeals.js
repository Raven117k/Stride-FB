import express from "express";
import Meal from "../Models/mealSchema.js";
import multer from "multer";
import { protect, admin } from "../middleware/auth.js";// <-- your auth middleware

const router = express.Router();

// storage for meal images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/meals");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage });

// Get all meals
router.get("/meals", protect, admin, async (req, res) => {
    const meals = await Meal.find().sort({ date: -1 });
    res.json(meals);
});

// Add new meal
router.post("/meals", protect, admin, upload.single("image"), async (req, res) => {
    try {
        const { name, type, date, time, calories, protein, carbs, fats } = req.body;
        const image = req.file ? `/uploads/meals/${req.file.filename}` : null;

        // ✅ Use current admin user ID
        const adminId = req.user._id;

        const meal = await Meal.create({
            userId: adminId,
            date,
            type,
            time,
            foods: [
                {
                    name,
                    calories: parseInt(calories),
                    protein: parseInt(protein),
                    carbs: parseInt(carbs),
                    fats: parseInt(fats),
                },
            ],
            image,
        });

        res.status(201).json(meal);
    } catch (error) {
        console.error("Error creating admin meal:", error);
        res.status(500).json({ message: "Failed to create meal", error: error.message });
    }
});

// Update meal
router.put("/meals/:id", protect, admin, upload.single("image"), async (req, res) => {
    try {
        const { name, type, date, time, calories, protein, carbs, fats } = req.body;
        const meal = await Meal.findById(req.params.id);

        if (!meal) return res.status(404).json({ message: "Meal not found" });

        // Update foods (assuming single food for simplicity)
        meal.foods[0].name = name;
        meal.foods[0].calories = parseInt(calories);
        meal.foods[0].protein = parseInt(protein);
        meal.foods[0].carbs = parseInt(carbs);
        meal.foods[0].fats = parseInt(fats);

        meal.type = type;
        meal.date = date;
        meal.time = time;

        if (req.file) {
            meal.image = `/uploads/meals/${req.file.filename}`;
        }

        const updatedMeal = await meal.save();
        res.json(updatedMeal);
    } catch (error) {
        console.error("Error updating meal:", error);
        res.status(500).json({ message: "Failed to update meal", error: error.message });
    }
});

// Delete meal
router.delete("/meals/:id", protect, admin, async (req, res) => {
    try {
        const meal = await Meal.findById(req.params.id);
        if (!meal) return res.status(404).json({ message: "Meal not found" });

        await meal.deleteOne();
        res.json({ message: "Meal deleted successfully" });
    } catch (error) {
        console.error("Error deleting meal:", error);
        res.status(500).json({ message: "Failed to delete meal" });
    }
});



export default router;
