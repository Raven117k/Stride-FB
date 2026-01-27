import express from "express";
import mongoose from "mongoose";
import fs from "fs";
import os from "os";
import path from "path";

const router = express.Router();

// In-memory storage for real-time metrics
let systemMetrics = {
  activeConnections: 0,
  requestCount: 0,
  errorCount: 0,
  responseTimes: [],
  uptime: process.uptime(),
  lastUpdated: new Date().toISOString(),
  cpuUsage: 0, // Track CPU usage percentage
  lastCpuMeasurement: {
    idle: 0,
    total: 0,
    time: Date.now()
  }
};

let connectedClients = new Map();
let recentActivities = [];

// ==================== EXPORTED FUNCTIONS ====================

// Export functions to update metrics from server.js middleware
export const trackRequestStart = (req) => {
  // Log API request as activity
  if (req.path.startsWith('/api/') && !req.path.includes('/metrics') && !req.path.includes('/logs')) {
    addActivity({
      timestamp: new Date(),
      service: getServiceFromPath(req.path),
      message: `${req.method} ${req.path} - Request started`,
      type: "info"
    });
  }
};

export const trackRequestEnd = (req, res, duration) => {
  // Update request count and response times
  systemMetrics.requestCount++;
  systemMetrics.responseTimes.push(duration);
  
  // Keep only last 100 response times
  if (systemMetrics.responseTimes.length > 100) {
    systemMetrics.responseTimes.shift();
  }
  
  if (req.path.startsWith('/api/') && !req.path.includes('/metrics') && !req.path.includes('/logs')) {
    if (res.statusCode >= 400) {
      systemMetrics.errorCount++;
      
      // Log error as activity
      addActivity({
        timestamp: new Date(),
        service: getServiceFromPath(req.path),
        message: `${req.method} ${req.path} - ${res.statusCode} Error (${duration}ms)`,
        type: "warning"
      });
    } else {
      // Log successful API call
      addActivity({
        timestamp: new Date(),
        service: getServiceFromPath(req.path),
        message: `${req.method} ${req.path} - ${res.statusCode} OK (${duration}ms)`,
        type: "success"
      });
    }
  }
};

// Helper function to determine service from path
const getServiceFromPath = (path) => {
  if (path.startsWith('/api/auth')) return 'AUTH';
  if (path.startsWith('/api/user') && !path.includes('/admin')) return 'USER_API';
  if (path.startsWith('/api/admin')) return 'ADMIN_API';
  if (path.startsWith('/api/meals')) return 'MEALS_API';
  if (path.startsWith('/api/targets')) return 'TARGETS_API';
  if (path.startsWith('/api/user-meals')) return 'USER_MEALS_API';
  return 'API';
};

// CPU Usage calculation helpers
const calculateCpuUsage = () => {
  try {
    const cpus = os.cpus();
    if (!cpus || cpus.length === 0) return { load1: 0, load5: 0, load15: 0, usage: 0 };
    
    let totalIdle = 0;
    let totalTick = 0;
    
    cpus.forEach(cpu => {
      for (let type in cpu.times) {
        totalTick += cpu.times[type];
      }
      totalIdle += cpu.times.idle;
    });
    
    const now = Date.now();
    const idle = totalIdle / cpus.length;
    const total = totalTick / cpus.length;
    
    // Calculate CPU usage percentage
    let cpuUsage = 0;
    if (systemMetrics.lastCpuMeasurement.time > 0) {
      const idleDiff = idle - systemMetrics.lastCpuMeasurement.idle;
      const totalDiff = total - systemMetrics.lastCpuMeasurement.total;
      const timeDiff = now - systemMetrics.lastCpuMeasurement.time;
      
      if (totalDiff > 0 && timeDiff > 0) {
        cpuUsage = 100 - Math.floor(100 * idleDiff / totalDiff);
        // Keep within 0-100 range
        cpuUsage = Math.max(0, Math.min(100, cpuUsage));
      }
    }
    
    // Update last measurement
    systemMetrics.lastCpuMeasurement = {
      idle,
      total,
      time: now
    };
    
    systemMetrics.cpuUsage = cpuUsage;
    
    // Get system load averages
    const loadAvg = os.loadavg();
    
    return {
      load1: loadAvg[0] || 0,
      load5: loadAvg[1] || 0,
      load15: loadAvg[2] || 0,
      usage: cpuUsage, // CPU usage percentage
      cores: cpus.length
    };
  } catch (error) {
    console.error("Error calculating CPU usage:", error);
    return { load1: 0, load5: 0, load15: 0, usage: 0, cores: os.cpus().length || 1 };
  }
};

