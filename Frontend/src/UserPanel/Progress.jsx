import React from "react";
import Grid from "./components/Grid";

function Progress() {
  return (
    <div className="max-w-[1400px] mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Title */}
      <div className="pt-4 sm:pt-0 flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
        <div className="space-y-1">
          <h2 className="text-white text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black tracking-tight">
            Unified Progress Analytics
          </h2>
          <p className="text-gray-400 text-sm sm:text-base lg:text-lg font-medium">
            Holistic health performance trends and muscle volume tracking.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button className="flex items-center justify-center rounded-xl h-10 sm:h-11 px-3 sm:px-4 lg:px-6 bg-white/5 text-white text-xs sm:text-sm font-bold border border-white/10 hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined mr-1 sm:mr-2 text-base sm:text-lg lg:text-xl">
              download
            </span>
            Export
          </button>
          <button className="flex items-center justify-center rounded-xl h-10 sm:h-11 px-3 sm:px-4 lg:px-6 bg-primary text-dark-bg text-xs sm:text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
            <span className="material-symbols-outlined mr-1 sm:mr-2 text-base sm:text-lg lg:text-xl">add</span>
            Log Data
          </button>
        </div>
      </div>

      {/* Time Filter */}
      <div className="flex overflow-x-auto custom-scrollbar pb-2">
        <div className="flex h-9 sm:h-10 lg:h-11 items-center rounded-xl bg-charcoal p-1 border border-white/5 w-full max-w-md gap-1">
          {["Week", "Month", "Year", "All Time"].map((label) => (
            <label
              key={label}
              className="flex cursor-pointer h-full grow items-center justify-center rounded-lg px-2 has-[:checked]:bg-secondary has-[:checked]:text-white text-gray-400 text-xs sm:text-sm font-bold transition-all"
            >
              <span>{label}</span>
              <input
                type="radio"
                name="time-filter"
                value={label}
                className="hidden"
                defaultChecked={label === "Year"}
              />
            </label>
          ))}
        </div>
      </div>

      {/* Weight Trends */}
      <div className="bg-card border border-white/5 p-4 sm:p-6 lg:p-8 rounded-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 lg:mb-8 gap-3 sm:gap-4">
          <div>
            <h3 className="text-white text-lg sm:text-xl font-bold mb-1">Weight Trends</h3>
            <p className="text-gray-500 text-xs sm:text-sm font-medium">
              Body mass fluctuation over the last 12 months
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-white text-2xl sm:text-3xl lg:text-4xl font-black">
              78.5 <span className="text-sm sm:text-base lg:text-lg font-normal text-gray-500">kg</span>
            </p>
            <div className="text-primary text-xs sm:text-sm font-bold flex items-center sm:justify-end gap-1 mt-1">
              <span className="material-symbols-outlined text-sm sm:text-base lg:text-lg">
                trending_down
              </span>{" "}
              -2.4% vs last year
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-48 sm:h-60 lg:h-72 xl:h-[350px] w-full">
          <svg
            className="w-full h-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 1000 300"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line className="stroke-grid-line" strokeDasharray="4" strokeWidth="1" x1="0" x2="1000" y1="50" y2="50"></line>
            <line className="stroke-grid-line" strokeDasharray="4" strokeWidth="1" x1="0" x2="1000" y1="150" y2="150"></line>
            <line className="stroke-grid-line" strokeDasharray="4" strokeWidth="1" x1="0" x2="1000" y1="250" y2="250"></line>
            <path
              d="M0 200 C 100 180, 200 220, 300 150 C 400 80, 500 100, 600 120 C 700 140, 800 60, 900 80 C 1000 100, 1000 300, 1000 300 L 0 300 Z"
              fill="url(#chartGradient)"
            ></path>
            <path
              className="glow-green"
              d="M0 200 C 100 180, 200 220, 300 150 C 400 80, 500 100, 600 120 C 700 140, 800 60, 900 80 C 1000 100"
              stroke="#2bee6c"
              strokeLinecap="round"
              strokeWidth="3"
            ></path>
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="chartGradient" x1="0" x2="0" y1="0" y2="300">
                <stop stopColor="#2bee6c" stopOpacity="0.15"></stop>
                <stop offset="1" stopColor="#2bee6c" stopOpacity="0"></stop>
              </linearGradient>
            </defs>
          </svg>

          <div className="flex justify-between mt-3 sm:mt-4 px-1">
            {["Jan", "Mar", "May", "Jul", "Sep", "Nov"].map((m) => (
              <p key={m} className="text-gray-500 text-[8px] sm:text-[9px] lg:text-[10px] font-black tracking-widest uppercase">
                {m}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Workout & Consistency */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Workout Frequency */}
        <div className="lg:col-span-2 bg-card border border-white/5 p-4 sm:p-6 lg:p-8 rounded-2xl flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 lg:mb-8 gap-3 sm:gap-4">
            <div>
              <h3 className="text-white text-lg sm:text-xl font-bold">Workout Frequency</h3>
              <p className="text-gray-500 text-xs sm:text-sm font-medium">Daily activity distribution</p>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-bold uppercase tracking-wider">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="size-2.5 sm:size-3 lg:size-3.5 rounded-sm bg-white/5"></div>
                <div className="size-2.5 sm:size-3 lg:size-3.5 rounded-sm bg-secondary/20"></div>
                <div className="size-2.5 sm:size-3 lg:size-3.5 rounded-sm bg-secondary/50"></div>
                <div className="size-2.5 sm:size-3 lg:size-3.5 rounded-sm bg-secondary"></div>
              </div>
              <span>More</span>
            </div>
          </div>
          <div className="overflow-x-auto custom-scrollbar pb-2">
            <div className="flex gap-1.5 sm:gap-2 min-w-[500px] sm:min-w-[600px] lg:min-w-[700px]">
              <div className="flex flex-col gap-1 sm:gap-1.5 pt-5 sm:pt-6 pr-1.5 sm:pr-2">
                {["MON", "WED", "FRI"].map((d) => (
                  <div key={d} className="text-[8px] sm:text-[9px] lg:text-[10px] text-gray-600 h-3 sm:h-3.5 flex items-center font-bold">
                    {d}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-1 sm:gap-1.5 w-full">
                <Grid />
              </div>
            </div>
          </div>
        </div>

        {/* Consistency Score */}
        <div className="bg-secondary rounded-2xl p-4 sm:p-6 lg:p-8 text-white relative overflow-hidden group">
          <div className="absolute -right-8 sm:-right-10 -top-8 sm:-top-10 size-32 sm:size-40 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform"></div>
          <h3 className="text-xl sm:text-2xl font-black mb-4 sm:mb-6 lg:mb-8 relative z-10">Consistency Score</h3>
          <div className="space-y-3 sm:space-y-4 lg:space-y-6 relative z-10">
            {[
              ["Weekly Average", "4.2 Days"],
              ["Active Streak", "12 Days"],
              ["Total Workouts", "148"],
              ["Calories Burned", "42.5k"],
            ].map(([label, value], i) => (
              <div
                key={i}
                className={`flex justify-between items-center ${i < 3 ? "border-b border-white/20 pb-2 sm:pb-3 lg:pb-4" : ""}`}
              >
                <p className="font-bold text-white/80 text-sm sm:text-base">{label}</p>
                <p className="text-xl sm:text-2xl font-black">{value}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 sm:mt-6 lg:mt-10 bg-dark-bg text-white py-2.5 sm:py-3 lg:py-4 rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all border border-white/10 relative z-10 text-sm sm:text-base">
            View Detailed Activity
          </button>
        </div>
      </div>
    </div>
  );
}

export default Progress;