import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Edit2, Trash2, X, Calendar, Clock } from "lucide-react";

const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snacks"];

function AdminMeal() {
    const [meals, setMeals] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newMeal, setNewMeal] = useState({
        name: "",
        type: "breakfast",
        date: new Date().toISOString().split("T")[0],
        time: "",
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        image: null,
    });
    const [editingMealId, setEditingMealId] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Fetch all meals (admin view)
    useEffect(() => {
        const token = localStorage.getItem("token");
        axios
            .get("/api/admin-meals/meals", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setMeals(res.data))
            .catch(console.error);
    }, []);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewMeal((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setNewMeal((prev) => ({ ...prev, image: file }));
        
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const resetForm = () => {
        setEditingMealId(null);
        setImagePreview(null);
        setNewMeal({
            name: "",
            type: "breakfast",
            date: new Date().toISOString().split("T")[0],
            time: "",
            calories: 0,
            protein: 0,
            carbs: 0,
            fats: 0,
            image: null,
        });
    };

    const openModal = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    const handleAddMeal = async () => {
        try {
            const formData = new FormData();
            Object.entries(newMeal).forEach(([key, value]) => {
                if (value) formData.append(key, value);
            });

            const token = localStorage.getItem("token");
            const res = await axios.post("/api/admin-meals/meals", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            setMeals((prev) => [...prev, res.data]);
            closeModal();
        } catch (err) {
            console.error(err);
            alert("Failed to add meal");
        }
    };

    const handleEditMeal = (meal) => {
        setEditingMealId(meal._id);
        setNewMeal({
            name: meal.foods[0]?.name || "",
            type: meal.type,
            date: new Date(meal.date).toISOString().split("T")[0],
            time: meal.time || "",
            calories: meal.foods[0]?.calories || 0,
            protein: meal.foods[0]?.protein || 0,
            carbs: meal.foods[0]?.carbs || 0,
            fats: meal.foods[0]?.fats || 0,
            image: null,
        });
        if (meal.image) {
            setImagePreview(meal.image);
        }
        setIsModalOpen(true);
    };

    const handleUpdateMeal = async () => {
        try {
            if (!editingMealId) return;

            const formData = new FormData();
            Object.entries(newMeal).forEach(([key, value]) => {
                if (value) formData.append(key, value);
            });

            const token = localStorage.getItem("token");
            const res = await axios.put(`/api/admin-meals/meals/${editingMealId}`, formData, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
            });

            setMeals((prev) => prev.map((m) => (m._id === editingMealId ? res.data : m)));
            closeModal();
        } catch (err) {
            console.error(err);
            alert("Failed to update meal");
        }
    };

    const handleDeleteMeal = async (id) => {
        if (!window.confirm("Are you sure you want to delete this meal?")) return;
        
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`/api/admin-meals/meals/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMeals((prev) => prev.filter((meal) => meal._id !== id));
        } catch (err) {
            console.error(err);
            alert("Failed to delete meal");
        }
    };

    // Handle modal backdrop click
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    // Handle escape key to close modal
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isModalOpen) {
                closeModal();
            }
        };
        
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isModalOpen]);

    return (
        <div className="bg-dark-bg min-h-screen">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-white font-bold text-xl sm:text-2xl">Meal Manager</h2>
                    <p className="text-gray-400 text-sm mt-1">Manage all meals in your system</p>
                </div>

                {/* Add Meal Card */}
                <div 
                    onClick={openModal}
                    className="bg-card rounded-xl sm:rounded-2xl border-2 border-dashed border-white/20 p-6 sm:p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-card/80 transition-all duration-300 mb-6 sm:mb-8"
                >
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/20 flex items-center justify-center mb-3 sm:mb-4">
                        <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                    </div>
                    <h3 className="text-white text-base sm:text-lg font-semibold mb-1 sm:mb-2">Add New Meal</h3>
                    <p className="text-gray-400 text-xs sm:text-sm text-center">Tap to add a new meal to the menu</p>
                </div>

                {/* Meals Grid */}
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                    {meals.map((meal) => (
                        <div
                            key={meal._id}
                            className="bg-card rounded-xl sm:rounded-2xl border border-white/10 overflow-hidden hover:border-primary/30 transition-all duration-300 group"
                        >
                            {/* Meal Image */}
                            <div className="relative h-40 sm:h-48 overflow-hidden">
                                {meal.image ? (
                                    <img
                                        src={meal.image}
                                        alt={meal.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-charcoal to-black flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-2">
                                                <span className="text-white text-lg sm:text-xl">🍽️</span>
                                            </div>
                                            <p className="text-gray-400 text-xs sm:text-sm">No Image</p>
                                        </div>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
                                
                                {/* Meal Type Badge */}
                                <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                                    <span className="px-2 py-1 text-[10px] xs:text-xs font-bold uppercase tracking-wider bg-black/80 text-white border border-white/20 rounded-full">
                                        {meal.type}
                                    </span>
                                </div>
                                
                                {/* Edit/Delete Buttons */}
                                <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex gap-1 sm:gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditMeal(meal);
                                        }}
                                        className="p-1.5 sm:p-2 bg-black/80 backdrop-blur-sm rounded-full hover:bg-yellow-500/20 hover:text-yellow-400 transition-colors"
                                    >
                                        <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteMeal(meal._id);
                                        }}
                                        className="p-1.5 sm:p-2 bg-black/80 backdrop-blur-sm rounded-full hover:bg-red-500/20 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </button>
                                </div>
                            </div>
                            
                            {/* Meal Info */}
                            <div className="p-3 sm:p-4 md:p-5">
                                {/* Meal Name and Date */}
                                <div className="flex flex-col mb-3 sm:mb-4">
                                    <h3 className="font-bold text-white text-sm sm:text-base md:text-lg truncate mb-1">
                                        {meal.foods[0]?.name || "Unnamed Meal"}
                                    </h3>
                                    <div className="flex items-center text-gray-400 text-xs">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        <span>
                                            {new Date(meal.date).toLocaleDateString('en-US', { 
                                                month: 'short', 
                                                day: 'numeric',
                                                year: meal.date.split('-')[0] !== new Date().getFullYear().toString() ? 'numeric' : undefined
                                            })}
                                        </span>
                                        {meal.time && (
                                            <>
                                                <span className="mx-2">•</span>
                                                <Clock className="w-3 h-3 mr-1" />
                                                <span>{meal.time}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Nutrition Stats - All in boxes including calories */}
                                <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-2 sm:mb-3">
                                    <div className="text-center bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-lg p-2 sm:p-3 border border-blue-500/20">
                                        <div className="text-blue-400 font-bold text-sm sm:text-base">{meal.totals.calories}</div>
                                        <div className="text-gray-400 text-[10px] xs:text-xs">Calories</div>
                                    </div>
                                    <div className="text-center bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-2 sm:p-3 border border-primary/20">
                                        <div className="text-primary font-bold text-sm sm:text-base">{meal.totals.protein}g</div>
                                        <div className="text-gray-400 text-[10px] xs:text-xs">Protein</div>
                                    </div>
                                    <div className="text-center bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-lg p-2 sm:p-3 border border-green-500/20">
                                        <div className="text-green-400 font-bold text-sm sm:text-base">{meal.totals.carbs}g</div>
                                        <div className="text-gray-400 text-[10px] xs:text-xs">Carbs</div>
                                    </div>
                                    <div className="text-center bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 rounded-lg p-2 sm:p-3 border border-yellow-500/20">
                                        <div className="text-yellow-400 font-bold text-sm sm:text-base">{meal.totals.fats}g</div>
                                        <div className="text-gray-400 text-[10px] xs:text-xs">Fats</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {meals.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">🍽️</span>
                        </div>
                        <h3 className="text-white text-lg font-semibold mb-2">No meals yet</h3>
                        <p className="text-gray-400 text-sm">Add your first meal by clicking the card above</p>
                    </div>
                )}

                {/* Modal - Optimized for desktop with two columns */}
                {isModalOpen && (
                    <div 
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto"
                        onClick={handleBackdropClick}
                    >
                        <div className="min-h-full flex items-center justify-center p-3 sm:p-4">
                            <div 
                                className="bg-card rounded-xl sm:rounded-2xl w-full max-w-3xl my-8 overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Modal Header */}
                                <div className="sticky top-0 bg-card border-b border-white/10 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center z-10">
                                    <h3 className="text-white text-lg sm:text-xl font-bold">
                                        {editingMealId ? "Edit Meal" : "Add New Meal"}
                                    </h3>
                                    <button
                                        onClick={closeModal}
                                        className="p-1.5 sm:p-2 hover:bg-white/10 rounded-full transition-colors flex-shrink-0"
                                        aria-label="Close modal"
                                    >
                                        <X className="w-5 h-5 text-white" />
                                    </button>
                                </div>
                                
                                {/* Modal Body - Two column layout on desktop */}
                                <div className="p-4 sm:p-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Left Column - Image and Basic Info */}
                                        <div className="space-y-6">
                                            {/* Image Upload Section */}
                                            <div className="space-y-3">
                                                <label className="block text-white font-medium text-sm sm:text-base">
                                                    Meal Image
                                                </label>
                                                <div className="border-2 border-dashed border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center hover:border-primary/50 transition-colors relative">
                                                    {imagePreview ? (
                                                        <div className="relative">
                                                            <img
                                                                src={imagePreview}
                                                                alt="Preview"
                                                                className="w-full h-40 sm:h-48 object-cover rounded-lg mb-3 sm:mb-4 mx-auto"
                                                            />
                                                            <button
                                                                onClick={() => {
                                                                    setImagePreview(null);
                                                                    setNewMeal(prev => ({ ...prev, image: null }));
                                                                }}
                                                                className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 p-1.5 sm:p-2 bg-black/80 rounded-full hover:bg-red-500/80 transition-colors"
                                                                type="button"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="py-6 sm:py-8">
                                                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                                                <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                                                            </div>
                                                            <p className="text-gray-400 text-sm mb-1 sm:mb-2">Click to upload image</p>
                                                            <p className="text-gray-500 text-xs">PNG, JPG, GIF up to 5MB</p>
                                                        </div>
                                                    )}
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    />
                                                </div>
                                            </div>

                                            {/* Basic Information */}
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-white font-medium text-sm sm:text-base mb-2">
                                                        Meal Name *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={newMeal.name}
                                                        onChange={handleChange}
                                                        placeholder="Enter meal name"
                                                        className="w-full p-3 rounded-lg bg-charcoal border border-white/10 text-white placeholder-gray-500 focus:border-primary focus:outline-none text-sm sm:text-base"
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-white font-medium text-sm sm:text-base mb-2">
                                                        Meal Type *
                                                    </label>
                                                    <select
                                                        name="type"
                                                        value={newMeal.type}
                                                        onChange={handleChange}
                                                        className="w-full p-3 rounded-lg bg-charcoal border border-white/10 text-white focus:border-primary focus:outline-none text-sm sm:text-base"
                                                        required
                                                    >
                                                        {MEAL_TYPES.map((m) => (
                                                            <option key={m} value={m}>
                                                                {m.charAt(0).toUpperCase() + m.slice(1)}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Column - Date, Time and Nutrition */}
                                        <div className="space-y-6">
                                            {/* Date & Time */}
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-white font-medium text-sm sm:text-base mb-2">
                                                            Date *
                                                        </label>
                                                        <input
                                                            type="date"
                                                            name="date"
                                                            value={newMeal.date}
                                                            onChange={handleChange}
                                                            className="w-full p-3 rounded-lg bg-charcoal border border-white/10 text-white focus:border-primary focus:outline-none text-sm sm:text-base"
                                                            required
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-white font-medium text-sm sm:text-base mb-2">
                                                            Time (Optional)
                                                        </label>
                                                        <input
                                                            type="time"
                                                            name="time"
                                                            value={newMeal.time}
                                                            onChange={handleChange}
                                                            className="w-full p-3 rounded-lg bg-charcoal border border-white/10 text-white focus:border-primary focus:outline-none text-sm sm:text-base"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Nutrition Information */}
                                            <div className="space-y-4">
                                                <h4 className="text-white font-medium text-sm sm:text-base">Nutrition Information *</h4>
                                                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                                    <div className="space-y-2">
                                                        <label className="block text-gray-400 text-xs sm:text-sm">
                                                            Calories
                                                        </label>
                                                        <input
                                                            type="number"
                                                            name="calories"
                                                            value={newMeal.calories}
                                                            onChange={handleChange}
                                                            className="w-full p-3 rounded-lg bg-charcoal border border-white/10 text-white focus:border-primary focus:outline-none text-sm sm:text-base"
                                                            min="0"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="block text-gray-400 text-xs sm:text-sm">
                                                            Protein (g)
                                                        </label>
                                                        <input
                                                            type="number"
                                                            name="protein"
                                                            value={newMeal.protein}
                                                            onChange={handleChange}
                                                            className="w-full p-3 rounded-lg bg-charcoal border border-white/10 text-white focus:border-primary focus:outline-none text-sm sm:text-base"
                                                            min="0"
                                                            step="0.1"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="block text-gray-400 text-xs sm:text-sm">
                                                            Carbs (g)
                                                        </label>
                                                        <input
                                                            type="number"
                                                            name="carbs"
                                                            value={newMeal.carbs}
                                                            onChange={handleChange}
                                                            className="w-full p-3 rounded-lg bg-charcoal border border-white/10 text-white focus:border-primary focus:outline-none text-sm sm:text-base"
                                                            min="0"
                                                            step="0.1"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="block text-gray-400 text-xs sm:text-sm">
                                                            Fats (g)
                                                        </label>
                                                        <input
                                                            type="number"
                                                            name="fats"
                                                            value={newMeal.fats}
                                                            onChange={handleChange}
                                                            className="w-full p-3 rounded-lg bg-charcoal border border-white/10 text-white focus:border-primary focus:outline-none text-sm sm:text-base"
                                                            min="0"
                                                            step="0.1"
                                                        />
                                                    </div>
                                                </div>
                                                <p className="text-gray-500 text-xs mt-2">* Required fields</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Modal Footer */}
                                <div className="sticky bottom-0 bg-card border-t border-white/10 px-4 sm:px-6 py-3 sm:py-4">
                                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                        <button
                                            onClick={closeModal}
                                            className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors text-sm sm:text-base flex-1"
                                            type="button"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={editingMealId ? handleUpdateMeal : handleAddMeal}
                                            className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-primary text-black font-bold hover:bg-primary/90 transition-colors text-sm sm:text-base flex-1"
                                            type="button"
                                        >
                                            {editingMealId ? "Update Meal" : "Add Meal"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminMeal;