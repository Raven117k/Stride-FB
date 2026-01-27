import React, { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { Link } from "react-router-dom";
import Features from "./Features";
import Pricing from "./Pricing";

function MainHome() {
  useEffect(() => {
    // Smooth scroll for anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute("href"));
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    });

    // Cleanup
    return () => {
      links.forEach((link) =>
        link.removeEventListener("click", () => { })
      );
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-x-hidden overflow-y-hidden bg-charcoal text-white font-display scroll-smooth">
      {/* Background glows */}
      <div className="absolute -top-[10%] -left-[10%] w-1/2 h-1/2 bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-[10%] -right-[10%] w-1/2 h-1/2 bg-success/20 blur-[120px] pointer-events-none" />

      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 h-20 bg-sidebar/80 backdrop-blur-md border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-gradient-to-br from-primary to-primary flex items-center justify-center text-black">
              <span className="material-symbols-outlined filled-icon text-2xl">bolt</span>
            </div>
            <h1 className="text-white text-lg font-black tracking-tight italic">STRIDE</h1>
          </div>

          <div className="hidden md:flex gap-8">
            {["Home", "Features", "Pricing"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-semibold text-gray-400 hover:text-white transition cursor-pointer"
              >
                {item}
              </a>
            ))}
          </div>

          <Link
            to="/login"
            className="px-6 py-2.5 rounded-full bg-primary text-black font-black text-sm hover:brightness-110 shadow-lg transition cursor-pointer"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main id="home" className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <HeroContent />
          <DashboardMock />
        </div>
      </main>

      {/* Ecosystem Logos */}
      <div className="max-w-7xl mx-auto px-6 py-12 mt-12 border-t border-border-subtle/50 overflow-hidden">
        <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] text-center mb-8">
          Integrated with your favorite ecosystems
        </p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-30 grayscale transition-all hover:opacity-100 hover:grayscale-0">
          {[
            ["watch", "SmartWear"],
            ["fitness_center", "GymCloud"],
            ["health_metrics", "BioSync"],
            ["run_circle", "TrackPro"],
          ].map(([icon, name]) => (
            <div key={name} className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">{icon}</span>
              <span className="font-bold">{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <section id="features">
        <Features />
      </section>

      {/* Pricing Section */}
      <section id="pricing">
        <Pricing />
      </section>
    </div>
  );
}

function HeroContent() {
  return (
    <div className="space-y-8">
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
        <span className="size-2 rounded-full bg-success animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-success">
          New Version 2.0 Live
        </span>
      </div>

      <h1 className="text-6xl md:text-5xl lg:text-8xl font-black leading-[0.9] uppercase italic tracking-tighter">
        Level Up Your <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-success">
          Fitness .
        </span>
      </h1>

      <p className="text-gray-400 text-lg md:text-xl max-w-lg leading-relaxed">
        The ultimate dashboard for elite athletes and biohackers. Track every heartbeat, rep, and recovery metric with precision intelligence.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Link
          to="/login"
          className="bg-primary text-black px-8 py-4 rounded-xl font-black hover:scale-105 transition shadow-xl flex items-center gap-2 inline-flex"
        >
          Get Started for Free
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </Link>
      </div>
      <div className="flex items-center gap-6 pt-8">{/* Avatars + Rating */}</div>
    </div>
  );
}

function DashboardMock() {
  const stats = [
    ["Heart Rate", "128", "favorite"],
    ["Calories", "860", "local_fire_department"],
    ["Steps", "10.2k", "directions_walk"],
  ];

  const chartData = [40, 65, 55, 80, 70, 90, 60];
  const controls = useAnimation();
  const chartRef = useRef(null);

  // Use Intersection Observer to trigger animation when in viewport
  useEffect(() => {
    const currentChartRef = chartRef.current; // ✅ Store in variable

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controls.start("visible");
        }
      },
      { threshold: 0.3 }
    );

    if (currentChartRef) observer.observe(currentChartRef);

    return () => {
      if (currentChartRef) observer.unobserve(currentChartRef); // ✅ Use the variable
    };
  }, [controls]);

  return (
    <div className="relative" ref={chartRef}>
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-success/20 blur-[100px] opacity-30" />

      {/* Main card */}
      <motion.div
        className="relative bg-card border border-white/10 rounded-3xl p-3 shadow-2xl lg:-rotate-3 hover:rotate-0 hover:scale-105 transition-transform duration-700 ease-out"
        initial={{ opacity: 0, y: 20 }}
        animate={controls}
        variants={{
          visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
        }}
      >
        <div className="bg-charcoal rounded-2xl aspect-[16/10] border border-white/10 p-4 flex flex-col gap-4">
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-gray-400">
              Performance Overview
            </span>
            <motion.span
              className="text-xs font-bold text-success"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              Today
            </motion.span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {stats.map(([label, value, icon]) => (
              <motion.div
                key={label}
                className="bg-white/5 border border-white/10 rounded-xl p-3 cursor-pointer"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <span className="material-symbols-outlined text-success text-sm">{icon}</span>
                <div className="text-lg font-black">{value}</div>
                <div className="text-[10px] text-gray-400 uppercase font-bold">{label}</div>
              </motion.div>
            ))}
          </div>

          {/* Chart */}
          <div className="flex items-end gap-2 flex-1 pt-2">
            {chartData.map((h, i) => (
              <motion.div
                key={i}
                className="flex-1 bg-gradient-to-t from-success to-primary rounded-md origin-bottom"
                initial={{ height: 0 }}
                variants={{
                  visible: { height: `${h}%`, transition: { duration: 0.8, delay: i * 0.1, ease: "easeOut" } },
                }}
                animate={controls}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Floating cards */}
      <motion.div
        className="absolute -top-10 -right-10 size-24 bg-primary/10 border border-primary/30 rounded-2xl hidden lg:flex items-center justify-center backdrop-blur shadow-xl"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="material-symbols-outlined text-primary text-4xl">monitoring</span>
      </motion.div>

      <motion.div
        className="absolute -bottom-6 -left-12 p-4 bg-success/10 border border-success/30 rounded-2xl hidden lg:flex items-center gap-3 backdrop-blur shadow-xl"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="size-8 rounded-full bg-success flex items-center justify-center text-black">
          <span className="material-symbols-outlined text-sm">check</span>
        </div>
        <div>
          <span className="text-[10px] font-black uppercase text-success">Goal Reached</span>
          <span className="text-xs font-bold">10k Steps Daily</span>
        </div>
      </motion.div>
    </div>
  );
}

export default MainHome;
