const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Workout = require('../Models/workoutSchema'); // Adjust path as needed

// GET admin workout page with all exercises
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 12;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (req.query.tag && req.query.tag !== 'All') {
      filter.tag = req.query.tag;
    }
    if (req.query.difficulty && req.query.difficulty !== 'All') {
      filter.difficulty = req.query.difficulty;
    }
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { exerciseId: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Get workouts with pagination
    const workouts = await Workout.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name email');

    // Get total count for pagination
    const totalExercises = await Workout.countDocuments(filter);
    const totalPages = Math.ceil(totalExercises / limit);

    // Get available tags from schema
    const tags = ['Chest', 'Legs', 'Back', 'Shoulders', 'Arms', 'Full Body', 'Core', 'Cardio', 'Other'];
    const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

    res.render('admin/workout', {
      workouts,
      tags,
      difficulties,
      currentPage: page,
      totalPages,
      totalExercises,
      query: req.query,
      title: 'Workout Management'
    });
  } catch (error) {
    console.error('Error fetching workouts:', error);
    res.status(500).render('error', { message: 'Failed to load workouts' });
  }
});

// GET form for creating new exercise
router.get('/new', (req, res) => {
  const tags = ['Chest', 'Legs', 'Back', 'Shoulders', 'Arms', 'Full Body', 'Core', 'Cardio', 'Other'];
  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
  
  res.render('admin/workout-form', {
    workout: null,
    tags,
    difficulties,
    title: 'Add New Exercise'
  });
});

// GET form for editing existing exercise
router.get('/edit/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).render('error', { message: 'Invalid exercise ID' });
    }

    const workout = await Workout.findById(req.params.id);
    if (!workout) {
      return res.status(404).render('error', { message: 'Exercise not found' });
    }

    const tags = ['Chest', 'Legs', 'Back', 'Shoulders', 'Arms', 'Full Body', 'Core', 'Cardio', 'Other'];
    const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

    res.render('admin/workout-form', {
      workout,
      tags,
      difficulties,
      title: 'Edit Exercise'
    });
  } catch (error) {
    console.error('Error fetching workout:', error);
    res.status(500).render('error', { message: 'Failed to load exercise' });
  }
});

// POST create new exercise
router.post('/', async (req, res) => {
  try {
    const {
      title,
      tag,
      exerciseId,
      description,
      videoUrl,
      imageUrl,
      difficulty,
      sets,
      reps,
      isActive
    } = req.body;

    // Prepare workout data
    const workoutData = {
      title,
      tag,
      description,
      videoUrl: videoUrl || undefined,
      imageUrl: imageUrl || 'https://picsum.photos/600/400',
      difficulty,
      sets: parseInt(sets) || 3,
      reps: reps || '8-12',
      isActive: isActive === 'on',
      createdBy: req.user ? req.user._id : null
    };

    // Only include exerciseId if provided (schema will auto-generate if not)
    if (exerciseId && exerciseId.trim()) {
      workoutData.exerciseId = exerciseId.toUpperCase();
    }

    const workout = new Workout(workoutData);
    await workout.save();

    req.flash('success', 'Exercise created successfully!');
    res.redirect('/admin/workouts');
  } catch (error) {
    console.error('Error creating workout:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      const tags = ['Chest', 'Legs', 'Back', 'Shoulders', 'Arms', 'Full Body', 'Core', 'Cardio', 'Other'];
      const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
      
      return res.status(400).render('admin/workout-form', {
        workout: req.body,
        tags,
        difficulties,
        errors,
        title: 'Add New Exercise'
      });
    }
    
    res.status(500).render('error', { message: 'Failed to create exercise' });
  }
});

// PUT update existing exercise
router.put('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid exercise ID' });
    }

    const {
      title,
      tag,
      exerciseId,
      description,
      videoUrl,
      imageUrl,
      difficulty,
      sets,
      reps,
      isActive
    } = req.body;

    const updateData = {
      title,
      tag,
      description,
      videoUrl: videoUrl || undefined,
      imageUrl: imageUrl || 'https://picsum.photos/600/400',
      difficulty,
      sets: parseInt(sets) || 3,
      reps: reps || '8-12',
      isActive: isActive === 'on'
    };

    // Only update exerciseId if provided
    if (exerciseId && exerciseId.trim()) {
      updateData.exerciseId = exerciseId.toUpperCase();
    }

    const workout = await Workout.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!workout) {
      return res.status(404).json({ success: false, message: 'Exercise not found' });
    }

    res.json({ success: true, message: 'Exercise updated successfully!', workout });
  } catch (error) {
    console.error('Error updating workout:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ success: false, errors });
    }
    
    res.status(500).json({ success: false, message: 'Failed to update exercise' });
  }
});

// DELETE exercise
router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid exercise ID' });
    }

    const workout = await Workout.findByIdAndDelete(req.params.id);
    
    if (!workout) {
      return res.status(404).json({ success: false, message: 'Exercise not found' });
    }

    res.json({ success: true, message: 'Exercise deleted successfully!' });
  } catch (error) {
    console.error('Error deleting workout:', error);
    res.status(500).json({ success: false, message: 'Failed to delete exercise' });
  }
});

// POST toggle active status
router.post('/:id/toggle-active', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid exercise ID' });
    }

    const workout = await Workout.findById(req.params.id);
    if (!workout) {
      return res.status(404).json({ success: false, message: 'Exercise not found' });
    }

    workout.isActive = !workout.isActive;
    await workout.save();

    res.json({ 
      success: true, 
      message: `Exercise ${workout.isActive ? 'activated' : 'deactivated'} successfully!`,
      isActive: workout.isActive 
    });
  } catch (error) {
    console.error('Error toggling workout active status:', error);
    res.status(500).json({ success: false, message: 'Failed to update exercise status' });
  }
});

// GET single exercise details (for modal or detail view)
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid exercise ID' });
    }

    const workout = await Workout.findById(req.params.id).populate('createdBy', 'name email');
    
    if (!workout) {
      return res.status(404).json({ success: false, message: 'Exercise not found' });
    }

    res.json({ success: true, workout });
  } catch (error) {
    console.error('Error fetching workout:', error);
    res.status(500).json({ success: false, message: 'Failed to load exercise' });
  }
});

module.exports = router;