import React from 'react'

function Training() {
    return (
        <div className="max-w-[1400px] mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="pt-4 sm:pt-0">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">Workout Builder</h2>
                <p className="text-sm sm:text-base text-slate-500 mt-1">Design your personalized routines for <span
                    className="text-primary font-medium">this week</span></p>
            </div>

            {/* Library + Selected Workouts */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
                {/* Exercise Library */}
                <div className="lg:col-span-4 bg-card border border-white/5 p-4 sm:p-6 lg:p-6 rounded-2xl flex flex-col">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Exercise Library</h3>
                    <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1 mb-4 sm:mb-6">
                        <button
                            className="px-3 py-1.5 rounded-lg bg-card border border-white/5 text-primary text-[10px] sm:text-[11px] font-bold flex items-center gap-1.5 whitespace-nowrap">
                            <span className="material-symbols-outlined text-base">grid_view</span> All
                        </button>
                        <button
                            className="px-3 py-1.5 rounded-lg bg-card border border-white/5 text-slate-400 text-[10px] sm:text-[11px] font-bold flex items-center gap-1.5 hover:text-primary transition-colors whitespace-nowrap">
                            <span className="material-symbols-outlined text-base text-primary">fitness_center</span>
                            Strength
                        </button>
                        <button
                            className="px-3 py-1.5 rounded-lg bg-card border border-white/5 text-slate-400 text-[10px] sm:text-[11px] font-bold flex items-center gap-1.5 hover:text-primary transition-colors whitespace-nowrap">
                            <span className="material-symbols-outlined text-base text-primary">bolt</span> Cardio
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3">
                        {/* Exercise Items */}
                        <div
                            className="flex items-center gap-3 p-3 rounded-xl bg-card border border-white/5 hover:border-primary/30 transition-all cursor-pointer group">
                            <div className="size-12 sm:size-14 rounded-lg bg-cover bg-center shrink-0 border border-white/5"
                                style={{ backgroundImage: `url('https://via.placeholder.com/150')` }}>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p
                                    className="font-bold text-sm text-white group-hover:text-primary transition-colors truncate">
                                    Barbell Bench Press</p>
                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Chest,
                                    Triceps</p>
                            </div>
                            <button
                                className="size-7 sm:size-8 rounded-lg bg-white/5 border border-white/5 text-gray-400 group-hover:bg-primary group-hover:text-black flex items-center justify-center transition-all">
                                <span className="material-symbols-outlined text-base sm:text-lg">add</span>
                            </button>
                        </div>
                        {/* Repeat for other exercises as needed */}
                    </div>
                </div>

                {/* Selected Workout Plan */}
                <div className="lg:col-span-8 bg-card border border-white/5 p-4 sm:p-6 lg:p-8 rounded-2xl flex flex-col">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Selected Workout Plan</h3>
                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 sm:space-y-4">
                        <div className="bg-card border border-white/5 p-3 sm:p-4 rounded-2xl flex justify-between items-center">
                            <div>
                                <p className="font-bold text-sm sm:text-base text-white">Barbell Bench Press</p>
                                <p className="text-[10px] text-slate-500">Chest, Triceps • 4 sets x 10 reps</p>
                            </div>
                            <span className="material-symbols-outlined text-sm text-gray-400 hover:text-red-500 cursor-pointer">delete</span>
                        </div>
                        {/* Add more workout cards here */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Training