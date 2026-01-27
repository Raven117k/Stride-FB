import React from 'react'
import { Link } from 'react-router-dom';
function Pricing() {
    return (
        <div>
            <div className="flex-1 font-display ">
                {/* Hero Text */}
                <section className="py-20 px-6 text-center">
                    <div className="max-w-3xl mx-auto">
                        <span className="text-primary text-[10px] font-black uppercase tracking-[0.05em] mb-4 block">
                            Choose Your Level
                        </span>

                        <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-[0.05em] mb-6">
                            Stride{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-success">
                                Pricing Plans
                            </span>
                        </h2>

                        <p className="text-gray-400 text-lg font-medium max-w-xl mx-auto">
                            Push your limits with personalized coaching, real-time analytics, and a community that never quits.
                        </p>
                    </div>
                </section>

                {/* Pricing Cards */}
                <section className="px-6 py-12 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                        {/* Basic Plan */}
                        <div className="relative group bg-card p-10 rounded-2xl border border-white/10 overflow-hidden hover:border-gray-600 transition-colors">
                            <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all"></div>
                            <div className="mb-8 relative z-10">
                                <h3 className="text-2xl font-black text-white uppercase mb-2">Basic</h3>
                                <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Entry Level</p>
                            </div>
                            <div className="mb-8 flex items-baseline gap-1 relative z-10">
                                <span className="text-5xl font-black text-white">$0</span>
                                <span className="text-gray-500 font-bold uppercase text-xs">/month</span>
                            </div>
                            <ul className="space-y-4 mb-12 flex-1 relative z-10">
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-success text-xl font-bold">check</span>
                                    <span className="text-gray-400 text-sm font-medium">Standard Activity Tracking</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-success text-xl font-bold">check</span>
                                    <span className="text-gray-400 text-sm font-medium">Daily Step Counter</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-success text-xl font-bold">check</span>
                                    <span className="text-gray-400 text-sm font-medium">Community Challenges</span>
                                </li>
                                <li className="flex items-center gap-3 opacity-30">
                                    <span className="material-symbols-outlined text-gray-500 text-xl font-bold">close</span>
                                    <span className="text-gray-500 text-sm font-medium">Advanced Heart Analytics</span>
                                </li>
                            </ul>
                            <button onClick={() => (window.location.href = "/login")} className="w-full py-4 bg-success/10 text-success border border-success/30 rounded-2xl font-black uppercase tracking-widest hover:bg-success hover:text-black transition-all relative z-10">
                                Choose Plan
                            </button>
                            <div className="absolute bottom-0 left-0 h-1 w-0 bg-success group-hover:w-full transition-all duration-500 rounded-full"></div>
                        </div>

                        {/* Pro Plan */}
                        <div className="relative group bg-card p-10 rounded-2xl border-2 border-success overflow-hidden flex flex-col h-full neon-glow transform scale-105 z-10">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] z-10">
                                Most Popular
                            </div>
                            <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all"></div>
                            <div className="mb-8 relative z-10">
                                <h3 className="text-2xl font-black text-white uppercase mb-2">Pro</h3>
                                <p className="text-success text-sm font-bold uppercase tracking-widest">High Performance</p>
                            </div>
                            <div className="mb-8 flex items-baseline gap-1 relative z-10">
                                <span className="text-5xl font-black text-white">$29</span>
                                <span className="text-gray-500 font-bold uppercase text-xs">/month</span>
                            </div>
                            <ul className="space-y-4 mb-12 flex-1 relative z-10">
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-success text-xl font-bold">check</span>
                                    <span className="text-gray-400 text-sm font-medium">Everything in Basic</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-success text-xl font-bold">check</span>
                                    <span className="text-gray-400 text-sm font-medium">Advanced Biometrics Monitoring</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-success text-xl font-bold">check</span>
                                    <span className="text-gray-400 text-sm font-medium">Personalized AI Workouts</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-success text-xl font-bold">check</span>
                                    <span className="text-gray-400 text-sm font-medium">Heart Rate Zone Analytics</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-success text-xl font-bold">check</span>
                                    <span className="text-gray-400 text-sm font-medium">No Ads Experience</span>
                                </li>
                            </ul>
                            <button onClick={() => (window.location.href = "/login")} className="w-full py-4 bg-success text-black rounded-2xl font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_0_15px_rgba(57,255,20,0.4)] relative z-10">
                                Choose Plan
                            </button>
                            <div className="absolute bottom-0 left-0 h-1 w-0 bg-success group-hover:w-full transition-all duration-500 rounded-full"></div>
                        </div>

                        {/* Elite Plan */}
                        <div className="relative group bg-card p-10 rounded-2xl border border-white/10 overflow-hidden flex flex-col h-full hover:border-gray-600 transition-colors">
                            <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all"></div>
                            <div className="mb-8 relative z-10">
                                <h3 className="text-2xl font-black text-white uppercase mb-2">Elite</h3>
                                <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Professional</p>
                            </div>
                            <div className="mb-8 flex items-baseline gap-1 relative z-10">
                                <span className="text-5xl font-black text-white">$99</span>
                                <span className="text-gray-500 font-bold uppercase text-xs">/month</span>
                            </div>
                            <ul className="space-y-4 mb-12 flex-1 relative z-10">
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-success text-xl font-bold">check</span>
                                    <span className="text-gray-400 text-sm font-medium">Everything in Pro</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-success text-xl font-bold">check</span>
                                    <span className="text-gray-400 text-sm font-medium">1-on-1 Human Coaching</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-success text-xl font-bold">check</span>
                                    <span className="text-gray-400 text-sm font-medium">Nutritionist Consultations</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-success text-xl font-bold">check</span>
                                    <span className="text-gray-400 text-sm font-medium">Sleep & Recovery Optimization</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-success text-xl font-bold">check</span>
                                    <span className="text-gray-400 text-sm font-medium">Exclusive Offline Events</span>
                                </li>
                            </ul>
                            <button onClick={() => (window.location.href = "/login")} className="w-full py-4 bg-success/10 text-success border border-success/30 rounded-2xl font-black uppercase tracking-widest hover:bg-success hover:text-black transition-all relative z-10">
                                Choose Plan
                            </button>
                            <div className="absolute bottom-0 left-0 h-1 w-0 bg-success group-hover:w-full transition-all duration-500 rounded-full"></div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-dark-bg border-t border-white/10 py-12 px-6">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-3 opacity-50">
                            <div className="bg-white/10 w-8 h-8 rounded flex items-center justify-center">
                                <span className="material-symbols-outlined text-sm">bolt</span>
                            </div>
                            <span className="text-sm font-black uppercase tracking-tighter">Stride</span>
                        </div>
                        <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-gray-500">
                            <Link className="hover:text-white transition-colors" href="#">Privacy Policy</Link>
                            <Link className="hover:text-white transition-colors" href="#">Terms of Service</Link>
                            <Link className="hover:text-white transition-colors" href="#">Cookies</Link>
                        </div>
                        <p className="text-[10px] text-gray-600 font-bold">© 2026 STRIDE INFRASTRUCTURE. ALL RIGHTS RESERVED.</p>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default Pricing
