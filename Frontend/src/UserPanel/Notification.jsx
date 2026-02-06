import React, { useEffect, useState } from "react";
import { 
  Trophy, 
  Droplets, 
  MessageSquare, 
  TrendingUp, 
  CheckCheck, 
  Trash2, 
  BellOff,
  Clock
} from "lucide-react";
import useNotifications from "../hooks/useNotifications";

function Notification() {
  const {
    notifications,
    loading,
    unreadCount,
    connected,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotifications();

  const formatTime = (date) => {
    const now = new Date();
    const then = new Date(date);
    const diff = Math.floor((now - then) / 1000 / 60); // minutes
    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return then.toLocaleDateString();
  };

  const getIcon = (type) => {
    switch (type) {
      case 'achievement': return <Trophy className="text-primary" />;
      case 'reminder': return <Droplets className="text-blue-400" />;
      case 'goal': return <TrendingUp className="text-success" />;
      default: return <MessageSquare className="text-slate-400" />;
    }
  };

  if (loading) return <div className="p-10 text-white animate-pulse">Loading alerts...</div>;

  return (
    <div className="max-w-[1200px] mx-auto space-y-4 sm:space-y-6 animate-in fade-in duration-500">
      {/* Title & Actions */}
      <div className="pt-4 sm:pt-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
            Activity Alerts
          </h2>
          <p className="text-sm sm:text-base text-slate-500 mt-1">
            Stay updated on your progress, goals, and achievements.
          </p>
        </div>

        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-200 text-xs sm:text-sm font-bold transition-all"
          >
            <CheckCheck className="size-4 text-primary" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Main Notifications */}
        <div className="lg:col-span-8 space-y-3 sm:space-y-4">
          {notifications.length === 0 ? (
            <div className="bg-card border border-white/5 rounded-3xl p-12 text-center">
              <BellOff className="size-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">All caught up! No new notifications.</p>
            </div>
          ) : (
            notifications.map((note) => (
              <div 
                key={note._id}
                onClick={() => !note.isRead && markAsRead(note._id)}
                className={`bg-card border ${note.isRead ? 'border-white/5 opacity-70' : 'border-primary/20 cursor-pointer'} rounded-2xl p-4 sm:p-6 hover:border-primary/40 transition-all duration-300 relative group`}
              >
                <div className="flex gap-3 sm:gap-4">
                  <div className={`flex-shrink-0 size-10 sm:size-12 rounded-xl flex items-center justify-center border ${
                    note.type === 'achievement' ? 'bg-primary/10 border-primary/20' : 'bg-slate-800 border-white/5'
                  }`}>
                    {getIcon(note.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1 sm:gap-0">
                      <h3 className="text-white font-bold text-sm sm:text-base">{note.title}</h3>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                          <Clock className="size-3" /> {formatTime(note.createdAt)}
                        </span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); deleteNotification(note._id); }}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                      {note.message}
                    </p>
                    
                    {note.type === 'achievement' && !note.isRead && (
                      <div className="mt-4 flex gap-2">
                         <button className="px-4 py-2 bg-primary text-black text-[10px] font-black rounded-lg uppercase tracking-wider">
                            Claim Reward
                         </button>
                      </div>
                    )}
                  </div>
                </div>
                {!note.isRead && (
                  <div className="absolute top-4 right-4 size-2 rounded-full bg-primary neon-glow animate-pulse"></div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-card border border-white/5 p-6 rounded-2xl sticky top-24">
            <h4 className="text-white font-bold text-lg mb-4">Inbox Status</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl">
                <p className="text-[10px] text-primary font-black uppercase mb-1">Unread</p>
                <p className="text-3xl font-black text-white">{unreadCount}</p>
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Total</p>
                <p className="text-3xl font-black text-white">{notifications.length}</p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/5">
                <div className="flex items-center justify-between text-xs mb-4">
                    <span className="text-slate-500">Achievement Progress</span>
                    <span className="text-primary font-bold">85%</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-success neon-glow" style={{ width: '85%' }}></div>
                </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-8 pt-8 border-t border-white/5 text-center text-slate-600 text-[10px] uppercase font-bold tracking-[0.2em]">
        © 2026 ACTIVE PULSE LOGISTICS.
      </footer>
    </div>
  );
}

export default Notification;