import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { 
  Flame, 
  Heart, 
  BatteryCharging, 
  Moon, 
  TrendingDown, 
  TrendingUp, 
  ArrowRight,
  Dumbbell,
  Footprints, 
  Waves,
  Target,
  Search
} from 'lucide-react';

function Dashboard() {
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [userTargets, setUserTargets] = useState({ calories: 0, protein: 0, carbs: 0, fats: 0 });
  const [currentNutrition, setCurrentNutrition] = useState({ calories: 0, protein: 0, carbs: 0, fats: 0 });
  const [weightData, setWeightData] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  const COLOR_PRIMARY = "#22D3EE"; 
  const COLOR_SUCCESS = "#39FF14"; 

  useEffect(() => {
    const date = new Date();
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    setCurrentDate(date.toLocaleDateString('en-US', options));
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem("token");
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userId = storedUser?.id;

      if (!token || !userId) throw new Error("Authentication failed. Please log in again.");

      const config = { headers: { Authorization: `Bearer ${token}` } };

      const targetRes = await axios.get("http://localhost:5000/api/targets", config);
      setUserTargets(targetRes.data || { calories: 2000, protein: 150, carbs: 200, fats: 70 });

      const mealRes = await axios.get("http://localhost:5000/api/user-meals", config);
      const consumed = mealRes.data
        .filter(m => m.isDone)
        .reduce((acc, m) => {
          const totals = m.mealId?.totals || { calories: 0, protein: 0, carbs: 0, fats: 0 };
          acc.calories += totals.calories;
          acc.protein += totals.protein;
          acc.carbs += totals.carbs;
          acc.fats += totals.fats;
          return acc;
        }, { calories: 0, protein: 0, carbs: 0, fats: 0 });
      setCurrentNutrition(consumed);

      const progressRes = await axios.get("http://localhost:5000/api/progress", config);
      if (progressRes.data.success) {
        setWeightData(progressRes.data.weightData);
      }

      const workoutRes = await axios.get(`http://localhost:5000/api/user-workouts/${userId}`, config);
      if (workoutRes.data && Array.isArray(workoutRes.data)) {
        const completed = workoutRes.data
          .filter(w => w.status === "completed")
          .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
          .slice(0, 3);

        const enriched = await Promise.all(completed.map(async (w) => {
          const res = await axios.get("http://localhost:5000/api/admin/workouts", config);
          const detail = res.data.workouts?.find(ex => ex._id === w.exerciseId);
          return { ...w, exercise: detail || { title: "Workout", tag: "General" } };
        }));
        setRecentWorkouts(enriched);
      }

    } catch (err) {
      console.error("Dashboard Load Error:", err);
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const chartHeight = 200;
  const chartWidth = 800; 
  const weightsArr = weightData.map(d => d.weight);
  const maxW = Math.max(...weightsArr, 0) + 2;
  const minW = Math.max(0, Math.min(...weightsArr, 0) - 2);
  const getX = (i) => (i * (chartWidth / (weightData.length - 1 || 1)));
  const getY = (v) => chartHeight - ((v - minW) / (maxW - minW || 1)) * chartHeight;
  const linePath = weightData.length > 1 
    ? weightData.map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.weight)}`).join(" ")
    : "";
  const areaPath = weightData.length > 1 ? `${linePath} V ${chartHeight} H 0 Z` : "";

  const caloriesRemaining = Math.max(0, userTargets.calories - currentNutrition.calories);
  const calorieProgress = (currentNutrition.calories / (userTargets.calories || 1)) * 100;

  const formatWorkoutDate = (dateString) => {
    const d = new Date(dateString);
    return isNaN(d) ? 'Recently' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Skeleton Loader Component
  const InlineLoader = () => (
    <div className="max-w-[1400px] mx-auto space-y-4 sm:space-y-6 lg:space-y-8 p-4 md:p-8">
      {/* Header Loader */}
      <div className="pt-4 sm:pt-0">
        <div className="h-8 sm:h-10 w-48 sm:w-64 bg-white/5 rounded-lg mb-2 animate-shimmer"></div>
        <div className="h-4 w-56 sm:w-72 bg-white/5 rounded animate-shimmer"></div>
      </div>
      
      {/* Stats Cards Loader */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-card border border-white/5 p-4 sm:p-6 rounded-2xl animate-pulse">
            <div className="flex justify-between items-start mb-4">
              <div className="h-4 w-24 bg-white/5 rounded"></div>
              <div className="w-6 h-6 bg-white/5 rounded-full"></div>
            </div>
            <div className="h-10 w-20 bg-white/5 rounded mb-4"></div>
            <div className="w-full bg-white/5 h-1.5 rounded-full"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
        {/* Chart Loader */}
        <div className="lg:col-span-8 bg-card border border-white/5 p-4 sm:p-6 lg:p-8 rounded-2xl animate-pulse">
            <div className="h-6 w-40 bg-white/5 rounded mb-10"></div>
            <div className="h-[200px] sm:h-[250px] lg:h-[280px] w-full bg-white/5 rounded-xl"></div>
        </div>

        {/* Nutrition Loader */}
        <div className="lg:col-span-4 bg-card border border-white/5 p-4 sm:p-6 lg:p-8 rounded-2xl animate-pulse">
          <div className="h-6 w-40 bg-white/5 rounded mb-8"></div>
          <div className="flex justify-center mb-10">
            <div className="w-44 h-44 rounded-full border-[12px] border-white/5"></div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-14 w-full bg-white/5 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Loader */}
      <div className="space-y-6">
        <div className="h-8 w-48 bg-white/5 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-card border border-white/5 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  );

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
          rgba(255, 255, 255, 0.03) 0%,
          rgba(255, 255, 255, 0.08) 50%,
          rgba(255, 255, 255, 0.03) 100%
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
    <div className="max-w-[1400px] mx-auto p-10">
      <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-2xl text-red-500">
        <h3 className="font-bold text-lg mb-2">Access Error</h3>
        <p className="mb-4">{error}</p>
        <button onClick={fetchDashboardData} className="bg-red-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-600 transition">
          Retry Loading
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-4 sm:space-y-6 lg:space-y-8 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="pt-4 sm:pt-0">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">Active Pulse</h2>
        <p className="text-sm sm:text-base text-slate-500 mt-1">Summary for <span className="text-primary font-medium">{currentDate}</span></p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-card border border-white/5 p-4 sm:p-6 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Calories</span>
            <Flame className="w-5 h-5 text-primary" />
          </div>
          <div className="flex items-baseline gap-2 mb-4">
            <h3 className="text-2xl sm:text-3xl font-black text-white">{currentNutrition.calories.toLocaleString()}</h3>
            <span className="text-xs font-bold text-slate-500 uppercase">kcal</span>
          </div>
          <div className="w-full bg-white/5 h-1.5 rounded-full">
            <div className="h-full bg-success rounded-full neon-glow" style={{ width: `${Math.min(100, calorieProgress)}%` }}></div>
          </div>
        </div>

        <div className="bg-card border border-white/5 p-4 sm:p-6 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Heart Rate</span>
            <Heart className="w-5 h-5 text-primary" />
          </div>
          <div className="flex items-baseline gap-2 mb-4">
            <h3 className="text-2xl sm:text-3xl font-black text-white">72</h3>
            <span className="text-xs font-bold text-slate-500 uppercase">bpm</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-success">
            <TrendingDown className="w-3 h-3"/>
            <span>NORMAL RANGE</span>
          </div>
        </div>

        <div className="bg-card border border-white/5 p-4 sm:p-6 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recovery Score</span>
            <BatteryCharging className="w-5 h-5 text-primary" />
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
            <Moon className="w-5 h-5 text-primary" />
          </div>
          <div className="flex items-baseline gap-2 mb-4">
            <h3 className="text-2xl sm:text-3xl font-black text-white">8.5</h3>
            <span className="text-xs font-bold text-slate-500 uppercase">hrs</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-success">
            <TrendingUp className="w-3 h-3"/>
            <span>+12% VS LAST NIGHT</span>
          </div>
        </div>
      </div>

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
                  <stop offset="0%" stopColor={COLOR_PRIMARY} stopOpacity="0.15"></stop>
                  <stop offset="100%" stopColor={COLOR_PRIMARY} stopOpacity="0"></stop>
                </linearGradient>
              </defs>
              <path d={areaPath} fill="url(#chartFill)"></path>
              <path d={linePath} fill="none" stroke={COLOR_PRIMARY} strokeWidth="3"></path>
              {weightData.map((d, i) => (
                <circle key={i} cx={getX(i)} cy={getY(d.weight)} fill="#121212" r="4" stroke={COLOR_PRIMARY} strokeWidth="2" />
              ))}
              {weightData.length > 0 && (
                <circle className="neon-glow" cx={getX(weightData.length - 1)} cy={getY(weightData[weightData.length - 1].weight)} fill={COLOR_SUCCESS} r="5" />
              )}
            </svg>
            <div className="flex justify-between mt-6">
              {weightData.slice(-5).map((d, i) => (
                <span key={i} className="text-[10px] font-bold text-slate-500 uppercase">
                  {new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-card border border-white/5 p-4 sm:p-6 lg:p-8 rounded-2xl">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-6 lg:mb-8">Nutrition Summary</h3>
          <div className="relative flex justify-center items-center mb-6 lg:mb-10">
            <svg className="w-44 h-44 transform -rotate-90">
              <circle cx="88" cy="88" fill="transparent" r="74" stroke="rgba(255,255,255,0.03)" strokeWidth="12"></circle>
              <circle cx="88" cy="88" fill="transparent" r="74" stroke={COLOR_PRIMARY} strokeDasharray="464.9" strokeDashoffset={464.9 - (464.9 * Math.min(1, calorieProgress / 100))} strokeWidth="12"></circle>
              <circle className="neon-glow" cx="88" cy="88" fill="transparent" r="74" stroke={COLOR_SUCCESS} strokeDasharray="464.9" strokeDashoffset={464.9 - 10} strokeWidth="12"></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-2xl sm:text-3xl font-black text-white">{caloriesRemaining.toLocaleString()}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Remaining</p>
            </div>
          </div>
          <div className="space-y-3">
            <NutrientRow label="Protein" current={currentNutrition.protein} target={userTargets.protein} type="success" />
            <NutrientRow label="Carbs" current={currentNutrition.carbs} target={userTargets.carbs} type="primary" />
            <NutrientRow label="Fats" current={currentNutrition.fats} target={userTargets.fats} type="success" />
          </div>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6 pb-6 sm:pb-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-xl sm:text-2xl font-bold text-white">Recent Workouts</h3>
          <button onClick={() => window.location.href='/training'} className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
            View Full History <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {recentWorkouts.map((w, i) => (
            <div key={i} className="bg-card border border-white/5 p-4 sm:p-6 rounded-2xl hover:border-primary/40 transition-all group">
              <div className="flex justify-between items-start mb-4 sm:mb-6">
                <div className="p-2 sm:p-3 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-charcoal transition-all">
                  {w.exercise.tag?.toLowerCase() === 'cardio' ? <Footprints className="w-6 h-6" /> : <Dumbbell className="w-6 h-6" />}
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">{formatWorkoutDate(w.completedAt)}</span>
              </div>
              <h4 className="text-white font-bold text-base sm:text-lg">{w.exercise.title}</h4>
              <p className="text-slate-500 text-xs mt-1 mb-4 sm:mb-6">45 mins • Completed</p>
              <div className="flex gap-2">
                <span className="px-2 py-1 rounded bg-white/5 text-[9px] font-black text-success uppercase tracking-tighter">Completed</span>
                <span className="px-2 py-1 rounded bg-white/5 text-[9px] font-black text-slate-400 uppercase tracking-tighter">{w.exercise.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const NutrientRow = ({ label, current, target, type }) => {
  const isPrimary = type === 'primary';
  const percentage = Math.round((current / (target || 1)) * 100);
  return (
    <div className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-white/5 border border-white/5">
      <div className="flex items-center gap-3">
        <div className={`size-3 rounded-full ${isPrimary ? 'bg-primary' : 'bg-success'}`}></div>
        <span className="text-sm font-medium text-slate-300">{label}</span>
      </div>
      <span className="text-sm font-bold text-white">
        {current}g <span className={`${isPrimary ? 'text-primary' : 'text-success'} text-[10px] ml-1`}>{percentage}%</span>
      </span>
    </div>
  );
};

export default Dashboard;