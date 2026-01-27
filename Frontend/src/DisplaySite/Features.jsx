import React from 'react'

function Features() {
    return (
        <div>
            <div className="flex-1">
                {/* Hero Text */}
                <section className="py-20 px-6 text-center">
                    <div className="max-w-3xl mx-auto">
                        <span className="text-primary text-[10px] font-black uppercase tracking-[0.05em] mb-4 block">
                            Elevate Your Performance
                        </span>

                        <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-[0.05em] mb-6">
                            Redefining{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-success">
                                Human Potential
                            </span>
                        </h2>

                        <p className="text-gray-400 text-lg font-medium max-w-xl mx-auto">
                            Experience the next generation of fitness tracking with precision metrics and AI-driven insights
                            designed for elite athletes.
                        </p>
                    </div>

                </section>

                {/* Feature Cards */}
                <section className="px-6 py-12 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: 'location_searching',
                                title: 'Precision Tracking',
                                text: 'Ultra-low latency biometric monitoring with sub-meter GPS accuracy. Track every pulse, step, and calorie with medical-grade sensors.',
                                label: 'Live Sync Enabled',
                            },
                            {
                                icon: 'restaurant',
                                title: 'Smart Meal Planning',
                                text: 'AI-generated nutrition protocols based on your daily energy expenditure. Dynamic macros that adjust to your workout intensity.',
                                label: 'AI Engine Active',
                            },
                            {
                                icon: 'insights',
                                title: 'Advanced Analytics',
                                text: 'Deep dive into your performance history with predictive modeling. Identify plateaus before they happen with recovery forecasting.',
                                label: 'Data Stream Live',
                            },
                        ].map((feature) => (
                            <div
                                key={feature.title}
                                className="relative group bg-card p-10 rounded-2xl border border-white/10 overflow-hidden"
                            >
                                {/* Background glow */}
                                <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all" />

                                {/* Icon */}
                                <div className="mb-8 bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center border border-primary/20">
                                    <span className="material-symbols-outlined text-3xl text-primary">
                                        {feature.icon}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="text-2xl font-black text-white uppercase mb-4 tracking-tight">
                                    {feature.title}
                                </h3>

                                {/* Description */}
                                <p className="text-gray-400 leading-relaxed mb-8">{feature.text}</p>

                                {/* Label + Pulse Dot */}
                                <div className="flex items-center gap-2 text-success">
                                    <span className="text-[10px] font-black uppercase tracking-widest">{feature.label}</span>
                                    <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                                </div>

                                {/* Bottom line animation */}
                                <div className="mt-4 h-1 w-0 bg-success group-hover:w-full transition-all duration-500 rounded-full"></div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Trusted Logos / Partners */}
                <section className="py-24">
                    <div className="text-center mb-12 px-6">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">
                            Trusted by Global Performance Partners
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-12 md:gap-24 items-center px-6 md:px-12 max-w-7xl mx-auto opacity-40 hover:opacity-100 transition-all">
                        {[
                            { icon: 'fitness_center', name: 'IronCore' },
                            { icon: 'stadium', name: 'Elite Arena' },
                            { icon: 'vitals', name: 'BioPulse Labs' },
                            { icon: 'mountain_flag', name: 'Summit Athletic' },
                            { icon: 'potted_plant', name: 'NatureFit' },
                        ].map((logo, i) => (
                            <div
                                key={i}
                                className="flex flex-col items-center gap-2 min-w-[120px] text-center"
                            >
                                <span className="material-symbols-outlined text-4xl">{logo.icon}</span>
                                <span className="text-xl font-black uppercase">{logo.name}</span>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    )
}

export default Features
