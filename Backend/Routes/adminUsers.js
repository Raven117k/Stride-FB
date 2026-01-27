import express from "express";
import User from "../Models/userSchema.js";
import { protect, admin } from "../middleware/auth.js";
import bcrypt from "bcryptjs";

const router = express.Router();

/**
 * ======================
 * ADMIN ROUTES (Require admin role)
 * ======================
 */

// Middleware to check if user is admin
router.use(protect);
router.use(admin);

/**
 * GET all users (with pagination, filtering, search)
 */
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const status = req.query.status || "";
    const role = req.query.role || "";
    
    const skip = (page - 1) * limit;
    
    // Build filter query
    let filter = {};
    
    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } }
      ];
    }
    
    // Role filter
    if (role) {
      filter.role = role;
    }
    
    // Status filter (based on various criteria - customize as needed)
    if (status === "active") {
      filter.lastLogin = { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }; // Last 30 days
    } else if (status === "inactive") {
      filter.lastLogin = { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
    } else if (status === "banned") {
      filter.isBanned = true;
    }
    
    // Get total count for pagination
    const totalUsers = await User.countDocuments(filter);
    
    // Get users with pagination
    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Transform users to include status
    const transformedUsers = users.map(user => ({
      ...user.toObject(),
      status: user.isBanned ? "Banned" : 
              (user.lastLogin && user.lastLogin > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) ? "Active" : "Inactive",
      lastLoginFormatted: user.lastLogin ? 
        new Date(user.lastLogin).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }) : "Never"
    }));
    
    res.json({
      success: true,
      users: transformedUsers,
      pagination: {
        page,
        limit,
        total: totalUsers,
        pages: Math.ceil(totalUsers / limit)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
});

/**
 * GET single user by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch user" });
  }
});

/**
 * CREATE new user (admin only)
 */
router.post("/", async (req, res) => {
  try {
    const { name, email, password, phone, role, ...otherFields } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      role: role || "user",
      ...otherFields
    });
    
    await user.save();
    
    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json({ 
      success: true, 
      message: "User created successfully",
      user: userResponse 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to create user" });
  }
});

/**
 * UPDATE user by ID
 */
router.put("/:id", async (req, res) => {
  try {
    const { password, ...otherUpdates } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    // Prevent self-demotion
    if (req.user.id === req.params.id && otherUpdates.role && otherUpdates.role !== "admin") {
      return res.status(403).json({ 
        success: false, 
        message: "Cannot change your own role from admin" 
      });
    }
    
    // Update fields
    Object.keys(otherUpdates).forEach(key => {
      if (otherUpdates[key] !== undefined) {
        user[key] = otherUpdates[key];
      }
    });
    
    // Update password if provided
    if (password && password !== "********" && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    
    await user.save();
    
    // Return updated user without password
    const updatedUser = user.toObject();
    delete updatedUser.password;
    
    res.json({ 
      success: true, 
      message: "User updated successfully", 
      user: updatedUser 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update user" });
  }
});

/**
 * DELETE user by ID
 */
router.delete("/:id", async (req, res) => {
  try {
    // Prevent self-deletion
    if (req.user.id === req.params.id) {
      return res.status(403).json({ 
        success: false, 
        message: "Cannot delete your own account" 
      });
    }
    
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
});

/**
 * BAN/UNBAN user
 */
router.patch("/:id/ban", async (req, res) => {
  try {
    const { banned } = req.body;
    
    // Prevent self-ban
    if (req.user.id === req.params.id) {
      return res.status(403).json({ 
        success: false, 
        message: "Cannot ban/unban yourself" 
      });
    }
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    user.isBanned = banned;
    await user.save();
    
    res.json({ 
      success: true, 
      message: `User ${banned ? 'banned' : 'unbanned'} successfully`,
      user: {
        ...user.toObject(),
        password: undefined
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update user status" });
  }
});

/**
 * RESET password (admin reset)
 */
router.post("/:id/reset-password", async (req, res) => {
  try {
    const { newPassword } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    await user.save();
    
    res.json({ 
      success: true, 
      message: "Password reset successfully"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to reset password" });
  }
});

export default router;