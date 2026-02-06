import mongoose from "mongoose";

const userWorkoutSchema = new mongoose.Schema({
  userId: { 
    type: String, // Or mongoose.Schema.Types.ObjectId if using Auth
    required: true,
    index: true 
  },
  exerciseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Workout', 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'completed'], 
    default: 'pending' 
  },
  addedAt: { 
    type: Date, 
    default: Date.now 
  }
});

const UserWorkout = mongoose.model("UserWorkout", userWorkoutSchema);
export default UserWorkout;