// Export addActivity function so server.js can use it
export const addActivity = (activity, io = null) => {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  
  // Filter out activities older than 5 minutes
  recentActivities = recentActivities.filter(a => 
    new Date(a.timestamp) > fiveMinutesAgo
  );
  
  // Add new activity
  recentActivities.unshift(activity);
  
  // Keep only last 20 activities
  if (recentActivities.length > 20) {
    recentActivities = recentActivities.slice(0, 20);
  }
  
  // Broadcast new activity to all connected admin clients
  if (io) {
    io.emit("new-activity", {
      ...activity,
      time: new Date(activity.timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      })
    });
  }
};

// Initialize with existing metrics if they exist (when imported)
export const initializeAdminMetrics = (io, existingMetrics) => {
  if (existingMetrics) {
    systemMetrics = { ...systemMetrics, ...existingMetrics };
  }
  
  // Initialize CPU measurement
  const cpus = os.cpus();
  if (cpus && cpus.length > 0) {
    let totalIdle = 0;
    let totalTick = 0;
    
    cpus.forEach(cpu => {
      for (let type in cpu.times) {
        totalTick += cpu.times[type];
      }
      totalIdle += cpu.times.idle;
    });
    
    systemMetrics.lastCpuMeasurement = {
      idle: totalIdle / cpus.length,
      total: totalTick / cpus.length,
      time: Date.now()
    };
  }
  
  // Setup WebSocket events for admin dashboard
  if (io) {
    setupWebSocketHandlers(io);
  }
};

// Setup WebSocket handlers
const setupWebSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    console.log(`Admin client connected: ${socket.id}`);
    
    const clientData = { 
      connectedAt: new Date(),
      lastActivity: new Date(),
      ip: socket.handshake.address,
      userAgent: socket.handshake.headers['user-agent'],
      isAdmin: true
    };
    
    connectedClients.set(socket.id, clientData);
    systemMetrics.activeConnections = connectedClients.size;
    
    // Add connection activity
    addActivity({
      timestamp: new Date(),
      service: "ADMIN_WEBSOCKET",
      message: `Admin client ${socket.id.substring(0, 8)} connected`,
      type: "success"
    }, io);
    
    // Send initial metrics
    socket.emit("system-metrics", getSystemMetrics());
    
    // Listen for new activity events from frontend (optional)
    socket.on("log-activity", (activity) => {
      addActivity({
        ...activity,
        timestamp: new Date(),
        service: activity.service || "CLIENT",
        type: activity.type || "info"
      }, io);
    });
    
    socket.on("disconnect", (reason) => {
      console.log(`Admin client disconnected: ${socket.id} - Reason: ${reason}`);
      
      addActivity({
        timestamp: new Date(),
        service: "ADMIN_WEBSOCKET",
        message: `Admin client ${socket.id.substring(0, 8)} disconnected`,
        type: "info"
      }, io);
      
      connectedClients.delete(socket.id);
      systemMetrics.activeConnections = connectedClients.size;
      broadcastMetrics(io);
    });
    
    socket.on("error", (error) => {
      console.error(`Admin socket error for ${socket.id}:`, error);
    });
    
    // Handle admin-specific events
    socket.on("request-update", () => {
      clientData.lastActivity = new Date();
      socket.emit("system-metrics", getSystemMetrics());
    });
    
    socket.on("ping", () => {
      clientData.lastActivity = new Date();
      socket.emit("pong");
    });
    
    socket.on("admin-command", (data) => {
      handleAdminCommand(socket, data, io);
    });
  });
};

// Handle admin commands
const handleAdminCommand = (socket, data, io) => {
  const { command, payload } = data;
  
  switch(command) {
    case 'clear-logs':
      recentActivities = [];
      socket.emit("command-response", { 
        success: true, 
        message: "Logs cleared successfully" 
      });
      break;
      
    case 'get-database-stats':
      getDatabaseStatistics().then(stats => {
        socket.emit("command-response", {
          success: true,
          data: stats
        });
      });
      break;
      
    case 'test-activity':
      addActivity({
        timestamp: new Date(),
        service: "TEST",
        message: `Test activity from admin dashboard: ${payload || 'No message'}`,
        type: "info"
      }, io);
      socket.emit("command-response", {
        success: true,
        message: "Test activity added"
      });
      break;
      
    case 'stress-test':
      // Simulate some CPU load for testing
      const startTime = Date.now();
      let sum = 0;
      for (let i = 0; i < 10000000; i++) {
        sum += Math.sqrt(i) * Math.random();
      }
      const duration = Date.now() - startTime;
      
      addActivity({
        timestamp: new Date(),
        service: "TEST",
        message: `CPU stress test completed in ${duration}ms`,
        type: "info"
      }, io);
      
      socket.emit("command-response", {
        success: true,
        message: `Stress test completed in ${duration}ms`
      });
      break;
      
    default:
      socket.emit("command-response", {
        success: false,
        error: "Unknown command"
      });
  }
};

// Helper function to get system metrics
const getSystemMetrics = () => {
  const memUsage = process.memoryUsage();
  const diskUsage = getDiskUsage();
  const cpuData = calculateCpuUsage();
  
  return {
    system: {
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      memory: {
        rss: Math.round(memUsage.rss / 1024 / 1024),
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
        external: Math.round(memUsage.external / 1024 / 1024),
        unit: "MB"
      },
      cpu: {
        load1: cpuData.load1.toFixed(2),
        load5: cpuData.load5.toFixed(2),
        load15: cpuData.load15.toFixed(2),
        usage: cpuData.usage, // CPU usage percentage
        cores: cpuData.cores
      },
      disk: diskUsage
    },
    database: {
      connected: mongoose.connection.readyState === 1,
      state: mongoose.connection.readyState,
      collections: Object.keys(mongoose.connection.collections).length,
      models: Object.keys(mongoose.models).length
    },
    application: {
      activeConnections: systemMetrics.activeConnections,
      socketClients: connectedClients.size,
      requestCount: systemMetrics.requestCount,
      errorCount: systemMetrics.errorCount,
      avgResponseTime: systemMetrics.responseTimes.length > 0 
        ? Math.round(systemMetrics.responseTimes.reduce((a, b) => a + b, 0) / systemMetrics.responseTimes.length)
        : 0,
      recentActivities: recentActivities.length
    }
  };
};

// Helper function to get disk usage
const getDiskUsage = () => {
  try {
    const total = os.totalmem();
    const free = os.freemem();
    const used = total - free;
    
    return {
      total: Math.round(total / 1024 / 1024 / 1024 * 100) / 100,
      used: Math.round(used / 1024 / 1024 / 1024 * 100) / 100,
      free: Math.round(free / 1024 / 1024 / 1024 * 100) / 100,
      usagePercent: Math.round((used / total) * 100),
      unit: "GB"
    };
  } catch (error) {
    return {
      total: 0,
      used: 0,
      free: 0,
      usagePercent: 0,
      unit: "GB",
      error: "Unable to read disk usage"
    };
  }
};

// Broadcast metrics to all connected clients
const broadcastMetrics = (io) => {
  const metrics = getSystemMetrics();
  io.emit("system-metrics", metrics);
  systemMetrics.lastUpdated = new Date().toISOString();
};

// Get database statistics
const getDatabaseStatistics = async () => {
  try {
    const stats = {
      users: 0,
      meals: 0,
      userMeals: 0,
      targets: 0,
      lastHour: {},
      last24h: {}
    };
    
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    // Count documents in each collection
    if (mongoose.models.User) {
      stats.users = await mongoose.models.User.countDocuments();
      stats.lastHour.users = await mongoose.models.User.countDocuments({
        lastLogin: { $gte: oneHourAgo }
      });
      stats.last24h.users = await mongoose.models.User.countDocuments({
        createdAt: { $gte: twentyFourHoursAgo }
      });
    }
    
    if (mongoose.models.Meal) {
      stats.meals = await mongoose.models.Meal.countDocuments();
      stats.lastHour.meals = await mongoose.models.Meal.countDocuments({
        updatedAt: { $gte: oneHourAgo }
      });
    }
    
    if (mongoose.models.UserMeal) {
      stats.userMeals = await mongoose.models.UserMeal.countDocuments();
      stats.lastHour.userMeals = await mongoose.models.UserMeal.countDocuments({
        date: { $gte: oneHourAgo }
      });
      stats.last24h.userMeals = await mongoose.models.UserMeal.countDocuments({
        date: { $gte: twentyFourHoursAgo }
      });
    }
    
    if (mongoose.models.Target) {
      stats.targets = await mongoose.models.Target.countDocuments();
    }
    
    return stats;
  } catch (error) {
    console.error("Error fetching database stats:", error);
    throw error;
  }
};

// Helper function for relative time
const getRelativeTime = (date) => {
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  
  if (diffMin < 1) return "Just now";
  if (diffMin === 1) return "1 minute ago";
  if (diffMin < 60) return `${diffMin} minutes ago`;
  
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours === 1) return "1 hour ago";
  if (diffHours < 24) return `${diffHours} hours ago`;
  
  return new Date(date).toLocaleDateString();
};

// ==================== ROUTES ====================

// Detailed health check endpoint
router.get("/health", (req, res) => {
  const metrics = getSystemMetrics();
  res.json(metrics);
});

// Real-time metrics endpoint
router.get("/metrics/realtime", (req, res) => {
  res.json(getSystemMetrics());
});

// API endpoint logs - Shows only last 5 minutes
router.get("/logs/recent", async (req, res) => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    // Start with in-memory activities (last 5 minutes)
    let logs = recentActivities.filter(activity => 
      new Date(activity.timestamp) > fiveMinutesAgo
    );
    
    // Get recent database activities from last 5 minutes
    const dbLogs = [];
    
    // Get recent auth activities (last 5 minutes)
    if (mongoose.models.User) {
      try {
        const recentLogins = await mongoose.models.User.find({
          lastLogin: { $gte: fiveMinutesAgo }
        })
        .sort({ lastLogin: -1 })
        .limit(5)
        .select("email lastLogin")
        .lean();
        
        recentLogins.forEach(user => {
          if (user.lastLogin) {
            dbLogs.push({
              timestamp: user.lastLogin,
              service: "AUTH",
              message: `User ${user.email || 'unknown'} logged in`,
              type: "success"
            });
          }
        });
      } catch (error) {
        console.error("Error fetching login logs:", error);
      }
    }
    
    // Get recent meal activities (last 5 minutes)
    if (mongoose.models.Meal) {
      try {
        const recentMeals = await mongoose.models.Meal.find({
          updatedAt: { $gte: fiveMinutesAgo }
        })
        .sort({ updatedAt: -1 })
        .limit(3)
        .select("name updatedAt")
        .lean();
        
        recentMeals.forEach(meal => {
          if (meal.updatedAt) {
            dbLogs.push({
              timestamp: meal.updatedAt,
              service: "MEAL",
              message: `Meal "${meal.name || 'Unnamed'}" updated`,
              type: "info"
            });
          }
        });
      } catch (error) {
        console.error("Error fetching meal logs:", error);
      }
    }
    
    // Combine all logs and sort by timestamp
    const allLogs = [...logs, ...dbLogs]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 15)
      .map(log => ({
        ...log,
        time: new Date(log.timestamp).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit',
          second: '2-digit'
        }),
        relativeTime: getRelativeTime(new Date(log.timestamp))
      }));
    
    res.json(allLogs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

// Database statistics endpoint
router.get("/metrics/database", async (req, res) => {
  try {
    const stats = await getDatabaseStatistics();
    res.json(stats);
  } catch (error) {
    console.error("Error fetching database stats:", error);
    res.status(500).json({ error: "Failed to fetch database statistics" });
  }
});

// System info endpoint
router.get("/system/info", (req, res) => {
  const info = {
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    cwd: process.cwd(),
    pid: process.pid,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    env: process.env.NODE_ENV || 'development',
    cpuCount: os.cpus().length,
    totalMemory: Math.round(os.totalmem() / 1024 / 1024 / 1024 * 100) / 100 + " GB",
    freeMemory: Math.round(os.freemem() / 1024 / 1024 / 1024 * 100) / 100 + " GB",
    hostname: os.hostname(),
    networkInterfaces: os.networkInterfaces()
  };
  
  res.json(info);
});

// Clear logs endpoint (protected - should add authentication)
router.post("/logs/clear", (req, res) => {
  recentActivities = [];
  res.json({ success: true, message: "Logs cleared successfully" });
});

// CPU stress test endpoint (for testing CPU monitoring)
router.post("/cpu/stress-test", (req, res) => {
  const startTime = Date.now();
  let sum = 0;
  
  // Do some CPU-intensive work
  for (let i = 0; i < 5000000; i++) {
    sum += Math.sqrt(i) * Math.random();
  }
  
  const duration = Date.now() - startTime;
  
  addActivity({
    timestamp: new Date(),
    service: "CPU",
    message: `CPU stress test completed in ${duration}ms`,
    type: "info"
  });
  
  res.json({
    success: true,
    message: `CPU stress test completed in ${duration}ms`,
    result: sum,
    duration
  });
});

// Test endpoint to increment request count
router.post("/test/request", (req, res) => {
  const duration = Math.floor(Math.random() * 500) + 50; // Random duration 50-550ms
  systemMetrics.requestCount++;
  systemMetrics.responseTimes.push(duration);
  
  // Keep only last 100 response times
  if (systemMetrics.responseTimes.length > 100) {
    systemMetrics.responseTimes.shift();
  }
  
  addActivity({
    timestamp: new Date(),
    service: "TEST",
    message: `Test request completed in ${duration}ms`,
    type: "info"
  });
  
  res.json({
    success: true,
    message: `Test request completed. Request count: ${systemMetrics.requestCount}`,
    duration,
    avgResponseTime: systemMetrics.responseTimes.length > 0 
      ? Math.round(systemMetrics.responseTimes.reduce((a, b) => a + b, 0) / systemMetrics.responseTimes.length)
      : 0
  });
});

// Export functions for server.js to use
export const getMetricsBroadcaster = (io) => {
  return setInterval(() => {
    broadcastMetrics(io);
  }, 2000); // Update every 2 seconds
};

export default router;