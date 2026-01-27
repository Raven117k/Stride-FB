import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Settings() {
    const navigate = useNavigate();
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [logoutOpen, setLogoutOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [password, setPassword] = useState("");
    const [avatarUploading, setAvatarUploading] = useState(false);


    // Snackbar state
    const [snackbar, setSnackbar] = useState({
        show: false,
        message: "",
        type: "success", // 'success' or 'error'
        icon: ""
    });

    // Show snackbar function
    const showSnackbar = (message, type = "success") => {
        const icon = type === "success" ? "check_circle" : "error";
        setSnackbar({
            show: true,
            message,
            type,
            icon
        });

        // Auto hide after 3 seconds
        setTimeout(() => {
            setSnackbar(prev => ({ ...prev, show: false }));
        }, 3000);
    };

    // Hide snackbar manually
    const hideSnackbar = () => {
        setSnackbar(prev => ({ ...prev, show: false }));
    };

    // Fetch user data
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("http://localhost:5000/api/user/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();
                if (data.success) {
                    setUser(data.user);
                    // Set initial password as empty or masked
                    setPassword("********");
                } else {
                    showSnackbar("Failed to load user data", "error");
                }
            } catch (err) {
                console.error("Failed to fetch user", err);
                showSnackbar("Network error. Please try again.", "error");
            }
        };

        fetchUser();
    }, []);
    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setAvatarUploading(true);
            const token = localStorage.getItem("token");

            const formData = new FormData();
            formData.append("avatar", file);

            const res = await fetch("http://localhost:5000/api/user/me/avatar", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await res.json();

            if (data.success) {
                setUser((prev) => ({ ...prev, avatar: data.avatar }));
                showSnackbar("Profile picture updated 💙");
            } else {
                showSnackbar(data.message, "error");
            }
        } catch (err) {
            showSnackbar("Upload failed", "error");
        } finally {
            setAvatarUploading(false);
        }
    };

    // Update user function
    const updateUser = async () => {
        if (!user) return;

        try {
            setIsSaving(true);
            const token = localStorage.getItem("token");

            // Prepare update data - exclude password if it's masked
            // Only send password if user actually changed it
            const updateData = {
                name: user.name,
                email: user.email,
                phone: user.phone || "",
                age: user.age || 0,
                weight: user.weight || 0,
                height: user.height || 0,
                preferences: user.preferences,
                notifications: user.notifications,
                ...(password !== "********" && password.trim() !== "" && { password })
            };

            const res = await fetch("http://localhost:5000/api/user/me", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updateData),
            });

            const data = await res.json();

            if (data.success) {
                setUser(data.user);
                // Reset password field to masked after saving
                if (password !== "********") {
                    setPassword("********");
                }
                showSnackbar("Profile updated successfully!");
            } else {
                showSnackbar(data.message || "Failed to save changes", "error");
            }
        } catch (err) {
            console.error("Failed to update user", err);
            showSnackbar("An error occurred. Please try again.", "error");
        } finally {
            setIsSaving(false);
        }
    };

    // Delete user function
    const handleDelete = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:5000/api/user/me", {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (data.success) {
                console.log("Account deleted!");
                // Clear local storage and redirect to login
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
            } else {
                showSnackbar("Failed to delete account. Please try again.", "error");
            }
        } catch (err) {
            console.error("Failed to delete account", err);
            showSnackbar("An error occurred. Please try again.", "error");
        } finally {
            setDeleteOpen(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    if (!user) {
        return <div className="text-white text-center mt-20">Loading...</div>;
    }

    return (
        <div className="max-w-[1200px] mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Snackbar Component */}
            {snackbar.show && (
                <>
                    {/* Mobile: Bottom Center */}
                    <div className="md:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-sm animate-slideUpMobile">
                        <div className={`rounded-xl border p-4 flex items-center gap-3 shadow-lg backdrop-blur-sm ${snackbar.type === "success"
                            ? "bg-gradient-to-r from-primary/90 to-primary/80 border-primary/40"
                            : "bg-gradient-to-r from-red-500/90 to-red-500/80 border-red-500/40"
                            }`}>
                            <span className={`material-symbols-outlined text-xl ${snackbar.type === "success" ? "text-charcoal" : "text-charcoal"
                                }`}>
                                {snackbar.icon}
                            </span>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-charcoal">
                                    {snackbar.message}
                                </p>
                            </div>
                            <button
                                onClick={hideSnackbar}
                                className="text-charcoal/70 hover:text-charcoal transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                    </div>

                    {/* Desktop: Bottom Right (Windows 10 style) */}
                    <div className="hidden md:block fixed bottom-6 right-6 z-50 w-80 animate-slideInRight">
                        <div className={`rounded-lg border shadow-xl backdrop-blur-sm ${snackbar.type === "success"
                            ? "bg-gradient-to-br from-primary/95 via-primary/90 to-primary/85 border-primary/50"
                            : "bg-gradient-to-br from-red-500/95 via-red-500/90 to-red-500/85 border-red-500/50"
                            }`}>
                            {/* Header with icon and close button */}
                            <div className="flex items-center justify-between p-3 border-b border-charcoal/10">
                                <div className="flex items-center gap-2">
                                    <span className={`material-symbols-outlined ${snackbar.type === "success" ? "text-charcoal" : "text-charcoal"
                                        }`}>
                                        {snackbar.icon}
                                    </span>
                                    <span className="text-sm font-semibold text-charcoal">
                                        {snackbar.type === "success" ? "Success" : "Error"}
                                    </span>
                                </div>
                                <button
                                    onClick={hideSnackbar}
                                    className="text-charcoal/70 hover:text-charcoal transition-colors"
                                >
                                    <span className="material-symbols-outlined text-sm">close</span>
                                </button>
                            </div>

                            {/* Message body */}
                            <div className="p-3">
                                <p className="text-sm text-charcoal">
                                    {snackbar.message}
                                </p>
                            </div>

                            {/* Progress bar for auto-close */}
                            <div className="h-1 w-full bg-charcoal/20 overflow-hidden">
                                <div className={`h-full ${snackbar.type === "success" ? "bg-primary" : "bg-red-500"} animate-progress`}></div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <div className="pt-4 sm:pt-0">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
                    Settings
                </h2>
                <p className="text-sm sm:text-base text-slate-500 mt-1">
                    Manage your profile and preferences
                </p>
            </div>

            {/* Profile Header */}
            <div className="bg-gradient-to-br from-primary/10 to-success/10 border border-white/5 p-[1px] rounded-2xl">
                <div className="bg-card rounded-2xl p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center justify-between gap-4">
                        {/* Left Side: Avatar + User Info */}
                        <div className="flex flex-1 items-center gap-4 sm:gap-6">
                            {/* Avatar Container */}
                            <div className="relative flex-shrink-0">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full border-4 border-primary/30 p-0.5">
                                    <img
                                        alt="Profile"
                                        className="w-full h-full rounded-full object-cover"
                                        src={
                                            user.avatar
                                                ? `http://localhost:5000${user.avatar}`
                                                : "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
                                        }
                                    />

                                </div>
                                <label className="absolute bottom-0 right-0 size-6 sm:size-7 lg:size-8 bg-primary rounded-full flex items-center justify-center border-4 border-card cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={handleAvatarChange}
                                    />
                                    <span className="material-symbols-outlined text-xs sm:text-sm">
                                        {avatarUploading ? "hourglass_top" : "photo_camera"}
                                    </span>
                                </label>

                            </div>

                            {/* User Info */}
                            <div className="flex-1 min-w-0">
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 truncate">
                                    {user.name}
                                </h1>
                                <p className="text-sm text-slate-400 truncate">{user.email}</p>
                            </div>
                        </div>

                        {/* Right Side: Save Button */}
                        <div className="flex-shrink-0">
                            <button
                                onClick={updateUser}
                                disabled={isSaving}
                                className="px-4 py-3 sm:px-5 sm:py-2.5 lg:px-6 lg:py-3 bg-primary text-charcoal rounded-xl font-bold hover:brightness-110 transition-all neon-glow flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {/* Mobile: Icon only */}
                                <span className="material-symbols-outlined block sm:hidden text-lg">
                                    {isSaving ? "hourglass_top" : "save"}
                                </span>

                                {/* Desktop: Icon + Text */}
                                <span className="hidden sm:flex items-center gap-2 text-sm lg:text-base">
                                    <span className="material-symbols-outlined">
                                        {isSaving ? "hourglass_top" : "save"}
                                    </span>
                                    <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
                <div className="lg:col-span-8 space-y-4 sm:space-y-6">
                    {/* Personal Details */}
                    <div className="bg-card border border-white/5 p-4 sm:p-6 lg:p-8 rounded-2xl">
                        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 lg:mb-8">
                            <span className="material-symbols-outlined text-primary">
                                account_circle
                            </span>
                            <h3 className="text-lg sm:text-xl font-bold text-white">
                                Personal Details
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    Full Name
                                </label>
                                <input
                                    className="w-full bg-charcoal border border-white/5 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                                    type="text"
                                    value={user.name}
                                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                                    placeholder="Full Name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    Email Address
                                </label>
                                <input
                                    className="w-full bg-charcoal border border-white/5 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                                    type="email"
                                    value={user.email}
                                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                                    placeholder="Email"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    Phone Number
                                </label>
                                <input
                                    className="w-full bg-charcoal border border-white/5 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                                    type="text"
                                    value={user.phone || ""}
                                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                                    placeholder="Phone"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        className="w-full bg-charcoal border border-white/5 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter new password or leave as is"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                                    >
                                        <span className="material-symbols-outlined text-sm">
                                            {showPassword ? "visibility_off" : "visibility"}
                                        </span>
                                    </button>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">
                                    Leave blank to keep current password
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Physical Metrics */}
                    <div className="bg-card border border-white/5 p-4 sm:p-6 lg:p-8 rounded-2xl">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 lg:mb-8 gap-3 sm:gap-0">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <span className="material-symbols-outlined text-primary text-xl sm:text-2xl">
                                    monitoring
                                </span>
                                <h3 className="text-lg sm:text-xl font-bold text-white">
                                    Physical Metrics
                                </h3>
                            </div>
                            <div className="flex gap-1 p-1 bg-charcoal rounded-lg border border-white/5">
                                <button className="px-2 sm:px-3 py-1.5 rounded-md text-[10px] font-bold bg-primary text-charcoal">
                                    Metric
                                </button>
                                <button className="px-2 sm:px-3 py-1.5 rounded-md text-[10px] font-bold text-slate-400">
                                    Imperial
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    Age
                                </label>
                                <input
                                    className="w-full bg-charcoal border border-white/5 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                                    type="number"
                                    value={user.age || ""}
                                    onChange={(e) =>
                                        setUser({ ...user, age: Number(e.target.value) })
                                    }
                                    placeholder="Age"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    Weight (kg)
                                </label>
                                <input
                                    className="w-full bg-charcoal border border-white/5 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                                    type="number"
                                    value={user.weight || ""}
                                    onChange={(e) =>
                                        setUser({ ...user, weight: Number(e.target.value) })
                                    }
                                    placeholder="Weight (kg)"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    Height (cm)
                                </label>
                                <input
                                    className="w-full bg-charcoal border border-white/5 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                                    type="number"
                                    value={user.height || ""}
                                    onChange={(e) =>
                                        setUser({ ...user, height: Number(e.target.value) })
                                    }
                                    placeholder="Height (cm)"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-4 sm:space-y-6 lg:space-y-8">
                    {/* Notifications */}
                    <div className="bg-card border border-white/5 p-4 sm:p-6 lg:p-8 rounded-2xl">
                        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                            <span className="material-symbols-outlined text-primary">
                                notifications_active
                            </span>
                            <h3 className="text-base sm:text-lg font-bold text-white">
                                Notifications
                            </h3>
                        </div>
                        <div className="space-y-4 sm:space-y-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-white">
                                        Daily Reminder
                                    </p>
                                    <p className="text-xs text-slate-500">Log your workouts</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        defaultChecked={user.notifications?.dailyReminder}
                                        className="sr-only peer"
                                        type="checkbox"
                                        onChange={(e) => setUser({
                                            ...user,
                                            notifications: {
                                                ...user.notifications,
                                                dailyReminder: e.target.checked
                                            }
                                        })}
                                    />
                                    <div className="w-9 h-5 sm:w-11 sm:h-6 bg-white/5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-white/5">
                                <div>
                                    <p className="text-sm font-semibold text-white">
                                        Weekly Report
                                    </p>
                                    <p className="text-xs text-slate-500">Summary via email</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        defaultChecked={user.notifications?.weeklyReport}
                                        className="sr-only peer"
                                        type="checkbox"
                                        onChange={(e) => setUser({
                                            ...user,
                                            notifications: {
                                                ...user.notifications,
                                                weeklyReport: e.target.checked
                                            }
                                        })}
                                    />
                                    <div className="w-9 h-5 sm:w-11 sm:h-6 bg-white/5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-white/5">
                                <div>
                                    <p className="text-sm font-semibold text-white">
                                        Social Alerts
                                    </p>
                                    <p className="text-xs text-slate-500">Likes and comments</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        defaultChecked={user.notifications?.socialAlerts}
                                        className="sr-only peer"
                                        type="checkbox"
                                        onChange={(e) => setUser({
                                            ...user,
                                            notifications: {
                                                ...user.notifications,
                                                socialAlerts: e.target.checked
                                            }
                                        })}
                                    />
                                    <div className="w-9 h-5 sm:w-11 sm:h-6 bg-white/5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Preferences */}
                    <div className="bg-card border border-white/5 p-4 sm:p-6 lg:p-8 rounded-2xl">
                        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                            <span className="material-symbols-outlined text-primary">
                                palette
                            </span>
                            <h3 className="text-base sm:text-lg font-bold text-white">
                                Preferences
                            </h3>
                        </div>
                        <div className="space-y-3 sm:space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    Language
                                </label>
                                <select
                                    className="w-full bg-charcoal border border-white/5 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all appearance-none"
                                    value={user.preferences?.language || "English"}
                                    onChange={(e) => setUser({
                                        ...user,
                                        preferences: {
                                            ...user.preferences,
                                            language: e.target.value
                                        }
                                    })}
                                >
                                    <option value="English">English (US)</option>
                                    <option value="Spanish">Spanish</option>
                                    <option value="French">French</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Logout & Delete Sections */}
            <div className="mt-4 sm:mt-6 lg:mt-8 flex flex-col gap-4">
                {/* Logout Button */}
                <div className="bg-card border border-white/5 p-4 sm:p-6 lg:p-8 rounded-2xl flex items-center justify-between gap-4">
                    {/* Left Side: Icon + Text */}
                    <div className="flex flex-1 items-center gap-3 sm:gap-4">
                        <span className="material-symbols-outlined text-yellow-400 text-xl sm:text-2xl lg:text-3xl flex-shrink-0">
                            logout
                        </span>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-base sm:text-lg lg:text-xl font-bold text-white truncate">
                                Logout
                            </h4>
                            <p className="text-xs sm:text-sm text-slate-500 truncate hidden sm:block">
                                End your current session safely.
                            </p>
                        </div>
                    </div>

                    {/* Right Side: Logout Button */}
                    <div className="flex-shrink-0">
                        <button
                            onClick={() => setLogoutOpen(true)}
                            className="px-4 py-2.5 sm:px-5 sm:py-2.5 lg:px-6 lg:py-3 text-yellow-400 border border-yellow-400/50 rounded-xl font-bold hover:bg-yellow-400 hover:text-dark-bg transition-all whitespace-nowrap"
                        >
                            {/* Mobile: Short text */}
                            <span className="sm:hidden">Exit</span>

                            {/* Desktop: Full text */}
                            <span className="hidden sm:inline text-sm lg:text-base">
                                Logout
                            </span>
                        </button>
                    </div>
                </div>

                {/* Delete Account Button */}
                <div className="bg-card border border-white/5 p-4 sm:p-6 lg:p-8 rounded-2xl flex items-center justify-between gap-4">
                    {/* Left Side: Icon + Text */}
                    <div className="flex flex-1 items-center gap-3 sm:gap-4">
                        <span className="material-symbols-outlined text-red-500 text-xl sm:text-2xl lg:text-3xl flex-shrink-0">
                            delete_forever
                        </span>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-base sm:text-lg lg:text-xl font-bold text-white truncate">
                                Delete Account
                            </h4>
                            <p className="text-xs sm:text-sm text-slate-500 truncate hidden sm:block">
                                Once deleted, your data cannot be recovered.
                            </p>
                        </div>
                    </div>

                    {/* Right Side: Delete Button */}
                    <div className="flex-shrink-0">
                        <button
                            onClick={() => setDeleteOpen(true)}
                            className="px-4 py-2.5 sm:px-5 sm:py-2.5 lg:px-6 lg:py-3 text-red-500 border border-red-500/50 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all whitespace-nowrap"
                        >
                            {/* Mobile: Short text */}
                            <span className="sm:hidden">Delete</span>

                            {/* Desktop: Full text */}
                            <span className="hidden sm:inline text-sm lg:text-base">
                                Delete Forever
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Logout Modal */}
            {logoutOpen && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={() => setLogoutOpen(false)}
                >
                    <div
                        className="bg-card border border-white/10 rounded-xl p-6 w-[90%] max-w-sm text-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-bold text-white mb-4">
                            Confirm Logout
                        </h3>
                        <p className="text-sm text-slate-400 mb-6">
                            Are you sure you want to end your session?
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-yellow-400 text-dark-bg rounded-lg font-bold hover:brightness-110 transition-all"
                            >
                                Logout
                            </button>
                            <button
                                onClick={() => setLogoutOpen(false)}
                                className="px-4 py-2 border border-white/10 text-white rounded-lg hover:bg-white/5 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {deleteOpen && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={() => setDeleteOpen(false)}
                >
                    <div
                        className="bg-card border border-white/10 rounded-xl p-6 w-[90%] max-w-sm text-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-bold text-white mb-4">
                            Confirm Delete
                        </h3>
                        <p className="text-sm text-slate-400 mb-6">
                            Are you sure you want to delete your account? This action cannot
                            be undone.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg font-bold hover:brightness-110 transition-all"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setDeleteOpen(false)}
                                className="px-4 py-2 border border-white/10 text-white rounded-lg hover:bg-white/5 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <footer className="mt-6 sm:mt-8 lg:mt-12 pt-4 sm:pt-6 lg:pt-8 border-t border-white/5 text-center text-slate-600 text-xs">
                © 2024 STRIDE. All rights reserved.
            </footer>

            {/* Add this CSS for animations */}
            <style jsx>{`
                /* Mobile: Slide up from bottom */
                @keyframes slideUpMobile {
                    from {
                        opacity: 0;
                        transform: translate(-50%, 20px);
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, 0);
                    }
                }
                
                /* Desktop: Slide in from right (Windows 10 style) */
                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                /* Progress bar animation */
                @keyframes progress {
                    from {
                        width: 100%;
                    }
                    to {
                        width: 0%;
                    }
                }
                
                .animate-slideUpMobile {
                    animation: slideUpMobile 0.3s ease-out forwards;
                }
                
                .animate-slideInRight {
                    animation: slideInRight 0.3s ease-out forwards;
                }
                
                .animate-progress {
                    animation: progress 3s linear forwards;
                }
            `}</style>
        </div>
    );
}

export default Settings;