import React, { useEffect, useState } from "react";

function AdminSettings() {
  const [settings, setSettings] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    age: "",
    weight: "",
    height: "",
    avatar: "",
    password: "",
    preferences: {
      darkMode: false,
    },
    notifications: {
      enabled: false,
    },
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token"); // JWT

  // ======================
  // Fetch current user
  // ======================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setError("");
        const res = await fetch("http://localhost:5000/api/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Check response type
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await res.text();
          console.error("Expected JSON, got:", text.substring(0, 100));
          throw new Error(`Server returned non-JSON response (${res.status})`);
        }

        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.message || `Request failed with status ${res.status}`);
        }

        if (!data.success) {
          throw new Error(data.message || "Failed to load user data");
        }

        // Map backend data to frontend state
        setSettings({
          name: data.user.name || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          location: data.user.location || "",
          age: data.user.age || "",
          weight: data.user.weight || "",
          height: data.user.height || "",
          avatar: data.user.avatar || "",
          password: "********", // Masked password
          preferences: {
            darkMode: data.user.preferences?.darkMode || false,
          },
          notifications: {
            enabled: data.user.notifications?.enabled || false,
          },
        });
      } catch (err) {
        console.error("Fetch user error:", err);
        setError(`Failed to load user data: ${err.message}`);
        alert(`Failed to load user data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUser();
    } else {
      setError("No authentication token found. Please login.");
      setLoading(false);
    }
  }, [token]);

  // ======================
  // Handle changes
  // ======================
  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    
    if (name === "darkMode" || name === "notifications") {
      // Handle nested preferences/notifications
      if (name === "darkMode") {
        setSettings(prev => ({
          ...prev,
          preferences: {
            ...prev.preferences,
            darkMode: checked
          }
        }));
      } else if (name === "notifications") {
        setSettings(prev => ({
          ...prev,
          notifications: {
            ...prev.notifications,
            enabled: checked
          }
        }));
      }
    } else {
      // Handle flat fields
      setSettings(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // ======================
  // Save settings
  // ======================
  const handleSave = async () => {
    try {
      setError("");
      setMessage("");

      // Prepare payload according to backend schema
      const payload = {
        name: settings.name,
        email: settings.email,
        phone: settings.phone || undefined,
        location: settings.location || undefined,
        age: settings.age || undefined,
        weight: settings.weight || undefined,
        height: settings.height || undefined,
        avatar: settings.avatar || undefined,
        password: settings.password === "********" ? "" : settings.password, // Don't send masked password
        preferences: settings.preferences,
        notifications: settings.notifications,
      };

      // Remove empty values
      Object.keys(payload).forEach(key => {
        if (payload[key] === "" || payload[key] === undefined) {
          delete payload[key];
        }
      });

      const res = await fetch("http://localhost:5000/api/user/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      // Check response type
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Expected JSON, got:", text.substring(0, 100));
        throw new Error(`Server returned non-JSON response (${res.status})`);
      }

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || `Request failed with status ${res.status}`);
      }

      if (!data.success) {
        throw new Error(data.message || "Failed to save settings");
      }

      setMessage("Settings saved successfully!");
      setSettings(prev => ({ ...prev, password: "********" }));
      alert("Settings saved successfully! 💾");
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Save error:", err);
      setError(`Failed to save settings: ${err.message}`);
      alert(`Failed to save settings: ${err.message}`);
    }
  };

  // ======================
  // Delete account
  // ======================
  const handleDelete = async () => {
    if (!window.confirm("⚠️ This will permanently delete your account and all data. This action cannot be undone. Continue?")) {
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/users/me", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Check response type
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Expected JSON, got:", text.substring(0, 100));
        throw new Error(`Server returned non-JSON response (${res.status})`);
      }

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || `Request failed with status ${res.status}`);
      }

      if (!data.success) {
        throw new Error(data.message || "Failed to delete account");
      }

      localStorage.removeItem("token");
      alert("Account deleted successfully. Redirecting to login...");
      window.location.href = "/login";
    } catch (err) {
      console.error("Delete error:", err);
      alert(`Failed to delete account: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-dark-bg p-4 sm:p-6 flex items-center justify-center">
        <div className="text-white">Loading user data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-dark-bg p-4 sm:p-6">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Admin Settings
          </h2>
          <p className="text-gray-500 text-sm font-medium">
            Manage your account and dashboard preferences
          </p>
        </div>

        {/* Messages */}
        {message && (
          <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4">
            <p className="text-green-400 font-medium">{message}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4">
            <p className="text-red-400 font-medium">{error}</p>
          </div>
        )}

        {/* Form */}
        <div className="bg-card rounded-2xl border border-white/10 p-6 flex flex-col gap-6">

          {/* Account Info */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-bold text-lg">Account Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={settings.name}
                  onChange={handleChange}
                  className="w-full bg-dark-bg border border-gray-800 rounded-lg py-2 px-3 text-white text-sm"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={settings.email}
                  onChange={handleChange}
                  className="w-full bg-dark-bg border border-gray-800 rounded-lg py-2 px-3 text-white text-sm"
                  placeholder="Enter your email"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={settings.phone}
                  onChange={handleChange}
                  className="w-full bg-dark-bg border border-gray-800 rounded-lg py-2 px-3 text-white text-sm"
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={settings.location}
                  onChange={handleChange}
                  className="w-full bg-dark-bg border border-gray-800 rounded-lg py-2 px-3 text-white text-sm"
                  placeholder="Enter your location"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={settings.age}
                  onChange={handleChange}
                  className="w-full bg-dark-bg border border-gray-800 rounded-lg py-2 px-3 text-white text-sm"
                  placeholder="Age"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={settings.weight}
                  onChange={handleChange}
                  className="w-full bg-dark-bg border border-gray-800 rounded-lg py-2 px-3 text-white text-sm"
                  placeholder="Weight in kg"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                  Height (cm)
                </label>
                <input
                  type="number"
                  name="height"
                  value={settings.height}
                  onChange={handleChange}
                  className="w-full bg-dark-bg border border-gray-800 rounded-lg py-2 px-3 text-white text-sm"
                  placeholder="Height in cm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                Avatar URL
              </label>
              <input
                type="text"
                name="avatar"
                value={settings.avatar}
                onChange={handleChange}
                className="w-full bg-dark-bg border border-gray-800 rounded-lg py-2 px-3 text-white text-sm"
                placeholder="Enter avatar image URL"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={settings.password}
                onChange={handleChange}
                placeholder="Enter new password (leave as is to keep current)"
                className="w-full bg-dark-bg border border-gray-800 rounded-lg py-2 px-3 text-white text-sm"
              />
              <p className="text-gray-500 text-xs mt-1">
                Enter a new password or leave as "********" to keep current password
              </p>
            </div>
          </div>

          {/* Preferences */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-bold text-lg">Preferences</h3>

            <div className="flex flex-col sm:flex-row sm:gap-6 gap-4 items-start">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="notifications"
                  checked={settings.notifications.enabled}
                  onChange={handleChange}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-gray-400 text-sm font-bold">
                  Enable Notifications
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="darkMode"
                  checked={settings.preferences.darkMode}
                  onChange={handleChange}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-gray-400 text-sm font-bold">
                  Dark Mode
                </span>
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-2 rounded-xl bg-primary text-black font-black uppercase hover:bg-primary/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-card rounded-2xl border border-red-500/20 p-6 flex flex-col gap-4">
          <h3 className="text-red-400 font-bold text-lg">Danger Zone</h3>
          <p className="text-gray-500 text-sm">
            Delete your account or reset your dashboard settings. This action cannot be undone.
          </p>
          <button
            onClick={handleDelete}
            className="px-6 py-2 rounded-xl bg-red-600 text-white font-black uppercase hover:bg-red-700 transition max-w-xs"
          >
            Delete Account
          </button>
        </div>

      </div>
    </div>
  );
}

export default AdminSettings;