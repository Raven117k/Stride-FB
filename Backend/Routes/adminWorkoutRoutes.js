import express from "express";
import Workout from "../Models/workoutSchema.js";
import multer from 'multer';
import path from 'path';

const router = express.Router();

// SIMPLIFIED: Manual ID generator (no Counter schema needed)
let nextExerciseId = 1001; // Start from EX1001

const getNextExerciseId = () => {
    const id = `EX${nextExerciseId}`;
    nextExerciseId++;
    return id;
};

// Storage setup (uploads to local /uploads folder)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/workouts/');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    }
});

const upload = multer({ storage });

router.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    // Return the URL path
    res.json({ imageUrl: `http://localhost:5000/${req.file.path}` });
});

// GET workouts
router.get("/", async (req, res) => {
    try {
        const { page = 1, limit = 10, tag, difficulty, search } = req.query;
        const filters = {};

        if (tag && tag !== "All") filters.tag = tag;
        if (difficulty && difficulty !== "All") filters.difficulty = difficulty;
        if (search) {
            filters.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { tag: { $regex: search, $options: "i" } },
                { exerciseId: { $regex: search, $options: "i" } }
            ];
        }

        const workouts = await Workout.find(filters)
            .sort({ exerciseId: 1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Workout.countDocuments(filters);

        res.json({
            workouts,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit)
        });
    } catch (err) {
        console.error("Error fetching workouts:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// CREATE workout
router.post("/", async (req, res) => {
    try {
        // Generate exercise ID
        const exerciseId = getNextExerciseId();

        const workoutData = {
            ...req.body,
            exerciseId,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Basic validation
        if (!workoutData.title || !workoutData.description || !workoutData.tag ||
            !workoutData.difficulty || !workoutData.sets || !workoutData.reps) {
            return res.status(400).json({ message: "All required fields must be filled" });
        }

        const workout = new Workout(workoutData);
        await workout.save();

        res.status(201).json(workout);
    } catch (err) {
        console.error("Error creating workout:", err);

        if (err.code === 11000) {
            return res.status(400).json({
                message: "Exercise ID already exists. Please try again."
            });
        }

        if (err.name === 'ValidationError') {
            return res.status(400).json({
                message: "Validation failed",
                error: err.message
            });
        }

        res.status(400).json({
            message: "Error creating exercise"
        });
    }
});

// UPDATE workout
router.put("/:id", async (req, res) => {
    try {
        // Don't allow exerciseId to be changed
        const { exerciseId, ...updateData } = req.body;

        // Add updated timestamp
        updateData.updatedAt = new Date();

        const workout = await Workout.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!workout) {
            return res.status(404).json({ message: "Workout not found" });
        }

        res.json(workout);
    } catch (err) {
        console.error("Error updating workout:", err);
        res.status(400).json({
            message: "Error updating exercise"
        });
    }
});

// DELETE workout
router.delete("/:id", async (req, res) => {
    try {
        const workout = await Workout.findByIdAndDelete(req.params.id);

        if (!workout) {
            return res.status(404).json({ message: "Workout not found" });
        }

        res.json({
            message: "Workout deleted successfully",
            deletedExerciseId: workout.exerciseId
        });
    } catch (err) {
        console.error("Error deleting workout:", err);
        res.status(400).json({
            message: "Error deleting exercise"
        });
    }
});

// GET single workout
router.get("/:id", async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);

        if (!workout) {
            return res.status(404).json({ message: "Workout not found" });
        }

        res.json(workout);
    } catch (err) {
        console.error("Error fetching workout:", err);
        res.status(400).json({
            message: "Error fetching exercise"
        });
    }
});

export default router;