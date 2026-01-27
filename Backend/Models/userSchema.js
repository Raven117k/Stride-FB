import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        // ===== Required (Core Identity) =====
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true },
        phone: { type: String, required: true },

        // ===== Optional (Profile / Settings) =====
        avatar: { type: String, default: "", },
        location: { type: String, default: "", },
        age: { type: Number, default: 0 },
        weight: { type: Number, default: 0 },
        height: { type: Number, default: 0 },

        // ===== Preferences =====
        preferences: {
            language: { type: String, default: "English", },
        },

        // ===== Notifications =====
        notifications: {
            dailyReminder: { type: Boolean, default: true, },
            weeklyReport: { type: Boolean, default: true, },
            socialAlerts: { type: Boolean, default: false, },
        },

        targets: {
            calories: { type: Number, default: 2200 },
            protein: { type: Number, default: 150 },
            carbs: { type: Number, default: 220 },
            fats: { type: Number, default: 85 },
        },

        // ===== Role / Control =====
        role: { type: String, default: "user", enum: ["user", "admin", "moderator"] },

        // ===== Admin-specific fields =====
        isBanned: { type: Boolean, default: false },
        lastLogin: { type: Date },
        loginCount: { type: Number, default: 0 },
        plan: {
            type: String,
            default: "Free",
            enum: ["Free", "Basic", "Pro", "Elite"]
        },

        // ===== Metadata =====
        lastActive: { type: Date },
        ipAddress: { type: String },
        userAgent: { type: String }
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("User", userSchema);