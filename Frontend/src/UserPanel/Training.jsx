import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Plus, Trash2, CheckCircle, Circle, Search, Filter, Target, AlertCircle } from "lucide-react";

function Training() {
    // Pull current user from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser?.id;
    
    const [library, setLibrary] = useState([]);
    const [userPlan, setUserPlan] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDifficulty, setSelectedDifficulty] = useState("all");
    const [selectedTag, setSelectedTag] = useState("all");

    // Create enriched workout data with exercise details
    const enrichedUserPlan = useMemo(() => {
        return userPlan.map(workout => {
            const exercise = library.find(e => e._id === workout.exerciseId);
            
            if (typeof workout.exerciseId === 'object') {
                return workout;
            }
            
            return {
                ...workout,
                exerciseId: exercise || { 
                    _id: workout.exerciseId, 
                    title: "Exercise Deleted",
                    tag: "Unknown",
                    difficulty: "Beginner"
                }
            };
        });
    }, [userPlan, library]);

    // Filter library based on search and filters
    const filteredLibrary = useMemo(() => {
        return library.filter(exercise => {
            const matchesSearch = exercise.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                exercise.tag?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesDifficulty = selectedDifficulty === "all" || exercise.difficulty === selectedDifficulty;
            const matchesTag = selectedTag === "all" || exercise.tag === selectedTag;
            
            return matchesSearch && matchesDifficulty && matchesTag;
        });
    }, [library, searchQuery, selectedDifficulty, selectedTag]);

    useEffect(() => {
        if (!userId) {
            setError("Please log in to view your plan.");
            setLoading(false);
            return;
        }

        const fetchAll = async () => {
            try {
                setLoading(true);
                const [libRes, planRes] = await Promise.all([
                    axios.get("http://localhost:5000/api/admin/workouts"),
                    axios.get(`http://localhost:5000/api/user-workouts/${userId}`)
                ]);

                const workouts = Array.isArray(libRes.data.workouts) ? libRes.data.workouts : [];
                const plan = Array.isArray(planRes.data) ? planRes.data : [];
                
                setLibrary(workouts);
                setUserPlan(plan);
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Failed to load workouts. Please check your connection.");
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, [userId]);

    const addToPlan = async (exerciseId) => {
        if (!userId) {
            console.error("No user ID available");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(
                "http://localhost:5000/api/user-workouts/add", 
                {
                    userId,
                    exerciseId
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
            
            const exercise = library.find(e => e._id === exerciseId);
            const newWorkout = {
                ...res.data,
                exerciseId: exercise || { 
                    _id: exerciseId, 
                    title: "Exercise",
                    tag: "General",
                    difficulty: "Beginner"
                }
            };
            
            setUserPlan(prev => [newWorkout, ...prev]);
        } catch (err) {
            setError(`Failed to add workout: ${err.response?.data?.message || err.message}`);
            setTimeout(() => setError(""), 3000);
        }
    };

    const toggleStatus = async (id) => {
        try {
            const res = await axios.patch(`http://localhost:5000/api/user-workouts/toggle/${id}`);
            
            setUserPlan(prev =>
                prev.map(item => {
                    if (item._id === id) {
                        return { 
                            ...item, 
                            status: res.data.status,
                            completedAt: res.data.completedAt
                        };
                    }
                    return item;
                })
            );
        } catch (err) {
            console.error("Toggle failed:", err);
        }
    };

    const removeFromPlan = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/user-workouts/remove/${id}`);
            setUserPlan(prev => prev.filter(item => item._id !== id));
        } catch (err) {
            console.error("Remove failed:", err);
        }
    };

    const completedCount = enrichedUserPlan.filter(ex => ex.status === "completed").length;
    const progress = enrichedUserPlan.length > 0 ? Math.round((completedCount / enrichedUserPlan.length) * 100) : 0;

    // Get unique tags and difficulties for filters
    const tags = useMemo(() => {
        const tagSet = new Set(library.map(ex => ex.tag).filter(Boolean));
        return ["all", ...Array.from(tagSet)];
    }, [library]);

    const difficulties = useMemo(() => {
        const diffSet = new Set(library.map(ex => ex.difficulty).filter(Boolean));
        return ["all", ...Array.from(diffSet)];
    }, [library]);

    // Inline Loader Component - Mobile Responsive
    const InlineLoader = () => (
        <div className="max-w-[1400px] mx-auto space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6 lg:p-8">
            {/* Header with shimmer effect */}
            <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3 xs:gap-4">
                <div className="w-full xs:w-auto">
                    <div className="h-8 sm:h-9 md:h-10 w-48 sm:w-56 md:w-64 bg-white/5 rounded-lg mb-2 animate-pulse"></div>
                    <div className="h-3 sm:h-4 w-36 sm:w-44 md:w-48 bg-white/5 rounded animate-pulse"></div>
                </div>
                <div className="text-right">
                    <div className="h-8 sm:h-10 w-16 sm:w-20 bg-white/5 rounded-lg mb-1 animate-pulse"></div>
                    <div className="h-3 w-20 sm:w-24 bg-white/5 rounded animate-pulse"></div>
                </div>
            </div>

            {/* Progress Bar shimmer */}
            <div className="w-full bg-white/5 h-1.5 sm:h-2 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-white/10 via-white/20 to-white/10 rounded-full animate-shimmer" style={{ width: '30%' }}></div>
            </div>

            {/* Filter Section Loader */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="h-10 sm:h-12 w-full bg-white/5 rounded-lg sm:rounded-xl animate-pulse"></div>
                <div className="h-10 sm:h-12 w-full bg-white/5 rounded-lg sm:rounded-xl animate-pulse"></div>
                <div className="h-10 sm:h-12 w-full bg-white/5 rounded-lg sm:rounded-xl animate-pulse"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 md:gap-8">
                {/* Exercise Library Loader */}
                <div className="lg:col-span-5 xl:col-span-4 bg-card border border-white/5 p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl h-[500px] sm:h-[550px] md:h-[600px] flex flex-col">
                    <div className="h-6 sm:h-7 w-32 sm:w-40 bg-white/5 rounded-lg mb-3 sm:mb-4 animate-pulse"></div>
                    <div className="h-3 sm:h-4 w-40 sm:w-56 bg-white/5 rounded mb-4 sm:mb-6 animate-pulse"></div>
                    
                    <div className="flex-1 overflow-y-auto space-y-2 sm:space-y-3 -mx-1 sm:mx-0 px-1 sm:px-0">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-card border border-white/5">
                                <div className="size-10 sm:size-12 md:size-14 rounded sm:rounded-lg bg-white/5 animate-pulse"></div>
                                <div className="flex-1 min-w-0 space-y-1.5 sm:space-y-2">
                                    <div className="h-3 sm:h-4 w-24 sm:w-32 bg-white/5 rounded animate-pulse"></div>
                                    <div className="h-2.5 sm:h-3 w-16 sm:w-24 bg-white/5 rounded animate-pulse"></div>
                                    <div className="h-2 w-12 sm:w-16 bg-white/5 rounded animate-pulse"></div>
                                </div>
                                <div className="size-6 sm:size-8 rounded sm:rounded-lg bg-white/5 animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* User Plan Loader */}
                <div className="lg:col-span-7 xl:col-span-8 bg-card border border-white/5 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl h-[500px] sm:h-[550px] md:h-[600px] flex flex-col">
                    <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center mb-4 sm:mb-6 gap-3 xs:gap-0">
                        <div className="h-6 sm:h-7 w-32 sm:w-40 bg-white/5 rounded-lg animate-pulse"></div>
                        <div className="h-3 sm:h-4 w-28 sm:w-36 bg-white/5 rounded animate-pulse"></div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto space-y-2 sm:space-y-3 -mx-1 sm:mx-0 px-1 sm:px-0">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="p-3 sm:p-4 rounded-lg sm:rounded-xl border border-white/5 bg-white/2">
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="size-5 sm:size-6 rounded-full border border-white/10 bg-white/5 animate-pulse"></div>
                                    <div className="flex-1 min-w-0 space-y-1.5 sm:space-y-2">
                                        <div className="h-4 sm:h-5 w-36 sm:w-48 bg-white/5 rounded animate-pulse"></div>
                                        <div className="h-2.5 sm:h-3 w-24 sm:w-32 bg-white/5 rounded animate-pulse"></div>
                                        <div className="h-2 w-32 sm:w-40 bg-white/5 rounded animate-pulse"></div>
                                    </div>
                                    <div className="size-5 sm:size-6 rounded bg-white/5 animate-pulse"></div>
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
            
            @media (max-width: 640px) {
                .mobile-scroll-container {
                    -webkit-overflow-scrolling: touch;
                    scrollbar-width: none;
                }
                .mobile-scroll-container::-webkit-scrollbar {
                    display: none;
                }
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

    return (
        <div className="max-w-[1400px] mx-auto space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6 lg:p-8 animate-in fade-in duration-300">
            {/* Error Display */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/50 p-3 sm:p-4 rounded-lg sm:rounded-xl text-red-500 text-sm sm:text-base flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}
            
            {/* Header */}
            <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3 xs:gap-4">
                <div className="w-full xs:w-auto">
                    <h2 className="text-white font-bold text-xl sm:text-2xl md:text-3xl mb-1">Workout Builder</h2>
                    <p className="text-gray-400 text-sm sm:text-base">Design your personalized routines</p>
                </div>
                <div className="text-right">
                    <div className="flex items-baseline gap-1">
                        <p className="text-primary font-bold text-2xl sm:text-3xl md:text-4xl">{progress}</p>
                        <span className="text-sm sm:text-base text-gray-500">%</span>
                    </div>
                    <p className="text-xs text-gray-500 uppercase font-bold mt-1">
                        Weekly Goal
                    </p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/5 h-1.5 sm:h-2 rounded-full overflow-hidden">
                <div
                    className="bg-primary h-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Filter Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {/* Search Input */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search exercises..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white/5 border border-white/5 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm sm:text-base"
                    />
                </div>

                {/* Difficulty Filter */}
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                    <select
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white/5 border border-white/5 rounded-lg sm:rounded-xl text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm sm:text-base appearance-none"
                    >
                        <option value="all">All Difficulties</option>
                        {difficulties.filter(d => d !== "all").map(diff => (
                            <option key={diff} value={diff}>{diff}</option>
                        ))}
                    </select>
                </div>

                {/* Tag Filter */}
                <div className="relative">
                    <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                    <select
                        value={selectedTag}
                        onChange={(e) => setSelectedTag(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white/5 border border-white/5 rounded-lg sm:rounded-xl text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm sm:text-base appearance-none"
                    >
                        <option value="all">All Categories</option>
                        {tags.filter(t => t !== "all").map(tag => (
                            <option key={tag} value={tag}>{tag}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Stats Summary - Mobile Only */}
            <div className="lg:hidden bg-card/50 border border-white/5 rounded-xl p-3 sm:p-4">
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    <div className="text-center">
                        <div className="text-white font-bold text-lg sm:text-xl">{enrichedUserPlan.length}</div>
                        <div className="text-xs text-gray-500">Total</div>
                    </div>
                    <div className="text-center">
                        <div className="text-green-400 font-bold text-lg sm:text-xl">{completedCount}</div>
                        <div className="text-xs text-gray-500">Completed</div>
                    </div>
                    <div className="text-center">
                        <div className="text-primary font-bold text-lg sm:text-xl">{filteredLibrary.length}</div>
                        <div className="text-xs text-gray-500">Available</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 md:gap-8">
                {/* Exercise Library */}
                <div className="lg:col-span-5 xl:col-span-4 bg-card border border-white/5 p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl h-[500px] sm:h-[550px] md:h-[600px] flex flex-col">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 gap-2 sm:gap-0">
                        <h3 className="text-white font-bold text-lg sm:text-xl">Exercise Library</h3>
                        <div className="text-xs text-gray-500">
                            <span className="hidden sm:inline">Showing {filteredLibrary.length} of {library.length} • </span>
                            <span className="text-primary">{library.length} available</span>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto mobile-scroll-container space-y-2 sm:space-y-3 -mx-1 sm:mx-0 px-1 sm:px-0">
                        {filteredLibrary.length === 0 ? (
                            <div className="text-center py-8 sm:py-12 text-gray-500">
                                <Search className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-3 opacity-50" />
                                <p className="text-sm sm:text-base mb-1">No exercises found</p>
                                <p className="text-xs sm:text-sm">Try adjusting your filters</p>
                            </div>
                        ) : (
                            filteredLibrary.map(exercise => (
                                <div
                                    key={exercise._id}
                                    className="group flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-card border border-white/5 hover:border-primary/30 transition-all duration-300 active:scale-[0.98]"
                                >
                                    <div
                                        className="size-10 sm:size-12 md:size-14 rounded sm:rounded-lg bg-cover bg-center flex-shrink-0 border border-white/5"
                                        style={{
                                            backgroundImage: `url(${exercise.imageUrl?.replace(/\\/g, "/") || "https://images.unsplash.com/photo-1536922246289-88c42f957773?w=150&h=150&fit=crop&crop=center"})`
                                        }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-white text-sm sm:text-base truncate">{exercise.title}</p>
                                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1">
                                            <span className="text-[10px] sm:text-xs text-slate-500 uppercase bg-white/5 px-1.5 py-0.5 rounded">
                                                {exercise.tag}
                                            </span>
                                            <span className={`text-[10px] sm:text-xs uppercase px-1.5 py-0.5 rounded ${
                                                exercise.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                                                exercise.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-red-500/20 text-red-400'
                                            }`}>
                                                {exercise.difficulty}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => addToPlan(exercise._id)}
                                        className="size-6 sm:size-8 rounded sm:rounded-lg bg-white/5 hover:bg-primary hover:text-black flex-shrink-0 transition-all duration-300 active:scale-90 flex items-center justify-center"
                                        title="Add to plan"
                                    >
                                        <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* User Plan */}
                <div className="lg:col-span-7 xl:col-span-8 bg-card border border-white/5 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl h-[500px] sm:h-[550px] md:h-[600px] flex flex-col">
                    <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center mb-4 sm:mb-6 gap-3 xs:gap-0">
                        <div>
                            <h3 className="text-white font-bold text-lg sm:text-xl">Your Plan</h3>
                            <p className="text-xs text-gray-500 mt-1">
                                {enrichedUserPlan.length} exercises • {completedCount} completed
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                    <div className="size-2 rounded-full bg-green-500"></div>
                                    <span>Completed</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="size-2 rounded-full bg-gray-500"></div>
                                    <span>Pending</span>
                                </div>
                            </div>
                            {enrichedUserPlan.length > 0 && (
                                <button
                                    onClick={() => window.confirm("Clear all workouts?") && setUserPlan([])}
                                    className="text-xs text-red-400 hover:text-red-300 border border-red-400/30 hover:border-red-400/50 px-2 sm:px-3 py-1 rounded-lg transition-colors"
                                >
                                    Clear All
                                </button>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto mobile-scroll-container space-y-2 sm:space-y-3 -mx-1 sm:mx-0 px-1 sm:px-0">
                        {enrichedUserPlan.length === 0 ? (
                            <div className="text-center py-8 sm:py-12 text-gray-500">
                                <Target className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-3 opacity-50" />
                                <p className="text-sm sm:text-base mb-1">Your plan is empty</p>
                                <p className="text-xs sm:text-sm">Add exercises from the library to get started</p>
                                <button
                                    onClick={() => document.querySelector('input[type="text"]')?.focus()}
                                    className="mt-4 px-4 py-2 bg-primary text-black rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
                                >
                                    Browse Exercises
                                </button>
                            </div>
                        ) : (
                            enrichedUserPlan.map(item => {
                                const exercise = typeof item.exerciseId === 'object' 
                                    ? item.exerciseId 
                                    : { 
                                        _id: item.exerciseId, 
                                        title: "Exercise", 
                                        tag: "Unknown",
                                        difficulty: "Beginner"
                                    };
                                
                                const isCompleted = item.status === "completed";
                                
                                return (
                                    <div
                                        key={item._id}
                                        className={`group p-3 sm:p-4 rounded-lg sm:rounded-xl border flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 transition-all duration-300 ${
                                            isCompleted 
                                                ? "border-green-500/30 bg-gradient-to-r from-green-500/5 to-transparent" 
                                                : "border-white/5 hover:border-white/20 hover:bg-white/2"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                                            <button
                                                onClick={() => toggleStatus(item._id)}
                                                className={`size-5 sm:size-6 rounded-full border flex-shrink-0 transition-all duration-300 active:scale-90 ${
                                                    isCompleted 
                                                        ? "bg-green-500 border-green-500" 
                                                        : "border-white/30 hover:border-primary"
                                                }`}
                                                title={isCompleted ? "Mark as pending" : "Mark as completed"}
                                            >
                                                {isCompleted && (
                                                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white mx-auto" />
                                                )}
                                            </button>
                                            <div className="flex-1 min-w-0">
                                                <p className={`font-bold truncate text-sm sm:text-base ${
                                                    isCompleted ? "text-green-400" : "text-white"
                                                }`}>
                                                    {exercise.title}
                                                </p>
                                                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1">
                                                    <span className="text-[10px] sm:text-xs text-slate-500 uppercase bg-white/5 px-1.5 py-0.5 rounded">
                                                        {exercise.tag}
                                                    </span>
                                                    <span className="text-[10px] sm:text-xs text-gray-500">
                                                        Added {new Date(item.addedAt || item.createdAt).toLocaleDateString()}
                                                    </span>
                                                    {isCompleted && item.completedAt && (
                                                        <span className="text-[10px] sm:text-xs text-green-500">
                                                            ✓ {new Date(item.completedAt).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeFromPlan(item._id)}
                                            className="self-end sm:self-center text-gray-500 hover:text-red-500 transition-colors p-1 active:scale-90 flex items-center gap-1 text-sm"
                                            title="Remove from plan"
                                        >
                                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                            <span className="sm:hidden">Remove</span>
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Training;