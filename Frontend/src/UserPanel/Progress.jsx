import React, { useEffect, useState } from "react";
import Grid from "./components/Grid";
import axios from "axios";
import { RefreshCw } from "lucide-react"; // Import an icon for better visual

const Progress = () => {
  const [data, setData] = useState({
    stats: {
      total: 0,
      completed: 0,
      streak: 0,
      calories: 0,
      weeklyAvg: "0.0",
      completionRate: "0%",
      lastWorkout: null
    },
    weightData: [],
    userWorkouts: [],
    lastUpdated: null
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchProgressData = async () => {
    try {
      setError("");
      setIsRefreshing(true);

      // Get token from localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      };

      // Fetch all progress data in one API call
      const response = await axios.get("http://localhost:5000/api/progress", config);

      if (response.data.success) {
        setData(response.data);

        // Also fetch user profile for additional info
        try {
          const userRes = await axios.get("http://localhost:5000/api/user/me", config);
          setUser(userRes.data.user || userRes.data);
        } catch (userErr) {
          console.log("User fetch optional, using localStorage data");
          const rawUser = localStorage.getItem("user");
          if (rawUser) setUser(JSON.parse(rawUser));
        }
      } else {
        throw new Error(response.data.message || "Failed to load progress data");
      }
    } catch (err) {
      console.error("Fetch error:", err);

      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
      } else if (err.message.includes("token")) {
        setError("No authentication token found. Please log in again.");
      } else {
        setError(err.response?.data?.message || err.message || "Failed to load progress data");
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchProgressData();
  }, []);

  // Auto-refresh effect
  useEffect(() => {
    let interval;

    if (autoRefresh) {
      interval = setInterval(() => {
        console.log("Auto-refreshing progress data...");
        fetchProgressData();
      }, 30000); // Every 30 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const formatLastWorkout = (dateString) => {
    if (!dateString) return "Never";

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  // Format time for display
  const formatUpdateTime = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes === 1) return '1 minute ago';
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    if (diffMinutes < 120) return '1 hour ago';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Inline Loader Component
  const InlineLoader = () => (
    <div className="max-w-[1400px] mx-auto space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6 lg:p-8">
      {/* Header with shimmer effect - Responsive */}
      <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3 xs:gap-4">
        <div className="w-full xs:w-auto">
          <div className="h-8 sm:h-10 w-48 sm:w-64 bg-white/5 rounded-lg mb-2 animate-pulse"></div>
          <div className="h-3 sm:h-4 w-56 sm:w-72 bg-white/5 rounded animate-pulse"></div>
        </div>
        <div className="flex flex-col xs:items-end gap-2 w-full xs:w-auto">
          <div className="h-8 sm:h-9 w-28 sm:w-32 bg-white/5 rounded-lg animate-pulse"></div>
          <div className="h-3 w-32 sm:w-40 bg-white/5 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Main Grid - Responsive */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Performance Streak Card Loader */}
        <div className="bg-[#111] border border-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl">
          <div className="h-4 w-32 sm:w-40 bg-white/5 rounded-lg mb-2 animate-pulse"></div>
          <div className="h-16 sm:h-20 w-24 sm:w-32 bg-white/5 rounded-xl sm:rounded-2xl mb-6 sm:mb-8 animate-pulse"></div>
          <div className="space-y-3 sm:space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex justify-between items-center py-2 sm:py-3 border-b border-white/5">
                <div className="h-3 sm:h-4 w-28 sm:w-36 bg-white/5 rounded animate-pulse"></div>
                <div className="h-3 sm:h-4 w-16 sm:w-20 bg-white/5 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Body Weight Trend Card Loader */}
        <div className="md:col-span-2 bg-[#111] border border-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start mb-6 sm:mb-8 md:mb-10 gap-4 sm:gap-0">
            <div>
              <div className="h-5 sm:h-6 w-36 sm:w-48 bg-white/5 rounded-lg mb-1 animate-pulse"></div>
              <div className="h-3 sm:h-4 w-40 sm:w-56 bg-white/5 rounded animate-pulse"></div>
              <div className="h-3 w-28 sm:w-32 bg-white/5 rounded mt-1 animate-pulse"></div>
            </div>
            <div className="text-right">
              <div className="h-10 sm:h-12 w-28 sm:w-32 bg-white/5 rounded-lg mb-1 animate-pulse"></div>
              <div className="h-3 sm:h-4 w-24 sm:w-28 bg-white/5 rounded animate-pulse"></div>
            </div>
          </div>

          <div className="relative h-32 sm:h-36 md:h-44 w-full bg-white/5 rounded-lg sm:rounded-xl animate-pulse">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-gray-500 text-xs sm:text-sm">Loading chart...</div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Frequency Card Loader */}
      <div className="bg-[#111] border border-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8">
        <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center mb-4 sm:mb-6 gap-3 xs:gap-0">
          <div className="h-6 sm:h-7 w-36 sm:w-48 bg-white/5 rounded-lg animate-pulse"></div>
          <div className="h-3 sm:h-4 w-32 sm:w-40 bg-white/5 rounded animate-pulse"></div>
        </div>
        <div className="overflow-x-auto -mx-2 sm:mx-0 pb-2">
          <div className="h-48 sm:h-56 md:h-64 bg-white/5 rounded-lg sm:rounded-xl animate-pulse flex items-center justify-center mx-2 sm:mx-0">
            <div className="text-gray-500 text-xs sm:text-sm">Loading activity grid...</div>
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
      
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      .animate-spin {
        animation: spin 1s linear infinite;
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
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 md:p-10">
      <div className="bg-red-500/10 border border-red-500/50 p-4 sm:p-6 rounded-xl sm:rounded-2xl text-red-500">
        <h3 className="font-bold text-base sm:text-lg mb-2">Access Error</h3>
        <p className="mb-4 text-sm sm:text-base">{error}</p>
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={fetchProgressData}
              className="bg-red-500 text-white px-4 sm:px-6 py-2 rounded-lg font-bold hover:bg-red-600 transition text-sm sm:text-base"
            >
              Retry Loading
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                window.location.href = '/login';
              }}
              className="border border-red-500 px-4 sm:px-6 py-2 rounded-lg font-bold text-sm sm:text-base"
            >
              Logout & Re-login
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const { stats, weightData, userWorkouts, lastUpdated } = data;

  // Responsive SVG Chart Logic
  const chartHeight = 200;
  const chartWidth = Math.min(800, window.innerWidth * 0.9);
  const weightsArr = weightData.map(d => d.weight);
  const maxW = Math.max(...weightsArr, 0) + 5;
  const minW = Math.max(0, Math.min(...weightsArr, 0) - 5);
  const getX = (i) => (i * (chartWidth / (weightData.length - 1 || 1)));
  const getY = (v) => chartHeight - ((v - minW) / (maxW - minW || 1)) * chartHeight;
  const linePath = weightData.map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.weight)}`).join(" ");

  return (
    <div className="max-w-[1400px] mx-auto space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6 lg:p-8 animate-in fade-in duration-500">
      {/* Header - Responsive */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6">
        <header className="flex-1">
          <h2 className="text-white font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-1 lg:mb-2">Unified Progress</h2>
          <p className="text-gray-400 text-sm sm:text-base lg:text-lg">Deep dive into your training consistency and body metrics.</p>
        </header>

        {/* Refresh Section - Improved Design */}
        <div className="flex flex-col items-end gap-2 w-full lg:w-auto">
          {/* Refresh Button - Modern Design */}
          <button
            onClick={fetchProgressData}
            disabled={isRefreshing}
            className="group relative overflow-hidden bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 border border-green-500/30 hover:border-green-500/50 text-green-400 hover:text-green-300 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto lg:w-full shadow-lg hover:shadow-green-500/10 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="relative z-10 flex items-center gap-2">
              <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="text-sm sm:text-base font-semibold">
                {isRefreshing ? 'Refreshing...' : 'Refresh Now'}
              </span>
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/10 to-green-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
          </button>

          {/* Updated Time - Now directly below the button */}
          <div className="text-xs text-gray-500 whitespace-nowrap">
            Updated: {formatUpdateTime(lastUpdated)}
          </div>
        </div>
      </div>

      {/* Main Grid - Responsive */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Performance Streak Card */}
        <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl">
          <h3 className="text-green-500 font-bold text-[10px] xs:text-xs uppercase tracking-[0.2em] mb-2">Performance Streak</h3>
          <div className="text-5xl sm:text-6xl md:text-7xl font-black text-white mb-6 sm:mb-8">
            {stats.streak}<span className="text-lg sm:text-xl text-gray-600 ml-2">DAYS</span>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <StatRow label="Weekly Average" value={`${stats.weeklyAvg} workouts`} />
            <StatRow label="Completed Workouts" value={stats.completed} />
            <StatRow label="Last Workout" value={formatLastWorkout(stats.lastWorkout)} />
          </div>
        </div>

        {/* Body Weight Trend Card */}
        <div className="md:col-span-2 bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start mb-6 sm:mb-8 md:mb-10 gap-4 sm:gap-0">
            <div>
              <h3 className="text-white text-lg sm:text-xl font-bold">Body Weight Trend</h3>
              <p className="text-gray-500 text-xs sm:text-sm">Visualizing progress over time</p>
              <div className="text-xs text-gray-600 mt-1">
                {weightData.length} data points
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl sm:text-4xl font-black text-white">
                {weightData[weightData.length - 1]?.weight || user?.weight || 0}
                <span className="text-base sm:text-lg text-gray-500 font-normal"> kg</span>
              </div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1">
                Current weight
              </div>
            </div>
          </div>

          {/* Responsive Chart Container */}
          <div className="relative h-32 sm:h-36 md:h-44 w-full">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-full overflow-visible"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2bee6c" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#2bee6c" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={`${linePath} V ${chartHeight} H 0 Z`} fill="url(#chartFill)" />
              <path
                d={linePath}
                fill="none"
                stroke="#2bee6c"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {weightData.map((d, i) => (
                <circle
                  key={i}
                  cx={getX(i)}
                  cy={getY(d.weight)}
                  r="3.5"
                  fill={d.source === 'workout' ? "#2bee6c" : d.source === 'profile' ? "#3b82f6" : "#6b7280"}
                  stroke="#111"
                  strokeWidth="1.5"
                />
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* Activity Frequency Card - Responsive */}
      <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8">
        <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center mb-4 sm:mb-6 gap-3 xs:gap-0">
          <h3 className="text-white text-lg sm:text-xl font-bold">Activity Frequency</h3>
          <div className="flex items-center gap-3">
            <div className="text-xs sm:text-sm text-gray-500">
              Showing {userWorkouts.length} completed workouts
            </div>

            {/* Mobile Auto-refresh Toggle */}
            <div className="flex lg:hidden items-center gap-1">
              <input
                type="checkbox"
                id="autoRefreshMobile"
                checked={autoRefresh}
                onChange={() => setAutoRefresh(!autoRefresh)}
                className="sr-only peer"
              />
              <label
                htmlFor="autoRefreshMobile"
                className={`relative w-8 h-5 rounded-full cursor-pointer transition-all duration-300 ${autoRefresh ? 'bg-green-500/30' : 'bg-gray-700/50'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300 ${autoRefresh ? 'translate-x-3' : ''}`}></span>
              </label>
              <span className="text-xs text-gray-400">Auto</span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto -mx-2 sm:mx-0 pb-2">
          {userWorkouts.length > 0 ? (
            <div className="min-w-[300px] sm:min-w-full mx-2 sm:mx-0">
              <Grid userPlan={userWorkouts} />
            </div>
          ) : (
            <div className="text-center py-8 sm:py-10 text-gray-500 mx-2 sm:mx-0">
              <p className="text-base sm:text-lg">No completed workouts yet</p>
              <p className="text-xs sm:text-sm mt-2">Complete your first workout to start tracking progress!</p>
              <button
                onClick={() => window.location.href = '/training'}
                className="mt-4 bg-green-500 text-white px-4 sm:px-6 py-2 rounded-lg font-bold hover:bg-green-600 transition text-sm sm:text-base"
              >
                Go to Training
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 sm:py-3 border-b border-white/5">
    <span className="text-gray-500 font-medium text-sm sm:text-base">{label}</span>
    <span className="text-white font-bold text-sm sm:text-base">{value}</span>
  </div>
);

export default Progress;