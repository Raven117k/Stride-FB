import React from 'react';

function AdminDashboard() {
  return (
    <div className="bg-dark-bg min-h-[100dvh] px-4 sm:px-6 py-4">
      <main className="flex flex-col w-full">

        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              Admin Console Overview
            </h2>
            <p className="text-gray-500 text-sm font-medium mt-1">
              Real-time infrastructure monitoring and growth metrics.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-card border border-white/10 rounded-lg text-xs font-bold text-white hover:bg-white/5">
              24h
            </button>
            <button className="px-3 py-1.5 bg-primary text-black rounded-lg text-xs font-bold">
              7d
            </button>
            <button className="px-3 py-1.5 bg-card border border-white/10 rounded-lg text-xs font-bold text-white hover:bg-white/5">
              30d
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Active Users', value: '42,891', icon: 'group', accent: 'success', change: '+12%' },
            { label: 'System Health', value: 'Nominal', icon: 'dns', accent: 'primary', change: '0 Latency' },
            { label: 'Revenue Growth', value: '$148.2k', icon: 'payments', accent: 'success', change: '+8.4%' },
            { label: 'Subscriptions', value: '12,403', icon: 'pie_chart', accent: 'primary', change: 'Pro / Elite' },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-card p-5 rounded-2xl border border-white/10 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <span className={`material-symbols-outlined text-4xl text-${card.accent}`}>
                  {card.icon}
                </span>
              </div>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">
                {card.label}
              </p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-black text-white">{card.value}</h3>
                <span className={`text-${card.accent} text-xs font-bold`}>
                  {card.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts + Subscriptions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card rounded-2xl border border-white/10 p-4 sm:p-6">
            <h3 className="font-bold text-lg text-white mb-6">Daily Active Users (DAU)</h3>
            <div className="flex items-end gap-1.5 h-56 sm:h-64">
              {[40,45,35,60,75,70,90,85,100].map((h,i)=>(
                <div
                  key={i}
                  style={{ height: `${h}%` }}
                  className="flex-1 bg-primary/10 hover:bg-primary/30 transition-all rounded-t-sm"
                />
              ))}
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-white/10 p-4 sm:p-6">
            <h3 className="font-bold text-lg text-white mb-6">Subscription Tiers</h3>
            {[
              { label: 'Elite Pro', value: 45, color: 'success' },
              { label: 'Standard Plus', value: 32, color: 'primary' },
              { label: 'Basic Free', value: 23, color: 'gray-500' },
            ].map((tier,i)=>(
              <div key={i} className="mb-6">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-2">
                  <span className={`text-${tier.color}`}>{tier.label}</span>
                  <span className="text-white">{tier.value}%</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div style={{ width: `${tier.value}%` }} className={`h-full bg-${tier.color}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}

export default AdminDashboard;
