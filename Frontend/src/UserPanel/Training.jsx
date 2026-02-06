import React, { useEffect, useState } from "react";
import axios from "axios";

function Training() {
    // Pull current user from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser?.id; // ✅ fixed from _id to id

    const [library, setLibrary] = useState([]);
    const [userPlan, setUserPlan] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

                // Validate responses
                const workouts = Array.isArray(libRes.data.workouts) ? libRes.data.workouts : [];
                const plan = Array.isArray(planRes.data) ? planRes.data : [];

                setLibrary(workouts);
                setUserPlan(plan);

                console.log("Workouts loaded:", workouts.length, "User plan:", plan.length);
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Failed to load workouts. Check console for details.");
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, [userId]);

    const addToPlan = async (exerciseId) => {
        if (!userId) return;

        try {
            const res = await axios.post("http://localhost:5000/api/user-workouts/add", {
                userId,
                exerciseId
            });
            setUserPlan(prev => [res.data, ...prev]);
        } catch (err) {
            console.error("Add failed:", err);
        }
    };

    const toggleStatus = async (id) => {
        try {
            const res = await axios.patch(`http://localhost:5000/api/user-workouts/toggle/${id}`);
            setUserPlan(prev =>
                prev.map(item => item._id === id ? { ...item, status: res.data.status } : item)
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

    const completedCount = userPlan.filter(ex => ex.status === "completed").length;
    const progress = userPlan.length > 0 ? Math.round((completedCount / userPlan.length) * 100) : 0;

    if (loading) return <div className="text-white p-10">Loading Workouts…</div>;
    if (error) return <div className="text-white p-10">{error}</div>;

    return (
        <div className="max-w-[1400px] mx-auto space-y-8 p-4">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-white">Workout Builder</h2>
                    <p className="text-slate-500">Design your personalized routines</p>
                </div>
                <div className="text-right">
                    <p className="text-primary font-bold text-2xl">{progress}%</p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">
                        Weekly Goal
                    </p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div
                    className="bg-primary h-full transition-all"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Exercise Library */}
                <div className="lg:col-span-4 bg-card border border-white/5 p-6 rounded-2xl h-[600px] flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-4">Exercise Library</h3>
                    <div className="flex-1 overflow-y-auto space-y-3">
                        {library.map(exercise => (
                            <div
                                key={exercise._id}
                                className="flex items-center gap-3 p-3 rounded-xl bg-card border border-white/5 hover:border-primary/30"
                            >
                                <div
                                    className="size-14 rounded-lg bg-cover bg-center"
                                    style={{
                                        backgroundImage: `url(${exercise.imageUrl?.replace(/\\/g, "/") || "https://via.placeholder.com/150"})`
                                    }}
                                />
                                <div className="flex-1">
                                    <p className="font-bold text-white truncate">{exercise.title}</p>
                                    <p className="text-[10px] text-slate-500 uppercase">
                                        {exercise.tag} • {exercise.difficulty}
                                    </p>
                                </div>
                                <button
                                    onClick={() => addToPlan(exercise._id)}
                                    className="size-8 rounded-lg bg-white/5 hover:bg-primary hover:text-black"
                                >
                                    +
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* User Plan */}
                <div className="lg:col-span-8 bg-card border border-white/5 p-8 rounded-2xl h-[600px] flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-4">Your Plan ({userPlan.length})</h3>
                    <div className="flex-1 overflow-y-auto space-y-3">
                        {userPlan.length === 0 && (
                            <p className="text-slate-500 text-center py-10">No exercises added yet.</p>
                        )}
                        {userPlan.map(item => (
                            <div
                                key={item._id}
                                className={`p-4 rounded-2xl border flex justify-between items-center ${item.status === "completed" ? "border-primary/40 opacity-70" : "border-white/5"}`}
                            >
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => toggleStatus(item._id)}
                                        className={`size-6 rounded-full border ${item.status === "completed" ? "bg-primary border-primary" : "border-white/20"}`}
                                    />
                                    <div>
                                        <p className="font-bold text-white">
                                            {item.exerciseId?.title || "Exercise Deleted"}
                                        </p>
                                        <p className="text-[10px] text-slate-500 uppercase">
                                            {item.exerciseId?.tag} • {item.status}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeFromPlan(item._id)}
                                    className="text-gray-500 hover:text-red-500"
                                >
                                    🗑
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Training;
