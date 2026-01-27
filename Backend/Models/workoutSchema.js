const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Exercise title is required'],
    trim: true
  },
  tag: {
    type: String,
    required: [true, 'Exercise tag is required'],
    enum: ['Chest', 'Legs', 'Back', 'Shoulders', 'Arms', 'Full Body', 'Core', 'Cardio', 'Other']
  },
  exerciseId: {
    type: String,
    required: [true, 'Exercise ID is required'],
    unique: true,
    uppercase: true,
    match: [/^EX-\d{3}$/, 'Exercise ID must be in format EX-XXX']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  videoUrl: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+/, 'Please enter a valid URL']
  },
  imageUrl: {
    type: String,
    default: 'https://picsum.photos/600/400',
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate'
  },
  sets: {
    type: Number,
    min: 1,
    default: 3
  },
  reps: {
    type: String,
    default: '8-12'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Auto-generate exerciseId if not provided
workoutSchema.pre('save', async function(next) {
  if (!this.exerciseId) {
    const count = await this.constructor.countDocuments();
    this.exerciseId = `EX-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Workout', workoutSchema);