import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';


function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // store token in localStorage
      localStorage.setItem("token", data.token);

      // store basic user info if needed
      localStorage.setItem("user", JSON.stringify(data.user));

      console.log("Logged in user:", data.user, "Token:", data.token);

      // navigate based on role
      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    } catch (err) {
      setError("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex flex-col bg-charcoal text-white">
      {/* Header */}
      <header className="w-full px-6 lg:px-40 py-5 flex items-center justify-between border-b border-white/5 bg-charcoal/80 backdrop-blur-md fixed top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-charcoal">
            <span className="material-symbols-outlined text-2xl font-bold">bolt</span>
          </div>
          <h2 className="text-white text-xl font-bold tracking-tight">STRIDE</h2>
        </div>
        <div className="flex items-center gap-4 md:gap-8">
          <button className="bg-primary text-charcoal px-5 py-2 rounded-lg text-sm font-bold hover:brightness-110 transition-all shadow-lg shadow-primary/20">
            Download App
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center pt-28 pb-12 px-4 relative overflow-hidden">
        {/* Background Blurs */}
        <div className="absolute top-1/4 -left-24 w-72 h-72 md:w-96 md:h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-24 w-72 h-72 md:w-96 md:h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Login Card */}
        <div className="w-full max-w-md md:max-w-lg lg:max-w-xl bg-navy-card rounded-2xl shadow-2xl border border-white/5 p-6 md:p-10 relative z-10 flex flex-col">
          {/* Title */}
          <div className="flex flex-col items-center mb-8 md:mb-10">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 border border-primary/20">
              <span className="material-symbols-outlined text-primary text-4xl">fitness_center</span>
            </div>
            <h1 className="text-white text-2xl md:text-3xl font-bold text-center">Member Login</h1>
            <p className="text-slate-500 text-sm md:text-base mt-2 text-center">
              Enter your credentials to access your dashboard
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-slate-300 text-xs font-bold uppercase tracking-wider px-1">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl">mail</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-white/10 bg-charcoal text-white focus:outline-none focus:ring-1 focus:ring-primary/50 neon-focus transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Password</label>
                <Link href="#" className="text-soft-blue text-xs font-semibold hover:text-primary transition-colors">Forgot password?</Link>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl">lock</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-white/10 bg-charcoal text-white focus:outline-none focus:ring-1 focus:ring-primary/50 neon-focus transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-3 px-1">
              <input id="remember" type="checkbox" className="w-4 h-4 rounded border-white/10 bg-charcoal text-primary focus:ring-primary cursor-pointer" />
              <label htmlFor="remember" className="text-slate-400 text-sm cursor-pointer select-none">Keep me logged in</label>
            </div>
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}
            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-charcoal font-black py-4 rounded-xl mt-4 hover:brightness-110 active:scale-[0.99] transition-all shadow-lg shadow-primary/20 uppercase tracking-widest text-sm neon-green-shadow"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>

          {/* Register */}
          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm md:text-base">
              New to FitTrack?
              <Link
                to="/signup"
                className="text-soft-blue font-bold hover:text-primary transition-colors ml-1"
              >Create Account</Link>
            </p>
          </div>
        </div>

        {/* Extra Info Cards (hidden on mobile) */}
        <div className="hidden xl:flex flex-col ml-10 max-w-sm space-y-6">
          {/* Health Metrics */}
          <div className="bg-navy-card border border-white/5 p-6 rounded-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-soft-blue/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-soft-blue">monitoring</span>
              </div>
              <div>
                <h4 className="text-white font-bold text-sm md:text-base">Health Metrics</h4>
                <p className="text-slate-500 text-xs md:text-sm">Biometric sync active</p>
              </div>
            </div>
            <div className="h-24 w-full bg-charcoal rounded-xl flex items-end p-3 gap-1 border border-white/5">
              {[40, 65, 50, 85, 70, 90, 60].map((h, i) => (
                <div key={i} className={`flex-1 bg-primary/60 h-[${h}%] rounded-sm`}></div>
              ))}
            </div>
          </div>

          {/* Weekly Goals */}
          <div className="bg-navy-card border border-white/5 p-6 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <span className="material-symbols-outlined text-primary">emoji_events</span>
              </div>
              <div>
                <h4 className="text-white font-bold text-sm md:text-base">Weekly Goals</h4>
                <p className="text-slate-500 text-xs md:text-sm">4/5 sessions completed</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 md:py-8 border-t border-white/5 flex flex-col items-center gap-4 bg-charcoal">
        <div className="flex gap-4 md:gap-8">
          <Link href="#" className="text-slate-500 hover:text-primary transition-colors text-[10px] uppercase tracking-widest font-bold">Privacy</Link>
          <Link href="#" className="text-slate-500 hover:text-primary transition-colors text-[10px] uppercase tracking-widest font-bold">Terms</Link>
          <Link href="#" className="text-slate-500 hover:text-primary transition-colors text-[10px] uppercase tracking-widest font-bold">Security</Link>
        </div>
        <p className="text-slate-700 text-[10px] uppercase tracking-widest">© 2024 FitTrack Performance Systems</p>
      </footer>
    </div>
  );
}

export default Login;


