import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

// Base URL for your API
const API_BASE_URL = "http://localhost:5000/api/admin/workouts";

function AdminWorkout() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalExercises, setTotalExercises] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // File picker states
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    tag: 'Chest',
    description: '',
    imageUrl: 'https://picsum.photos/600/400',
    difficulty: 'Intermediate',
    sets: 3,
    reps: '8-12',
    isActive: true
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Filter states
  const [tagFilter, setTagFilter] = useState(searchParams.get('tag') || 'All');
  const [difficultyFilter, setDifficultyFilter] = useState(searchParams.get('difficulty') || 'All');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  const tags = ['All', 'Chest', 'Legs', 'Back', 'Shoulders', 'Arms', 'Full Body', 'Core', 'Cardio', 'Other'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const workoutTags = ['Chest', 'Legs', 'Back', 'Shoulders', 'Arms', 'Full Body', 'Core', 'Cardio', 'Other'];

  // API call to fetch workouts with filters
  const fetchWorkouts = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '8',
      });

      if (tagFilter && tagFilter !== 'All') {
        params.append('tag', tagFilter);
      }

      if (difficultyFilter && difficultyFilter !== 'All') {
        params.append('difficulty', difficultyFilter);
      }

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`${API_BASE_URL}?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setWorkouts(data.workouts || []);
      setTotalExercises(data.total || 0);
      setCurrentPage(data.page || 1);
      setTotalPages(data.totalPages || 1);

      // Update URL search params
      const newParams = {};
      if (tagFilter !== 'All') newParams.tag = tagFilter;
      if (difficultyFilter !== 'All') newParams.difficulty = difficultyFilter;
      if (searchTerm) newParams.search = searchTerm;
      setSearchParams(newParams);
    } catch (error) {
      console.error('Error fetching workouts:', error);
      setWorkouts([]);
      setTotalExercises(0);
      alert('Failed to fetch workouts. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [tagFilter, difficultyFilter, searchTerm, setSearchParams]);

  // Function to upload image to a service
  // Replace your current uploadImage function with this:
  const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('http://localhost:5000/api/admin/workouts/upload', {
        method: 'POST',
        body: formData,
      });


      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      return data.imageUrl; // Server should return the actual URL
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  // File picker functions
  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('File size too large. Maximum size is 10MB.');
      return;
    }

    if (!file.type.match('image.*')) {
      alert('Please select an image file.');
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    setUploadingImage(true);
    try {
      const uploadedUrl = await uploadImage(file);
      setFormData(prev => ({ ...prev, imageUrl: uploadedUrl }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Using default image.');
      setFormData(prev => ({ ...prev, imageUrl: 'https://picsum.photos/600/400' }));
    } finally {
      setUploadingImage(false);
    }
  };

  const clearImageSelection = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, imageUrl: 'https://picsum.photos/600/400' }));
  };

  // Modal Functions
  const openAddModal = () => {
    setFormData({
      title: '',
      tag: 'Chest',
      description: '',
      imageUrl: 'https://picsum.photos/600/400',
      difficulty: 'Intermediate',
      sets: 3,
      reps: '8-12',
      isActive: true
    });
    setFormErrors({});
    setModalMode("add");
    setShowModal(true);
    setImageFile(null);
    setImagePreview(null);
  };

  const openEditModal = (workout) => {
    setFormData({
      title: workout.title,
      tag: workout.tag,
      description: workout.description,
      imageUrl: workout.imageUrl,
      difficulty: workout.difficulty,
      sets: workout.sets,
      reps: workout.reps,
      isActive: workout.isActive
    });
    setSelectedWorkout(workout);
    setFormErrors({});
    setModalMode("edit");
    setShowModal(true);
    setImageFile(null);
    setImagePreview(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedWorkout(null);
    setFormErrors({});
    setSubmitting(false);
    setImageFile(null);
    setImagePreview(null);
  };

  // Form Handlers
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;

    const processedValue = type === 'number' ? parseInt(value) || 0 : value;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : processedValue
    }));

    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.sets < 1 || formData.sets > 50) newErrors.sets = 'Sets must be between 1 and 50';
    if (!formData.reps.trim()) newErrors.reps = 'Reps are required';
    if (formData.reps.length > 20) newErrors.reps = 'Reps format cannot exceed 20 characters';

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // In your handleFormSubmit function, update the error handling:
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const url = modalMode === "edit"
        ? `${API_BASE_URL}/${selectedWorkout._id}`
        : `${API_BASE_URL}`;

      const method = modalMode === "edit" ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle validation errors
        if (result.errors) {
          const errorMessages = Object.values(result.errors).join(', ');
          throw new Error(`Validation failed: ${errorMessages}`);
        }
        throw new Error(result.message || 'Failed to save workout');
      }

      alert(`Exercise ${modalMode === "edit" ? 'updated' : 'created'} successfully!`);
      closeModal();
      fetchWorkouts(currentPage);
    } catch (error) {
      console.error('Error saving workout:', error);
      alert(`Failed to save exercise: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Functions
  const openDeleteModal = (workout) => {
    setSelectedWorkout(workout);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/${selectedWorkout._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete workout');
      }

      const result = await response.json();
      alert(`Exercise ${result.deletedExerciseId} deleted successfully!`);

      setShowDeleteModal(false);
      setSelectedWorkout(null);
      fetchWorkouts(currentPage);
    } catch (error) {
      console.error('Error deleting workout:', error);
      alert('Failed to delete exercise. Please try again.');
    }
  };

  const toggleActiveStatus = async (workout) => {
    try {
      const updatedWorkout = { ...workout, isActive: !workout.isActive };

      const response = await fetch(`${API_BASE_URL}/${workout._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !workout.isActive, updatedAt: new Date().toISOString() }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle validation errors
        if (result.errors) {
          const errorMessages = Object.values(result.errors).join(', ');
          throw new Error(`Validation failed: ${errorMessages}`);
        }
        throw new Error(result.message || 'Failed to update status');
      }

      const updatedWorkouts = workouts.map(w =>
        w._id === workout._id ? { ...w, isActive: !w.isActive } : w
      );
      setWorkouts(updatedWorkouts);

      alert(`Exercise ${workout.exerciseId} ${!workout.isActive ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      console.error('Error toggling active status:', error);
      alert(`Failed to update status: ${error.message}`);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchWorkouts(page);
    }
  };

  // Initialize data
  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  // Handle filter changes with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchWorkouts(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [tagFilter, difficultyFilter, searchTerm, fetchWorkouts]);

  if (loading && workouts.length === 0) {
    return (
      <div className="bg-dark-bg px-4 sm:px-6 py-4 flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin size-10 border-4 border-primary border-t-transparent rounded-full"></div>
          <div className="text-white">Loading exercises...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark-bg px-4 sm:px-6 py-4 min-h-[100dvh]">
      {/* Header with filters and search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Workout Management</h1>
          <p className="text-sm text-gray-500">Manage all exercises in your library</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by title, description, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-card border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary w-full"
            />
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-500 text-sm">
              search
            </span>
          </div>

          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="px-4 py-2 bg-card border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-primary"
          >
            {tags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>

          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-4 py-2 bg-card border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-primary"
          >
            {difficulties.map(diff => (
              <option key={diff} value={diff}>{diff}</option>
            ))}
          </select>

          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Add New
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-card p-4 rounded-xl border border-white/10">
          <p className="text-sm text-gray-500">Total Exercises</p>
          <p className="text-2xl font-bold text-white">{totalExercises}</p>
        </div>
        <div className="bg-card p-4 rounded-xl border border-white/10">
          <p className="text-sm text-gray-500">Active Exercises</p>
          <p className="text-2xl font-bold text-success">
            {workouts.filter(w => w.isActive).length}
          </p>
        </div>
        <div className="bg-card p-4 rounded-xl border border-white/10">
          <p className="text-sm text-gray-500">Categories</p>
          <p className="text-2xl font-bold text-primary">{tags.length - 1}</p>
        </div>
        <div className="bg-card p-4 rounded-xl border border-white/10">
          <p className="text-sm text-gray-500">Latest Exercise ID</p>
          <p className="text-2xl font-bold text-white">
            {workouts.length > 0 ? workouts[0].exerciseId : 'N/A'}
          </p>
        </div>
      </div>

      {/* Exercises Grid */}
      {workouts.length === 0 && !loading ? (
        <div className="bg-card rounded-2xl border border-white/10 p-8 text-center">
          <span className="material-symbols-outlined text-4xl text-gray-500 mb-4">fitness_center</span>
          <h3 className="text-lg font-bold text-white mb-2">No exercises found</h3>
          <p className="text-sm text-gray-400 mb-4">
            {searchTerm || tagFilter !== 'All' || difficultyFilter !== 'All'
              ? 'Try changing your search filters'
              : 'Get started by creating your first exercise'}
          </p>
          <button
            onClick={openAddModal}
            className="px-6 py-2 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Add Your First Exercise
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {workouts.map(workout => (
              <div
                key={workout._id}
                className={`bg-card rounded-2xl border overflow-hidden flex flex-col hover:border-primary/40 transition ${!workout.isActive ? 'opacity-60 border-red-500/20' : 'border-white/10'
                  }`}
              >
                <div className="relative h-44">
                  <img
                    src={workout.imageUrl}
                    alt={workout.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://picsum.photos/600/400';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  <span className="absolute top-3 left-3 px-2 py-1 text-[9px] font-black uppercase tracking-widest bg-black/60 text-success border border-success/30 rounded">
                    {workout.tag}
                  </span>
                  <span className="absolute top-3 right-3 px-2 py-1 text-[9px] font-black uppercase tracking-widest bg-black/60 text-gray-300 border border-gray-500/30 rounded">
                    {workout.difficulty}
                  </span>
                  <span className="absolute bottom-3 left-3 px-2 py-1 text-[9px] font-black uppercase tracking-widest bg-black/60 text-primary border border-primary/30 rounded">
                    {workout.exerciseId}
                  </span>
                  {!workout.isActive && (
                    <span className="absolute bottom-3 right-3 px-2 py-1 text-[9px] font-black uppercase tracking-widest bg-red-500/60 text-white border border-red-500/30 rounded">
                      INACTIVE
                    </span>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-bold text-white">{workout.title}</h3>
                    <span className="text-[10px] text-gray-500 font-bold">{workout.exerciseId}</span>
                  </div>

                  <p className="text-xs text-gray-500 mb-4 line-clamp-2">
                    {workout.description}
                  </p>

                  <div className="mt-2 mb-4 flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-primary text-sm">repeat</span>
                      <span className="text-xs text-gray-400">{workout.sets} sets</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-primary text-sm">fitness_center</span>
                      <span className="text-xs text-gray-400">{workout.reps} reps</span>
                    </div>
                  </div>

                  <div className="mt-auto grid grid-cols-2 gap-2">
                    <button
                      onClick={() => openEditModal(workout)}
                      className="py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-[10px] font-black uppercase hover:bg-white/10"
                    >
                      EDIT
                    </button>
                    <button
                      onClick={() => toggleActiveStatus(workout)}
                      className={`py-2 rounded-lg border text-[10px] font-black uppercase ${workout.isActive
                        ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500 hover:bg-yellow-500/20'
                        : 'bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500/20'
                        }`}
                    >
                      {workout.isActive ? 'DEACTIVATE' : 'ACTIVATE'}
                    </button>
                    <button
                      onClick={() => openDeleteModal(workout)}
                      className="py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase hover:bg-red-500/20"
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add New Card */}
            <div
              onClick={openAddModal}
              className="bg-card/40 rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center min-h-[260px] hover:border-success/40 transition cursor-pointer"
            >
              <div className="size-14 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-3xl text-white">add</span>
              </div>
              <p className="text-xs font-black uppercase tracking-widest text-gray-500">
                Add New Exercise
              </p>
              <p className="text-[10px] text-gray-600 mt-2">
                Auto-generated ID: EX0001, EX0002, etc.
              </p>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 p-4 border-t border-white/10 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <p className="text-xs text-gray-400 font-bold">
                Showing {workouts.length} of {totalExercises} exercises
              </p>

              <div className="flex gap-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="size-8 rounded bg-card border border-white/10 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`size-8 rounded border text-xs font-bold ${currentPage === pageNum
                        ? 'bg-primary text-black border-primary'
                        : 'bg-card border-white/10 text-gray-400 hover:text-white'
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="size-8 rounded bg-card border border-white/10 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-white/10 w-full max-w-2xl">
            <div className="p-5 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-white">
                    {modalMode === "add" ? "Add New Exercise" : "Edit Exercise"}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  {submitting && (
                    <span className="text-xs text-gray-400">Saving...</span>
                  )}
                  <button
                    onClick={closeModal}
                    className="p-1 hover:bg-white/10 rounded-lg transition"
                    disabled={submitting}
                  >
                    <span className="material-symbols-outlined text-gray-400 text-lg">close</span>
                  </button>
                </div>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Exercise ID Display (Read-only) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Exercise ID (Auto-generated)
                    </label>
                    <input
                      type="text"
                      value={modalMode === "edit" ? selectedWorkout?.exerciseId : "Will be auto-generated"}
                      className="w-full px-4 py-3 bg-dark-bg border border-white/10 rounded-lg text-gray-400 cursor-not-allowed"
                      readOnly
                      disabled
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      {modalMode === "add"
                        ? "Auto-generated in format: EX0001, EX0002, etc."
                        : "Exercise ID cannot be changed"}
                    </p>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Exercise Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleFormChange}
                      className={`w-full px-4 py-3 bg-dark-bg border rounded-lg text-white focus:outline-none focus:border-primary transition ${formErrors.title ? 'border-red-500' : 'border-white/10'
                        }`}
                      placeholder="e.g., Barbell Bench Press"
                      disabled={submitting}
                    />
                    {formErrors.title && <p className="mt-1 text-xs text-red-500">{formErrors.title}</p>}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      rows="3"
                      className={`w-full px-4 py-3 bg-dark-bg border rounded-lg text-white focus:outline-none focus:border-primary transition ${formErrors.description ? 'border-red-500' : 'border-white/10'
                        }`}
                      placeholder="Describe the exercise, technique tips, benefits..."
                      disabled={submitting}
                    />
                    {formErrors.description && <p className="mt-1 text-xs text-red-500">{formErrors.description}</p>}
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Tag & Difficulty */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Muscle Group *
                      </label>
                      <select
                        name="tag"
                        value={formData.tag}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 bg-dark-bg border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary transition"
                        disabled={submitting}
                      >
                        {workoutTags.map(tag => (
                          <option key={tag} value={tag}>{tag}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Difficulty *
                      </label>
                      <select
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 bg-dark-bg border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary transition"
                        disabled={submitting}
                      >
                        {difficulties.slice(1).map(diff => (
                          <option key={diff} value={diff}>{diff}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Exercise Image
                    </label>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <label className="flex-1 cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                            id="image-upload"
                            disabled={uploadingImage || submitting}
                          />
                          <div className={`px-4 py-3 bg-dark-bg border rounded-lg text-center transition ${uploadingImage || submitting
                            ? 'opacity-50 cursor-not-allowed'
                            : 'border-white/10 text-gray-400 hover:text-white hover:border-primary cursor-pointer'
                            }`}>
                            {uploadingImage ? 'Uploading...' : imageFile ? 'Change Image' : 'Upload Image'}
                          </div>
                        </label>
                        {(imagePreview || imageFile) && (
                          <button
                            type="button"
                            onClick={clearImageSelection}
                            className="px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg hover:bg-red-500/20 transition disabled:opacity-50"
                            disabled={uploadingImage || submitting}
                          >
                            Clear
                          </button>
                        )}
                      </div>

                      {uploadingImage && (
                        <div className="text-sm text-gray-400 flex items-center gap-2">
                          <span className="animate-spin size-4 border-2 border-gray-400 border-t-transparent rounded-full"></span>
                          Uploading image...
                        </div>
                      )}

                      {(imagePreview || formData.imageUrl) && (
                        <div className="relative">
                          <img
                            src={imagePreview || formData.imageUrl}
                            alt="Preview"
                            className="w-full h-32 object-cover rounded-lg border border-white/10"
                            onError={(e) => {
                              e.target.src = 'https://picsum.photos/600/400';
                            }}
                          />
                          {imageFile && (
                            <span className="absolute top-2 right-2 px-2 py-1 text-xs bg-black/70 text-white rounded">
                              New Image
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sets & Reps */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Sets *
                      </label>
                      <input
                        type="number"
                        name="sets"
                        value={formData.sets}
                        onChange={handleFormChange}
                        min="1"
                        max="50"
                        className={`w-full px-4 py-3 bg-dark-bg border rounded-lg text-white focus:outline-none focus:border-primary transition ${formErrors.sets ? 'border-red-500' : 'border-white/10'
                          }`}
                        disabled={submitting}
                      />
                      {formErrors.sets && <p className="mt-1 text-xs text-red-500">{formErrors.sets}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Reps *
                      </label>
                      <input
                        type="text"
                        name="reps"
                        value={formData.reps}
                        onChange={handleFormChange}
                        className={`w-full px-4 py-3 bg-dark-bg border rounded-lg text-white focus:outline-none focus:border-primary transition ${formErrors.reps ? 'border-red-500' : 'border-white/10'
                          }`}
                        placeholder="8-12"
                        disabled={submitting}
                      />
                      {formErrors.reps && <p className="mt-1 text-xs text-red-500">{formErrors.reps}</p>}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleFormChange}
                      className="size-5"
                      disabled={submitting}
                    />
                    <label htmlFor="isActive" className="text-sm text-gray-400">
                      Active (visible to users)
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="mt-8 pt-6 border-t border-white/10 flex gap-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 border border-white/10 text-gray-300 rounded-lg hover:bg-white/5 transition disabled:opacity-50"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition"
                >
                  {submitting ? (
                    <>
                      <span className="animate-spin size-4 border-2 border-black border-t-transparent rounded-full"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">save</span>
                      {modalMode === "add" ? "Create Exercise" : "Update Exercise"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedWorkout && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg p-6 max-w-md w-full border border-white/10">
            <h3 className="text-lg font-bold text-white mb-3">Delete Exercise?</h3>
            <p className="text-sm text-gray-400 mb-2">
              Are you sure you want to delete this exercise?
            </p>
            <div className="mb-4 p-3 bg-dark-bg rounded border border-white/10">
              <p className="text-white font-medium">{selectedWorkout.title}</p>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>ID: {selectedWorkout.exerciseId}</span>
                <span>Tag: {selectedWorkout.tag}</span>
              </div>
            </div>
            <p className="text-xs text-red-400 mb-6">
              This action cannot be undone. The exercise ID ({selectedWorkout.exerciseId}) will not be reused.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedWorkout(null);
                }}
                className="flex-1 py-3 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminWorkout;