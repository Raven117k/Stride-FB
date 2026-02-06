import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

function Sidebar({ isMobileMenuOpen, onCloseMobileMenu }) {
  const location = useLocation();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id || storedUser?._id;

  const [userPlan, setUserPlan] = useState([]);
  const [loading, setLoading] = useState(true);

  const navItems = [
    { name: "Overview", icon: "grid_view", path: "/user/" },
    { name: "Training", icon: "fitness_center", path: "/user/training" },
    { name: "Progress", icon: "insights", path: "/user/progress" },
    { name: "Meal Planner", icon: "restaurant", path: "/user/meal" },
    { name: "Settings", icon: "settings", path: "/user/settings" },
  ];

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchUserPlan = async () => {
      try {
        setLoading(true);

        // 1️⃣ Get user workouts
        const res = await axios.get(`http://localhost:5000/api/user-workouts/${userId}`);
        const plan = Array.isArray(res.data) ? res.data : [];

        // 2️⃣ Fetch exercise details for each item
        const detailedPlan = await Promise.all(
          plan.map(async item => {
            const exerciseId = item.exerciseId?.$oid || item.exerciseId;
            if (!exerciseId) return { ...item, exercise: { title: "Deleted", tag: "N/A" } };

            try {
              const exRes = await axios.get(`http://localhost:5000/api/admin/workouts/${exerciseId}`);
              return { ...item, exercise: exRes.data || { title: "Deleted", tag: "N/A" } };
            } catch (err) {
              return { ...item, exercise: { title: "Deleted", tag: "N/A" } };
            }
          })
        );

        setUserPlan(detailedPlan);
      } catch (err) {
        console.error("Failed to fetch user workouts:", err);
        setUserPlan([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPlan();
  }, [userId]);

  // Progress calculation
  const completedCount = userPlan.filter(ex => ex.status === "completed").length;
  const totalCount = userPlan.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleLinkClick = () => {
    if (onCloseMobileMenu) onCloseMobileMenu();
  };

  return (
    <>
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onCloseMobileMenu}
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 h-screen lg:h-auto w-64 bg-sidebar border-r border-white/5 flex flex-col justify-between py-8 px-4 shrink-0 z-40 transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col gap-8 lg:gap-12">
          {/* Logo */}
          <div className="flex gap-3 items-center px-4">
            <div className="bg-primary size-8 lg:size-9 rounded-lg flex items-center justify-center text-charcoal">
              <span className="material-symbols-outlined filled-icon text-xl lg:text-2xl">
                bolt
              </span>
            </div>
            <h1 className="text-white text-base lg:text-lg font-black tracking-tight italic">
              STRIDE
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-1">
            {navItems.map(({ name, icon, path }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={name}
                  to={path}
                  onClick={handleLinkClick}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="material-symbols-outlined text-lg lg:text-xl">{icon}</span>
                  <span className="text-sm">{name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Weekly Goal Card */}
        <div className="bg-gradient-to-br from-primary/5 to-success/5 p-4 rounded-xl border border-white/5 mt-4">
          <p className="text-[10px] font-bold text-success uppercase tracking-widest mb-1">
            Weekly Goal
          </p>
          {loading ? (
            <p className="text-xs text-slate-400 mb-3">Loading…</p>
          ) : totalCount === 0 ? (
            <p className="text-xs text-slate-400 mb-3">No workouts yet</p>
          ) : (
            <p className="text-xs text-slate-400 mb-3">
              {completedCount}/{totalCount} workouts completed
            </p>
          )}
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-success transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
