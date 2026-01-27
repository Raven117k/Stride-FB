import React from 'react'

function Dashboard() {
    return (
        <div className="max-w-[1400px] mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="pt-4 sm:pt-0">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">Active Pulse</h2>
                <p className="text-sm sm:text-base text-slate-500 mt-1">Summary for <span className="text-primary font-medium">Monday, Oct 23rd</span></p>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-card border border-white/5 p-4 sm:p-6 rounded-2xl">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Calories</span>
                        <span className="material-symbols-outlined text-primary">local_fire_department</span>
                    </div>
                    <div className="flex items-baseline gap-2 mb-4">
                        <h3 className="text-2xl sm:text-3xl font-black text-white">2,840</h3>
                        <span className="text-xs font-bold text-slate-500 uppercase">kcal</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full">
                        <div className="h-full bg-success rounded-full neon-glow" style={{ width: "75%" }}></div>
                    </div>
                </div>

                <div className="bg-card border border-white/5 p-4 sm:p-6 rounded-2xl">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Heart Rate</span>
                        <span className="material-symbols-outlined text-primary">monitor_heart</span>
                    </div>
                    <div className="flex items-baseline gap-2 mb-4">
                        <h3 className="text-2xl sm:text-3xl font-black text-white">68</h3>
                        <span className="text-xs font-bold text-slate-500 uppercase">bpm</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-success">
                        <span className="material-symbols-outlined text-sm">trending_down</span>
                        <span>NORMAL RANGE</span>
                    </div>
                </div>

                <div className="bg-card border border-white/5 p-4 sm:p-6 rounded-2xl">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recovery Score</span>
                        <span className="material-symbols-outlined text-primary">battery_charging_full</span>
                    </div>
                    <div className="flex items-baseline gap-2 mb-4">
                        <h3 className="text-2xl sm:text-3xl font-black text-white">92</h3>
                        <span className="text-xs font-bold text-slate-500 uppercase">%</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full">
                        <div className="h-full bg-success rounded-full neon-glow" style={{ width: "92%" }}></div>
                    </div>
                </div>

                <div className="bg-card border border-white/5 p-4 sm:p-6 rounded-2xl">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sleep Quality</span>
                        <span className="material-symbols-outlined text-primary">dark_mode</span>
                    </div>
                    <div className="flex items-baseline gap-2 mb-4">
                        <h3 className="text-2xl sm:text-3xl font-black text-white">8.5</h3>
                        <span className="text-xs font-bold text-slate-500 uppercase">hrs</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-success">
                        <span className="material-symbols-outlined text-sm">arrow_upward</span>
                        <span>+12% VS LAST NIGHT</span>
                    </div>
                </div>
            </div>

            {/* Chart and Nutrition Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
                <div className="lg:col-span-8 bg-card border border-white/5 p-4 sm:p-6 lg:p-8 rounded-2xl">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-10 gap-4">
                        <div>
                            <h3 className="text-lg sm:text-xl font-bold text-white">Weight Progress</h3>
                            <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-widest">Goal: 78.0 kg</p>
                        </div>
                        <div className="flex gap-1 p-1 bg-charcoal rounded-lg border border-white/5">
                            <button className="px-3 py-1.5 rounded-md text-[10px] font-bold text-slate-400">1W</button>
                            <button className="px-3 py-1.5 rounded-md text-[10px] font-bold bg-primary text-charcoal">1M</button>
                            <button className="px-3 py-1.5 rounded-md text-[10px] font-bold text-slate-400">3M</button>
                        </div>
                    </div>
                    <div className="relative h-[200px] sm:h-[250px] lg:h-[280px] w-full">
                        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 200">
                            <defs>
                                <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.15"></stop>
                                    <stop offset="100%" stopColor="#22D3EE" stopOpacity="0"></stop>
                                </linearGradient>
                            </defs>
                            <path d="M0 160 Q 133 140, 266 150 T 532 100 T 800 80 V 200 H 0 Z" fill="url(#chartFill)"></path>
                            <path d="M0 160 Q 133 140, 266 150 T 532 100 T 800 80" fill="none" stroke="#22D3EE" strokeWidth="3"></path>
                            <circle cx="266" cy="150" fill="#121212" r="4" stroke="#22D3EE" strokeWidth="2"></circle>
                            <circle cx="532" cy="100" fill="#121212" r="4" stroke="#22D3EE" strokeWidth="2"></circle>
                            <circle className="neon-glow" cx="800" cy="80" fill="#39FF14" r="5"></circle>
                        </svg>
                        <div className="flex justify-between mt-6">
                            <span className="text-[10px] font-bold text-slate-500">SEP 23</span>
                            <span className="text-[10px] font-bold text-slate-500">SEP 30</span>
                            <span className="text-[10px] font-bold text-slate-500">OCT 07</span>
                            <span className="text-[10px] font-bold text-slate-500">OCT 14</span>
                            <span className="text-[10px] font-bold text-white">OCT 21</span>
                        </div>
                    </div>
                </div>

                {/* Nutrition */}
                <div className="lg:col-span-4 bg-card border border-white/5 p-4 sm:p-6 lg:p-8 rounded-2xl">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-6 lg:mb-8">Nutrition Summary</h3>
                    <div className="relative flex justify-center items-center mb-6 lg:mb-10">
                        {/* Mobile/Tablet SVG */}
                        <svg className="w-32 h-32 sm:w-44 sm:h-44 lg:hidden transform -rotate-90">
                            <circle cx="64" cy="64" fill="transparent" r="54" stroke="rgba(255,255,255,0.03)" strokeWidth="10"></circle>
                            <circle cx="64" cy="64" fill="transparent" r="54" stroke="#22D3EE" strokeDasharray="339.3" strokeDashoffset="102" strokeWidth="10"></circle>
                            <circle className="neon-glow" cx="64" cy="64" fill="transparent" r="54" stroke="#39FF14" strokeDasharray="339.3" strokeDashoffset="255" strokeWidth="10"></circle>
                        </svg>

                        {/* PC/Large SVG (original dimensions) */}
                        <svg className="hidden lg:block w-44 h-44 transform -rotate-90">
                            <circle cx="88" cy="88" fill="transparent" r="74" stroke="rgba(255,255,255,0.03)" strokeWidth="12"></circle>
                            <circle cx="88" cy="88" fill="transparent" r="74" stroke="#22D3EE" strokeDasharray="464.9" strokeDashoffset="140" strokeWidth="12"></circle>
                            <circle className="neon-glow" cx="88" cy="88" fill="transparent" r="74" stroke="#39FF14" strokeDasharray="464.9" strokeDashoffset="350" strokeWidth="12"></circle>
                        </svg>

                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <p className="text-2xl sm:text-3xl font-black text-white">1,850</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Remaining</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-white/5 border border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="size-3 rounded-full bg-success"></div>
                                <span className="text-sm font-medium text-slate-300">Protein</span>
                            </div>
                            <span className="text-sm font-bold text-white">155g <span className="text-success text-[10px] ml-1">35%</span></span>
                        </div>
                        <div className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-white/5 border border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="size-3 rounded-full bg-primary"></div>
                                <span className="text-sm font-medium text-slate-300">Carbs</span>
                            </div>
                            <span className="text-sm font-bold text-white">125g <span className="text-primary text-[10px] ml-1">33%</span></span>
                        </div>
                        <div className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-white/5 border border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="size-3 rounded-full bg-success"></div>
                                <span className="text-sm font-medium text-slate-300">Fats</span>
                            </div>
                            <span className="text-sm font-bold text-white">155g <span className="text-success text-[10px] ml-1">35%</span></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Workouts */}
            <div className="space-y-4 sm:space-y-6 pb-6 sm:pb-0">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h3 className="text-xl sm:text-2xl font-bold text-white">Recent Workouts</h3>
                    <button className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                        View Full History <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    <div className="bg-card border border-white/5 p-4 sm:p-6 rounded-2xl hover:border-primary/40 transition-all group">
                        <div className="flex justify-between items-start mb-4 sm:mb-6">
                            <div className="p-2 sm:p-3 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-charcoal transition-all">
                                <span className="material-symbols-outlined text-xl sm:text-2xl">fitness_center</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase">Today • 08:30 AM</span>
                        </div>
                        <h4 className="text-white font-bold text-base sm:text-lg">Hypertrophy Chest</h4>
                        <p className="text-slate-500 text-xs mt-1 mb-4 sm:mb-6">75 mins • 420 kcal burned</p>
                        <div className="flex gap-2">
                            <span className="px-2 py-1 rounded bg-white/5 text-[9px] font-black text-success uppercase">Success</span>
                            <span className="px-2 py-1 rounded bg-white/5 text-[9px] font-black text-slate-400 uppercase tracking-tighter">Strength</span>
                        </div>
                    </div>

                    <div className="bg-card border border-white/5 p-4 sm:p-6 rounded-2xl hover:border-primary/40 transition-all group">
                        <div className="flex justify-between items-start mb-4 sm:mb-6">
                            <div className="p-2 sm:p-3 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-charcoal transition-all">
                                <span className="material-symbols-outlined text-xl sm:text-2xl">directions_run</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase">Yesterday • 06:15 PM</span>
                        </div>
                        <h4 className="text-white font-bold text-base sm:text-lg">Zone 2 Recovery Run</h4>
                        <p className="text-slate-500 text-xs mt-1 mb-4 sm:mb-6">32 mins • 310 kcal burned</p>
                        <div className="flex gap-2">
                            <span className="px-2 py-1 rounded bg-white/5 text-[9px] font-black text-success uppercase">Completed</span>
                            <span className="px-2 py-1 rounded bg-white/5 text-[9px] font-black text-slate-400 uppercase tracking-tighter">Cardio</span>
                        </div>
                    </div>

                    <div className="bg-card border border-white/5 p-4 sm:p-6 rounded-2xl hover:border-primary/40 transition-all group">
                        <div className="flex justify-between items-start mb-4 sm:mb-6">
                            <div className="p-2 sm:p-3 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-charcoal transition-all">
                                <span className="material-symbols-outlined text-xl sm:text-2xl">pool</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase">Oct 21 • 07:00 AM</span>
                        </div>
                        <h4 className="text-white font-bold text-base sm:text-lg">AM Lap Session</h4>
                        <p className="text-slate-500 text-xs mt-1 mb-4 sm:mb-6">45 mins • 580 kcal burned</p>
                        <div className="flex gap-2">
                            <span className="px-2 py-1 rounded bg-white/5 text-[9px] font-black text-success uppercase">Peak Perf</span>
                            <span className="px-2 py-1 rounded bg-white/5 text-[9px] font-black text-slate-400 uppercase tracking-tighter">Endurance</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard