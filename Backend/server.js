import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { Server } from "socket.io";
import Notification from "./Models/notificationSchema.js";

// Routes
import authRoutes from "./Routes/authRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import userWorkoutRoutes from "./Routes/userWorkoutRoutes.js";
import adminUsersRouter from "./Routes/adminUsers.js";
import userTargetRoutes from "./Routes/userTargetRoutes.js";
import adminMealsRouter from "./Routes/adminMeals.js";
import adminWorkoutRoutes from "./Routes/adminWorkoutRoutes.js";
import progressRoutes from "./Routes/progressRoutes.js";
import mealsRoutes from "./Routes/fetchUserMeals.js";
import userMealsRoutes from "./Routes/userMeals.js";
import notificationRoutes, { setNotificationIO } from "./Routes/notificationRoutes.js";
import adminDashboardRoutes, { 
  initializeAdminMetrics, 
  getMetricsBroadcaster,
  trackRequestStart,
  trackRequestEnd,
  addActivity
} from "./Routes/system/adminDashboardRoutes.js";

// dotenv init
dotenv.config();
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  connectTimeout: 10000
});

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "stridedb",
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// Initialize admin dashboard metrics
initializeAdminMetrics(io);

// Pass io instance to notification routes
setNotificationIO(io);

// Socket.IO middleware for authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token || socket.handshake.query.token;
  if (!token) {
    return next(new Error("Authentication failed - no token"));
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (err) {
    return next(new Error("Authentication failed - invalid token"));
  }
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log(`User ${socket.userId} connected via socket.io`);
  
  // Join user-specific room for targeted notifications
  socket.join(socket.userId.toString());
  
  // Listen for notification read event
  socket.on("mark_notification_read", async ({ notificationId }) => {
    try {
      const updated = await Notification.findByIdAndUpdate(
        notificationId,
        { isRead: true },
        { new: true }
      );
      // Broadcast update to user
      socket.emit("notification_read", updated);
    } catch (err) {
      console.error("Error marking notification as read", err);
    }
  });
  
  socket.on("disconnect", () => {
    console.log(`User ${socket.userId} disconnected`);
  });
});

// Start metrics broadcasting
const metricsInterval = getMetricsBroadcaster(io);

// ============= GLOBAL REQUEST TRACKING MIDDLEWARE =============
app.use((req, res, next) => {
  const startTime = Date.now();
  
  // Track request start
  trackRequestStart(req);
  
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    
    // Track request end with duration
    trackRequestEnd(req, res, duration);
  });
  
  next();
});
// ============= END GLOBAL REQUEST TRACKING =============

// Attach Socket.IO instance to requests so route handlers can emit
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🔍 Test route to verify DB connection
app.get("/db-test", (req, res) => {
  const state = mongoose.connection.readyState;
  const collections = Object.keys(mongoose.connection.collections);

  res.json({
    connected: state === 1,
    state,
    collections,
    message: state === 1
      ? "MongoDB is connected"
      : "MongoDB is NOT connected",
  });
});

// ==================== ROUTES ====================

// Public routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/targets", userTargetRoutes);
app.use("/api/meals", mealsRoutes);
app.use("/api/user-meals", userMealsRoutes);
app.use("/api/user-workouts", userWorkoutRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/notifications", notificationRoutes);

// Admin routes
app.use("/api/admin/users", adminUsersRouter);
app.use("/api/admin-meals/", adminMealsRouter);
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/workouts", adminWorkoutRoutes);


// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
  console.log(`WebSocket server ready`);
  
  // Add server startup activity
  addActivity({
    timestamp: new Date(),
    service: "SYSTEM",
    message: `Server started on port ${PORT}`,
    type: "success"
  });
});

// Cleanup on server shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  clearInterval(metricsInterval);
  httpServer.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close();
  });
});