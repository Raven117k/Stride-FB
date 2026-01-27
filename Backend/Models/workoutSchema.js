import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema({
  exerciseId: { 
    type: String, 
    required: [true, "Exercise ID is required"], 
    unique: true,
    index: true
  },
  title: { 
    type: String, 
    required: [true, "Exercise title is required"],
    trim: true
  },
  tag: { 
    type: String, 
    required: [true, "Muscle group is required"],
    enum: ['Chest', 'Legs', 'Back', 'Shoulders', 'Arms', 'Full Body', 'Core', 'Cardio', 'Other']
  },
  description: { 
    type: String, 
    required: [true, "Description is required"],
    trim: true
  },
  imageUrl: { 
    type: String, 
    default: "https://picsum.photos/600/400",
    trim: true
  },
  difficulty: { 
    type: String, 
    required: [true, "Difficulty level is required"],
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  sets: { 
    type: Number, 
    required: [true, "Number of sets is required"],
    min: [1, "Sets must be at least 1"],
    max: [50, "Sets cannot exceed 50"]
  },
  reps: { 
    type: String, 
    required: [true, "Reps are required"],
    maxlength: [20, "Reps format cannot exceed 20 characters"],
    trim: true
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});


// Create indexes
workoutSchema.index({ title: 'text', description: 'text' });
workoutSchema.index({ tag: 1 });
workoutSchema.index({ difficulty: 1 });
workoutSchema.index({ isActive: 1 });

const Workout = mongoose.model("Workout", workoutSchema);

export default Workout;