import React from "react";

function Notification() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-4 sm:space-y-6">
      {/* Title & Actions */}
      <div className="pt-4 sm:pt-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
            Activity Alerts
          </h2>
          <p className="text-sm sm:text-base text-slate-500 mt-1">
            Stay updated on your progress, goals, and community interactions.
          </p>
        </div>

        <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-surface-dark hover:bg-border-dark border border-border-dark rounded-xl text-slate-200 text-xs sm:text-sm font-bold transition-all">
          <span className="material-symbols-outlined text-base sm:text-lg text-slate-400">
            done_all
          </span>
          Mark all as read
        </button>
      </div>

      {/* Notifications Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Main Notifications */}
        <div className="lg:col-span-8 space-y-3 sm:space-y-4">
          {/* Badge Notification */}
          <div className="bg-card border border-white/5 rounded-2xl p-4 sm:p-6 hover:border-primary/50 transition-all duration-300 relative">
            <div className="flex gap-3 sm:gap-4">
              <div className="flex-shrink-0 size-10 sm:size-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-xl sm:text-2xl">
                  workspace_premium
                </span>
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1 sm:gap-0">
                  <h3 className="text-white font-bold text-sm sm:text-base">New Badge Unlocked!</h3>
                  <span className="text-xs font-medium text-slate-500 bg-slate-800/50 px-2 py-1 rounded-md">
                    Just now
                  </span>
                </div>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  You've earned the <span className="text-primary font-semibold">"Early Bird"</span> badge for completing 5 workouts before 7 AM this week.
                </p>
                <div className="mt-3 flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-primary text-charcoal text-xs font-black rounded-lg uppercase tracking-wide">
                    Share Achievement
                  </button>
                  <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-background-dark border border-border-dark text-slate-300 text-xs font-bold rounded-lg hover:bg-surface-dark">
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
            <div className="absolute top-3 sm:top-4 right-3 sm:right-4 size-2 rounded-full bg-primary animate-pulse"></div>
          </div>

          {/* Hydration Reminder */}
          <div className="bg-card border border-white/5 rounded-2xl p-4 sm:p-6 hover:border-secondary/50 transition-all duration-300">
            <div className="flex gap-3 sm:gap-4">
              <div className="flex-shrink-0 size-10 sm:size-12 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-xl sm:text-2xl">
                  water_drop
                </span>
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 gap-1 sm:gap-0">
                  <h3 className="text-white font-bold text-sm sm:text-base">Hydration Reminder</h3>
                  <span className="text-xs font-medium text-slate-500">15m ago</span>
                </div>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  It's time for your mid-day water intake. You're currently <span className="text-secondary font-semibold">400ml behind</span> your daily target.
                </p>
              </div>
            </div>
          </div>

          {/* Coach Comment */}
          <div className="bg-card border border-white/5 rounded-2xl p-4 sm:p-6 hover:border-primary/50 transition-all duration-300 opacity-80">
            <div className="flex gap-3 sm:gap-4">
              <div className="flex-shrink-0 size-10 sm:size-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                <span className="material-symbols-outlined text-xl sm:text-2xl">
                  chat_bubble
                </span>
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 gap-1 sm:gap-0">
                  <h3 className="text-white font-bold text-sm sm:text-base">Coach Mike commented</h3>
                  <span className="text-xs font-medium text-slate-500">2h ago</span>
                </div>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  "Excellent progress on your squat depth today. Keep focusing on that core stability!"
                </p>
              </div>
            </div>
          </div>

          {/* Weekly Goal Met */}
          <div className="bg-card border border-white/5 rounded-2xl p-4 sm:p-6 hover:border-primary/50 transition-all duration-300 opacity-80">
            <div className="flex gap-3 sm:gap-4">
              <div className="flex-shrink-0 size-10 sm:size-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-xl sm:text-2xl">
                  trending_up
                </span>
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 gap-1 sm:gap-0">
                  <h3 className="text-white font-bold text-sm sm:text-base">Weekly Goal Met</h3>
                  <span className="text-xs font-medium text-slate-500">Yesterday</span>
                </div>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Congratulations! You've reached your calorie burn goal 3 days ahead of schedule.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Summary & Preferences */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-card border border-white/5 p-4 sm:p-6 rounded-2xl">
            <h4 className="text-white font-bold text-base sm:text-lg mb-3 sm:mb-4">Summary</h4>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 bg-primary/5 border border-primary/10 rounded-xl">
                <p className="text-xs text-primary/70 font-bold uppercase mb-1">Unread</p>
                <p className="text-xl sm:text-2xl font-black text-white">12</p>
              </div>
              <div className="p-3 sm:p-4 bg-secondary/5 border border-secondary/10 rounded-xl">
                <p className="text-xs text-secondary/70 font-bold uppercase mb-1">Actions</p>
                <p className="text-xl sm:text-2xl font-black text-white">4</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-4 sm:mt-6 lg:mt-8 pt-4 sm:pt-6 lg:pt-8 border-t border-white/5 text-center text-slate-600 text-xs">
        © 2024 STRIDE. All rights reserved.
      </footer>
    </div>
  );
}

export default Notification;