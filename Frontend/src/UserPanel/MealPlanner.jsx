import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, X, CheckCircle, Target, Search, Filter, Flame, Beef, Wheat, Droplets } from "lucide-react";

const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snacks"];

// Default goals
const DEFAULT_GOALS = {
    calories: 2200,
    protein: 150,
    carbs: 220,
    fats: 85,
};

function MealPlanner() {
    // State for available meals (from admin)
    const [availableMeals, setAvailableMeals] = useState([]);
    // State for user's selected meals
    const [userMeals, setUserMeals] = useState([]);
    
    // Modal states
    const [isAddMealModalOpen, setIsAddMealModalOpen] = useState(false);
    const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
    
    // Filter states
    const [selectedType, setSelectedType] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    
    // Targets
    const [goals, setGoals] = useState(DEFAULT_GOALS);
    const [tempTargets, setTempTargets] = useState({ ...DEFAULT_GOALS });
    
    // Daily totals
    const [dailyTotals, setDailyTotals] = useState({
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchData = async () => {
        try {
            setError("");
            const token = localStorage.getItem("token");
            
            if (!token) {
                throw new Error("No authentication token found");
            }

            // 1. Fetch available meals (from admin)
            const availableRes = await axios.get("/api/meals", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAvailableMeals(availableRes.data);
            
            // 2. Fetch user's meals
            const userMealsRes = await axios.get("/api/user-meals", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUserMeals(userMealsRes.data);
            
            // 3. Calculate daily totals from completed meals
            calculateDailyTotals(userMealsRes.data);
            
            // 4. Fetch user targets from userSchema
            try {
                const targetsRes = await axios.get("/api/targets", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                // Ensure all fields are numbers
                const fetchedTargets = {
                    calories: Number(targetsRes.data.calories) || DEFAULT_GOALS.calories,
                    protein: Number(targetsRes.data.protein) || DEFAULT_GOALS.protein,
                    carbs: Number(targetsRes.data.carbs) || DEFAULT_GOALS.carbs,
                    fats: Number(targetsRes.data.fats) || DEFAULT_GOALS.fats,
                };
                setGoals(fetchedTargets);
                setTempTargets(fetchedTargets);
            } catch (err) {
                console.log("Using default targets");
                setGoals(DEFAULT_GOALS);
                setTempTargets(DEFAULT_GOALS);
            }
            
        } catch (err) {
            console.error("Error fetching data:", err);
            
            if (err.response?.status === 401) {
                setError("Session expired. Please log in again.");
            } else if (err.message.includes("token")) {
                setError("No authentication token found. Please log in again.");
            } else {
                setError(err.response?.data?.message || err.message || "Failed to load meal data");
            }
            
            setGoals(DEFAULT_GOALS);
            setTempTargets(DEFAULT_GOALS);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchData();
    }, []);

    const calculateDailyTotals = (meals) => {
        const totals = { calories: 0, protein: 0, carbs: 0, fats: 0 };
        
        meals.forEach(meal => {
            if (meal.isDone && meal.mealId?.totals) {
                totals.calories += meal.mealId.totals.calories;
                totals.protein += meal.mealId.totals.protein;
                totals.carbs += meal.mealId.totals.carbs;
                totals.fats += meal.mealId.totals.fats;
            }
        });
        
        setDailyTotals(totals);
    };

    // Add a meal to user's daily plan
    const handleAddMealToPlan = async (meal) => {
        try {
            const token = localStorage.getItem("token");
            
            const response = await axios.post("/api/user-meals", {
                mealId: meal._id,
                type: meal.type,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            setUserMeals(prev => [...prev, response.data]);
            setIsAddMealModalOpen(false);
        } catch (err) {
            console.error("Error adding meal:", err);
            alert("Failed to add meal to plan");
        }
    };

    // Toggle meal done/undone
    const handleToggleMealDone = async (userMealId, isCurrentlyDone) => {
        try {
            const token = localStorage.getItem("token");
            
            const response = await axios.put(`/api/user-meals/${userMealId}`, {
                isDone: !isCurrentlyDone,
                completedAt: !isCurrentlyDone ? new Date() : null,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            // Update local state
            const updatedUserMeals = userMeals.map(meal => 
                meal._id === userMealId ? response.data : meal
            );
            setUserMeals(updatedUserMeals);
            
            // Recalculate totals
            calculateDailyTotals(updatedUserMeals);
        } catch (err) {
            console.error("Error toggling meal status:", err);
            alert("Failed to update meal status");
        }
    };

    // Remove meal from user's plan
    const handleRemoveMeal = async (userMealId) => {
        if (!window.confirm("Are you sure you want to remove this meal from your plan?")) return;
        
        try {
            const token = localStorage.getItem("token");
            
            await axios.delete(`/api/user-meals/${userMealId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            const updatedUserMeals = userMeals.filter(meal => meal._id !== userMealId);
            setUserMeals(updatedUserMeals);
            calculateDailyTotals(updatedUserMeals);
        } catch (err) {
            console.error("Error removing meal:", err);
            alert("Failed to remove meal");
        }
    };

    /* 📊 PERCENT HELPERS */
    const percent = (value, goal) => {
        if (goal === 0) return 0;
        return Math.min(100, Math.round((value / goal) * 100));
    };

    /* 🎯 HANDLE TARGETS UPDATE */
    const handleSaveTargets = async () => {
        try {
            const response = await axios.put(
                "/api/targets",
                {
                    calories: Number(tempTargets.calories) || 0,
                    protein: Number(tempTargets.protein) || 0,
                    carbs: Number(tempTargets.carbs) || 0,
                    fats: Number(tempTargets.fats) || 0,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            
            // Ensure all fields are numbers
            const savedTargets = {
                calories: Number(response.data.calories) || 0,
                protein: Number(response.data.protein) || 0,
                carbs: Number(response.data.carbs) || 0,
                fats: Number(response.data.fats) || 0,
            };
            
            setGoals(savedTargets);
            setIsTargetModalOpen(false);
        } catch (error) {
            console.error("Error updating targets:", error);
            alert("Failed to update targets. Please try again.");
        }
    };

    const handleTargetChange = (field, value) => {
        const numValue = parseInt(value) || 0;
        setTempTargets(prev => ({
            ...prev,
            [field]: numValue
        }));
    };

    // Filter available meals based on search and type
    const filteredAvailableMeals = availableMeals.filter(meal => {
        const matchesSearch = meal.foods[0]?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           meal.type.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = selectedType === "all" || meal.type === selectedType;
        return matchesSearch && matchesType;
    });

    // Filter completed meals
    const completedMeals = userMeals.filter(meal => meal.isDone);
    const pendingMeals = userMeals.filter(meal => !meal.isDone);

    // Inline Loader Component (Bone Structure from Progress page)
    const InlineLoader = () => (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto space-y-6 p-4 sm:p-6 md:p-8">
                {/* Header with shimmer effect */}
                <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-8">
                    <div>
                        <div className="h-10 w-64 bg-white/5 rounded-lg mb-2 animate-pulse"></div>
                        <div className="h-4 w-72 bg-white/5 rounded animate-pulse"></div>
                    </div>
                    <div className="flex gap-3">
                        <div className="h-11 w-32 bg-white/5 rounded-xl animate-pulse"></div>
                        <div className="h-11 w-32 bg-white/5 rounded-xl animate-pulse"></div>
                    </div>
                </div>

                {/* Daily Progress Overview Loader */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-5 animate-pulse">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 rounded-lg bg-white/5 w-8 h-8"></div>
                                    <div className="h-4 w-16 bg-white/5 rounded"></div>
                                </div>
                                <div className="h-4 w-12 bg-white/5 rounded"></div>
                            </div>
                            <div className="flex items-baseline gap-2 mb-3">
                                <div className="h-8 w-16 bg-white/5 rounded"></div>
                                <div className="h-4 w-8 bg-white/5 rounded"></div>
                            </div>
                            <div className="mt-4">
                                <div className="flex justify-between text-xs mb-2">
                                    <div className="h-3 w-16 bg-white/5 rounded"></div>
                                    <div className="h-3 w-8 bg-white/5 rounded"></div>
                                </div>
                                <div className="w-full h-2 bg-white/5 rounded-full"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary Card Loader */}
                <div className="bg-white/5 border border-white/5 rounded-2xl p-5 mb-8 animate-pulse">
                    <div className="flex flex-col sm:flex-row items-center justify-between">
                        <div className="text-center sm:text-left mb-4 sm:mb-0">
                            <div className="h-6 w-40 bg-white/5 rounded-lg mb-1"></div>
                            <div className="h-4 w-48 bg-white/5 rounded"></div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-center">
                                <div className="h-8 w-8 bg-white/5 rounded mb-1"></div>
                                <div className="h-3 w-16 bg-white/5 rounded"></div>
                            </div>
                            <div className="h-8 w-px bg-white/10"></div>
                            <div className="text-center">
                                <div className="h-8 w-8 bg-white/5 rounded mb-1"></div>
                                <div className="h-3 w-16 bg-white/5 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Today's Meals Section Loader */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                        <div className="h-7 w-40 bg-white/5 rounded-lg"></div>
                        <div className="flex items-center gap-2">
                            <div className="h-6 w-20 bg-white/5 rounded-full"></div>
                            <div className="h-6 w-20 bg-white/5 rounded-full"></div>
                        </div>
                    </div>
                    
                    {/* Meal Cards Grid Loader */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="group bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 animate-pulse">
                                <div className="h-40 bg-white/5 relative"></div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="h-5 w-32 bg-white/5 rounded mb-1"></div>
                                            <div className="h-3 w-24 bg-white/5 rounded"></div>
                                        </div>
                                        <div className="p-1.5 bg-white/5 rounded-full w-6 h-6"></div>
                                    </div>
                                    
                                    <div className="grid grid-cols-4 gap-2 mb-4">
                                        {[1, 2, 3, 4].map(j => (
                                            <div key={j} className="text-center bg-white/5 rounded-lg p-2">
                                                <div className="h-4 w-8 bg-white/5 rounded mx-auto mb-1"></div>
                                                <div className="h-2 w-6 bg-white/5 rounded mx-auto"></div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="w-full h-11 bg-white/5 rounded-xl"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    // Add CSS for shimmer animation
    const LoaderCSS = () => (
        <style>{`
            @keyframes shimmer {
                0% { background-position: -200% center; }
                100% { background-position: 200% center; }
            }
            
            .animate-shimmer {
                background-size: 200% 100%;
                animation: shimmer 2s infinite linear;
                background-image: linear-gradient(
                    90deg,
                    rgba(255, 255, 255, 0.1) 0%,
                    rgba(255, 255, 255, 0.2) 50%,
                    rgba(255, 255, 255, 0.1) 100%
                );
            }
        `}</style>
    );

    if (loading) {
        return (
            <>
                <LoaderCSS />
                <InlineLoader />
            </>
        );
    }

    if (error) return (
        <div className="max-w-7xl mx-auto p-10">
            <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-2xl text-red-500">
                <h3 className="font-bold text-lg mb-2">Access Error</h3>
                <p className="mb-4">{error}</p>
                <div className="flex flex-col gap-4">
                    <div className="flex gap-4">
                        <button 
                            onClick={fetchData} 
                            className="bg-red-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-600 transition"
                        >
                            Retry Loading
                        </button>
                        <button 
                            onClick={() => { 
                                localStorage.removeItem("user");
                                localStorage.removeItem("token"); 
                                window.location.href = '/login'; 
                            }} 
                            className="border border-red-500 px-6 py-2 rounded-lg font-bold"
                        >
                            Logout & Re-login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-white font-bold text-2xl sm:text-3xl mb-1">My Meal Plan</h1>
                        <p className="text-gray-400 text-sm">Track and manage your daily nutrition goals</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setIsAddMealModalOpen(true)}
                            className="px-5 py-3 bg-gradient-to-r from-primary to-primary/80 text-black rounded-xl font-bold text-sm hover:from-primary/90 hover:to-primary/70 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-primary/20"
                        >
                            <Plus className="w-4 h-4" />
                            Add Meal
                        </button>
                        <button
                            onClick={() => setIsTargetModalOpen(true)}
                            className="px-5 py-3 bg-gradient-to-r from-white/10 to-white/5 border border-white/10 text-white rounded-xl font-bold text-sm hover:bg-white/5 transition-all duration-300 flex items-center gap-2"
                        >
                            <Target className="w-4 h-4" />
                            Set Targets
                        </button>
                    </div>
                </div>

                {/* Daily Progress Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
                    {[
                        ["Calories", dailyTotals.calories, goals.calories, "kcal", "from-blue-500 to-cyan-500", <Flame className="w-5 h-5" />],
                        ["Protein", dailyTotals.protein, goals.protein, "g", "from-primary to-purple-500", <Beef className="w-5 h-5" />],
                        ["Carbs", dailyTotals.carbs, goals.carbs, "g", "from-green-500 to-emerald-500", <Wheat className="w-5 h-5" />],
                        ["Fats", dailyTotals.fats, goals.fats, "g", "from-yellow-500 to-amber-500", <Droplets className="w-5 h-5" />],
                    ].map(([label, value, goal, unit, gradient, icon]) => (
                        <div key={label} className="bg-card/50 backdrop-blur-sm rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all duration-300">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient}`}>
                                        {icon}
                                    </div>
                                    <span className="text-xs font-bold text-gray-400 uppercase">{label}</span>
                                </div>
                                <span className="text-xs text-gray-500">{goal}{unit}</span>
                            </div>
                            <div className="flex items-baseline gap-2 mb-3">
                                <h3 className="text-2xl sm:text-3xl font-black text-white">{value}</h3>
                                <span className="text-sm text-gray-500">{unit}</span>
                            </div>
                            <div className="mt-4">
                                <div className="flex justify-between text-xs text-gray-400 mb-2">
                                    <span>Progress</span>
                                    <span className="font-bold">{percent(value, goal)}%</span>
                                </div>
                                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-500`}
                                        style={{ width: `${percent(value, goal)}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary Card */}
                <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl p-5 mb-8 border border-primary/20">
                    <div className="flex flex-col sm:flex-row items-center justify-between">
                        <div className="text-center sm:text-left mb-4 sm:mb-0">
                            <h3 className="text-white font-bold text-lg mb-1">Daily Summary</h3>
                            <p className="text-gray-400 text-sm">
                                {completedMeals.length} of {userMeals.length} meals completed
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-black text-white">{completedMeals.length}</div>
                                <div className="text-xs text-gray-400">Completed</div>
                            </div>
                            <div className="h-8 w-px bg-white/10" />
                            <div className="text-center">
                                <div className="text-2xl font-black text-white">{pendingMeals.length}</div>
                                <div className="text-xs text-gray-400">Pending</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User's Meal Plan */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                        <h2 className="text-white font-bold text-xl">Today's Meals</h2>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full">
                                {completedMeals.length} Done
                            </span>
                            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">
                                {pendingMeals.length} Pending
                            </span>
                        </div>
                    </div>
                    
                    {userMeals.length === 0 ? (
                        <div className="bg-card/50 backdrop-blur-sm rounded-2xl border-2 border-dashed border-white/10 p-8 sm:p-12 text-center">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-4">
                                <Plus className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                            </div>
                            <h3 className="text-white text-xl font-semibold mb-2">No meals planned for today</h3>
                            <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
                                Start by adding meals to track your nutrition and achieve your daily goals
                            </p>
                            <button
                                onClick={() => setIsAddMealModalOpen(true)}
                                className="px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-black rounded-xl font-bold text-sm hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-lg hover:shadow-primary/20"
                            >
                                Add Your First Meal
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Pending Meals */}
                            {pendingMeals.length > 0 && (
                                <div>
                                    <h3 className="text-white font-medium mb-4 text-lg">Pending Meals ({pendingMeals.length})</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                                        {pendingMeals.map(userMeal => (
                                            <MealCard
                                                key={userMeal._id}
                                                userMeal={userMeal}
                                                onToggleDone={handleToggleMealDone}
                                                onRemove={handleRemoveMeal}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {/* Completed Meals */}
                            {completedMeals.length > 0 && (
                                <div>
                                    <h3 className="text-white font-medium mb-4 text-lg">Completed Meals ({completedMeals.length})</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                                        {completedMeals.map(userMeal => (
                                            <MealCard
                                                key={userMeal._id}
                                                userMeal={userMeal}
                                                onToggleDone={handleToggleMealDone}
                                                onRemove={handleRemoveMeal}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Add Meal Modal */}
                {isAddMealModalOpen && (
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 overflow-y-auto">
                        <div className="min-h-full flex items-center justify-center p-4">
                            <div className="bg-gradient-to-b from-card to-charcoal rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl">
                                <div className="sticky top-0 bg-card border-b border-white/10 px-6 py-4 flex justify-between items-center">
                                    <div>
                                        <h3 className="text-white text-xl font-bold">Add Meal to Your Plan</h3>
                                        <p className="text-gray-400 text-sm">Select from available meals</p>
                                    </div>
                                    <button
                                        onClick={() => setIsAddMealModalOpen(false)}
                                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                    >
                                        <X className="w-5 h-5 text-white" />
                                    </button>
                                </div>
                                
                                <div className="p-6">
                                    {/* Filters */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-300 font-medium">Search Meals</label>
                                            <div className="relative">
                                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                                                <input
                                                    type="text"
                                                    placeholder="Search by name or type..."
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-300 font-medium">Filter by Type</label>
                                            <div className="relative">
                                                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                                                <select
                                                    value={selectedType}
                                                    onChange={(e) => setSelectedType(e.target.value)}
                                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                                                >
                                                    <option value="all">All Meal Types</option>
                                                    {MEAL_TYPES.map(type => (
                                                        <option key={type} value={type}>
                                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-300 font-medium">Showing {filteredAvailableMeals.length} meals</label>
                                            <div className="text-sm text-gray-400">
                                                Found {filteredAvailableMeals.length} matching meals
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Available Meals Grid */}
                                    {filteredAvailableMeals.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                                            {filteredAvailableMeals.map(meal => (
                                                <div
                                                    key={meal._id}
                                                    className="group bg-white/5 rounded-xl border border-white/10 overflow-hidden hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
                                                >
                                                    {meal.image ? (
                                                        <div className="relative h-40 overflow-hidden">
                                                            <img
                                                                src={meal.image}
                                                                alt={meal.foods[0]?.name}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                                            <div className="absolute top-3 left-3">
                                                                <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-black/90 text-white border border-white/20 rounded-full">
                                                                    {meal.type}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="h-40 bg-gradient-to-br from-charcoal to-black flex items-center justify-center">
                                                            <div className="text-center">
                                                                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-2">
                                                                    <span className="text-white text-xl">🍽️</span>
                                                                </div>
                                                                <span className="text-xs text-gray-400">No Image</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    
                                                    <div className="p-4">
                                                        <h4 className="font-bold text-white text-base mb-2 truncate">
                                                            {meal.foods[0]?.name || "Unnamed Meal"}
                                                        </h4>
                                                        
                                                        {meal.totals && (
                                                            <div className="grid grid-cols-4 gap-2 mb-4">
                                                                <div className="text-center bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-lg p-2 border border-blue-500/20">
                                                                    <div className="text-blue-400 font-bold text-sm">{meal.totals.calories}</div>
                                                                    <div className="text-gray-400 text-[10px]">Cal</div>
                                                                </div>
                                                                <div className="text-center bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-2 border border-primary/20">
                                                                    <div className="text-primary font-bold text-sm">{meal.totals.protein}g</div>
                                                                    <div className="text-gray-400 text-[10px]">Prot</div>
                                                                </div>
                                                                <div className="text-center bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-lg p-2 border border-green-500/20">
                                                                    <div className="text-green-400 font-bold text-sm">{meal.totals.carbs}g</div>
                                                                    <div className="text-gray-400 text-[10px]">Carb</div>
                                                                </div>
                                                                <div className="text-center bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 rounded-lg p-2 border border-yellow-500/20">
                                                                    <div className="text-yellow-400 font-bold text-sm">{meal.totals.fats}g</div>
                                                                    <div className="text-gray-400 text-[10px]">Fat</div>
                                                                </div>
                                                            </div>
                                                        )}
                                                        
                                                        <button
                                                            onClick={() => handleAddMealToPlan(meal)}
                                                            className="w-full py-3 bg-gradient-to-r from-primary to-primary/80 text-black rounded-lg font-bold text-sm hover:from-primary/90 hover:to-primary/70 transition-all duration-300"
                                                        >
                                                            Add to Today's Plan
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                                                <Filter className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <h4 className="text-white text-lg font-semibold mb-2">No meals found</h4>
                                            <p className="text-gray-400 text-sm">Try adjusting your search filters or check back later</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Targets Modal */}
                {isTargetModalOpen && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
                        <div className="bg-gradient-to-b from-card to-charcoal border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary/80">
                                    <Target className="w-5 h-5 text-black" />
                                </div>
                                <div>
                                    <h3 className="text-white text-xl font-bold">Daily Nutrition Targets</h3>
                                    <p className="text-gray-400 text-sm">Set your daily nutrition goals</p>
                                </div>
                            </div>
                            
                            <div className="space-y-4 mb-8">
                                {[
                                    { key: "calories", label: "Calories", unit: "kcal", icon: <Flame className="w-4 h-4" /> },
                                    { key: "protein", label: "Protein", unit: "g", icon: <Beef className="w-4 h-4" /> },
                                    { key: "carbs", label: "Carbs", unit: "g", icon: <Wheat className="w-4 h-4" /> },
                                    { key: "fats", label: "Fats", unit: "g", icon: <Droplets className="w-4 h-4" /> },
                                ].map(({ key, label, unit, icon }) => (
                                    <div key={key} className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <div className="text-gray-400">{icon}</div>
                                            <label className="text-sm font-medium text-gray-300">
                                                {label} ({unit})
                                            </label>
                                        </div>
                                        <input
                                            type="number"
                                            min="0"
                                            value={tempTargets[key]}
                                            onChange={(e) => handleTargetChange(key, e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                            placeholder={`Enter ${label} target`}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsTargetModalOpen(false)}
                                    className="flex-1 px-4 py-3 border border-white/10 text-white rounded-xl font-medium hover:bg-white/5 transition-all duration-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveTargets}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-primary/80 text-black rounded-xl font-bold hover:from-primary/90 hover:to-primary/70 transition-all duration-300"
                                >
                                    Save Targets
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Meal Card Component
function MealCard({ userMeal, onToggleDone, onRemove }) {
    const getMealTypeColor = (type) => {
        const colors = {
            breakfast: "from-orange-500 to-amber-500",
            lunch: "from-blue-500 to-cyan-500",
            dinner: "from-purple-500 to-pink-500",
            snacks: "from-green-500 to-emerald-500"
        };
        return colors[userMeal.type] || "from-primary to-primary/80";
    };

    return (
        <div className={`group bg-white/5 backdrop-blur-sm rounded-xl border overflow-hidden transition-all duration-300 hover:shadow-lg ${
            userMeal.isDone 
                ? 'border-green-500/30 bg-green-500/5' 
                : 'border-white/10 hover:border-primary/30'
        }`}>
            {userMeal.mealId?.image ? (
                <div className="relative h-40 overflow-hidden">
                    <img
                        src={userMeal.mealId.image}
                        alt={userMeal.mealId.foods[0]?.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-3 left-3">
                        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider bg-gradient-to-r ${getMealTypeColor(userMeal.type)} text-white rounded-full`}>
                            {userMeal.type}
                        </span>
                    </div>
                    {userMeal.isDone && (
                        <div className="absolute top-3 right-3">
                            <div className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                                <CheckCircle className="w-3 h-3" />
                                Done
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="h-40 bg-gradient-to-br from-charcoal to-black relative">
                    <div className="absolute top-3 left-3">
                        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider bg-gradient-to-r ${getMealTypeColor(userMeal.type)} text-white rounded-full`}>
                            {userMeal.type}
                        </span>
                    </div>
                    {userMeal.isDone && (
                        <div className="absolute top-3 right-3">
                            <div className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-xs font-bold flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Done
                            </div>
                        </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-2">
                                <span className="text-white text-xl">🍽️</span>
                            </div>
                            <span className="text-xs text-gray-400">No Image</span>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white text-base mb-1 truncate">
                            {userMeal.mealId?.foods[0]?.name || "Unnamed Meal"}
                        </h4>
                        {userMeal.completedAt && (
                            <div className="flex items-center text-green-400 text-xs">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Completed at {new Date(userMeal.completedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => onRemove(userMeal._id)}
                        className="p-1.5 hover:bg-white/10 rounded-full transition-colors flex-shrink-0 ml-2"
                        title="Remove meal"
                    >
                        <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
                    </button>
                </div>
                
                {userMeal.mealId?.totals && (
                    <div className="grid grid-cols-4 gap-2 mb-4">
                        <div className="text-center bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-lg p-2 border border-blue-500/20">
                            <div className="text-blue-400 font-bold text-sm">{userMeal.mealId.totals.calories}</div>
                            <div className="text-gray-400 text-[10px]">Cal</div>
                        </div>
                        <div className="text-center bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-2 border border-primary/20">
                            <div className="text-primary font-bold text-sm">{userMeal.mealId.totals.protein}g</div>
                            <div className="text-gray-400 text-[10px]">Prot</div>
                        </div>
                        <div className="text-center bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-lg p-2 border border-green-500/20">
                            <div className="text-green-400 font-bold text-sm">{userMeal.mealId.totals.carbs}g</div>
                            <div className="text-gray-400 text-[10px]">Carb</div>
                        </div>
                        <div className="text-center bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 rounded-lg p-2 border border-yellow-500/20">
                            <div className="text-yellow-400 font-bold text-sm">{userMeal.mealId.totals.fats}g</div>
                            <div className="text-gray-400 text-[10px]">Fat</div>
                        </div>
                    </div>
                )}
                
                <button
                    onClick={() => onToggleDone(userMeal._id, userMeal.isDone)}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                        userMeal.isDone
                            ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/5 text-green-400 border border-green-500/20 hover:from-green-500/20 hover:to-emerald-500/10'
                            : 'bg-gradient-to-r from-primary/10 to-primary/5 text-primary border border-primary/20 hover:from-primary/20 hover:to-primary/10'
                    }`}
                >
                    {userMeal.isDone ? '✓ Mark as Undone' : 'Mark as Done'}
                </button>
            </div>
        </div>
    );
}

export default MealPlanner;