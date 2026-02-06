# Stride — Comprehensive Full-Stack Fitness Tracker

<p align="left">
  <img src="./icon.png" alt="Stride Logo" width="100" />
</p>

**A complete full-stack fitness tracking application built with React, Tailwind CSS, Express.js, and MongoDB.**

> 🚀 *Production-ready full-stack application with real-time metrics, meal planning, workout tracking, and admin dashboard.*

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Quick Start](#quick-start)
3. [Tech Stack](#tech-stack)
4. [Login Credentials](#login-credentials)
5. [Project Structure](#project-structure)
6. [Frontend Routes](#frontend-routes)
7. [Backend Routes](#backend-routes)
8. [Database Models](#database-models)
9. [Key Features](#key-features)
10. [Setup & Installation](#setup--installation)
11. [Running the Project](#running-the-project)
12. [Environment Configuration](#environment-configuration)

---



## 📌 Project Overview

**Status:** ✅ **FULLY FUNCTIONAL** (v1.0.0)  
**Last Updated:** February 7, 2026

Stride is a production-ready fitness tracking platform featuring:
- Secure JWT-based authentication with role-based access control
- Real-time admin dashboard with WebSocket integration
- Comprehensive meal planning with nutrition tracking
- Workout library with exercise management
- Progress analytics and weight tracking
- Admin panel for system management and monitoring
- Responsive design optimized for all devices

### Project Health
- **Backend:** ✅ Stable and Production-Ready
- **Frontend:** ✅ Fully Implemented
- **Database:** ✅ Connected and Operational
- **Real-Time Features:** ✅ WebSocket Integration Active

---

## 🚀 Quick Start

### Minimum Requirements
- **Node.js:** v14 or higher
- **npm:** v6 or higher
- **MongoDB:** Local or Atlas URI

### Quick Setup
```bash
# Clone and navigate
git clone https://github.com/Raven117k/Stride.git
cd Stride-React

# Setup Backend
cd Backend
npm install
# Create .env file with MONGO_URI, PORT, JWT_SECRET
node server.js

# In new terminal - Setup Frontend
cd Frontend
npm install
npm start

# Access at http://localhost:3000
```

---

## 🛠 Tech Stack

### Backend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | LTS | Runtime environment |
| **Express.js** | 5.2.1 | Web framework |
| **MongoDB** | 9.1.4 | NoSQL database |
| **Mongoose** | 9.1.4 | ODM for MongoDB |
| **JWT** | 9.0.3 | Authentication tokens |
| **bcryptjs** | 3.0.3 | Password hashing |
| **Socket.io** | 4.8.3 | Real-time communication |
| **Multer** | 2.0.2 | File uploads |
| **CORS** | 2.8.5 | Cross-origin requests |
| **dotenv** | 17.2.3 | Environment variables |
| **UUID** | 13.0.0 | Unique identifiers |

### Frontend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.3 | UI library |
| **React Router DOM** | 6.30.3 | Client-side routing |
| **Tailwind CSS** | 3.4.14 | Utility-first styling |
| **Axios** | 1.13.2 | HTTP client |
| **Framer Motion** | 12.26.2 | Animations |
| **Lucide React** | 0.563.0 | Icons |
| **Socket.io Client** | 4.8.3 | Real-time updates |
| **React Toastify** | 11.0.5 | Notifications |
| **PostCSS** | 8.5.6 | CSS processing |

---

## 🔐 Login Credentials

### Admin Account
```
Email:    admin@stride.com
Password: Admin1234
Role:     Admin (Full access to dashboard, user management, content management)
```

### User Account
```
Email:    user@stride.com
Password: User1234
Role:     User (Access to personal dashboard and features)
```

> 💡 **Note:** These are pre-configured in the database for development/testing purposes.

---

## 📁 Project Structure

### Root Directory
```
Stride-React/
├── README.md                    # (This file)
├── icon.png                     # App logo
├── PROJECT_UPDATE_SUMMARY.md    # Change log
├── .git/                        # Git repository
├── Backend/                     # Express.js server
└── Frontend/                    # React application
```

### Backend Structure
```
Backend/
├── .env                         # Environment variables
├── package.json                 # Backend dependencies
├── server.js                    # Express server setup & Socket.io
│
├── middleware/
│   ├── auth.js                  # JWT verification & role checking
│   └── upload.js                # Multer configuration for file uploads
│
├── Models/                      # Database schemas
│   ├── userSchema.js            # User profiles (58 fields)
│   ├── workoutSchema.js         # Exercise library
│   ├── mealSchema.js            # Meal data with nutrition
│   ├── userWorkoutSchema.js     # User's personal workout plans
│   ├── userMealSchema.js        # User's daily meal assignments
│   ├── notificationSchema.js    # In-app notifications
│   └── counterSchema.js         # Sequential ID counter
│
├── Routes/                      # API endpoints
│   ├── authRoutes.js            # Signup & login (POST)
│   ├── userRoutes.js            # User profile operations
│   ├── userWorkoutRoutes.js     # Workout plan management
│   ├── userTargetRoutes.js      # Nutrition targets
│   ├── userMeals.js             # User meal management
│   ├── fetchUserMeals.js        # Bulk meal fetching
│   ├── mealRoute.js             # Meal data operations
│   ├── progressRoutes.js        # Progress tracking
│   ├── notificationRoutes.js    # Notification management
│   ├── adminUsers.js            # Admin user management
│   ├── adminMeals.js            # Admin meal content
│   ├── adminWorkoutRoutes.js    # Admin workout content
│   └── system/
│       └── adminDashboardRoutes.js  # Real-time metrics (695 lines)
│
└── uploads/                     # File storage
    ├── avatars/                 # User profile pictures
    ├── meals/                   # Meal images
    └── workouts/                # Exercise images
```

### Frontend Structure
```
Frontend/
├── package.json                 # React dependencies
├── postcss.config.js            # CSS processing
├── tailwind.config.js           # Tailwind configuration
├── public/
│   ├── index.html               # HTML entry point
│   ├── manifest.json            # PWA manifest
│   └── robots.txt               # SEO robots
│
├── src/
│   ├── App.jsx                  # Main router & route configuration
│   ├── index.js                 # React entry point
│   ├── index.css                # Global styles
│   │
│   ├── DisplaySite/             # Public pages (no auth required)
│   │   ├── MainHome.jsx         # Landing page
│   │   ├── Features.jsx         # Feature showcase
│   │   └── Pricing.jsx          # Pricing plans
│   │
│   ├── Components/
│   │   └── ProtectedRoute.js    # Role-based route protection
│   │
│   ├── UserPanel/               # Protected user routes (/user/*)
│   │   ├── Dashboard.jsx        # Overview & metrics
│   │   ├── Training.jsx         # Workout browser & management
│   │   ├── MealPlanner.jsx      # Daily meal planning
│   │   ├── Progress.jsx         # Analytics & tracking
│   │   ├── Settings.jsx         # Profile & preferences
│   │   ├── Notification.jsx     # Notification center
│   │   ├── Login.jsx            # Login form
│   │   ├── Signup.jsx           # Registration form
│   │   ├── components/
│   │   │   ├── UserLayout.jsx   # Sidebar wrapper
│   │   │   ├── Header.jsx       # Navigation header
│   │   │   ├── Sidebar.jsx      # Navigation menu
│   │   │   └── Grid.jsx         # Progress visualization
│   │   └── context/
│   │       └── UserContext.js   # Global user state
│   │
│   ├── AdminPanel/              # Protected admin routes (/admin/*)
│   │   ├── AdminDashboard.jsx   # Real-time system monitoring
│   │   ├── AdminUsers.jsx       # User management interface
│   │   ├── AdminMeal.jsx        # Meal management
│   │   ├── AdminWorkout.jsx     # Exercise management
│   │   ├── AdminSettings.jsx    # System settings
│   │   └── components/
│   │       ├── AdminLayout.jsx  # Dashboard wrapper
│   │       ├── Header.jsx       # Admin header
│   │       └── Sidebar.jsx      # Admin menu
│   │
│   ├── assets/
│   │   ├── Fonts/               # Custom fonts
│   │   └── images/              # Static images
│   │
│   ├── services/
│   │   └── notificationService.js  # Notification API calls
│   │
│   └── hooks/
│       └── useNotifications.js  # Custom notification hook
│
└── build/                       # Production build (compiled)
```

---

## 🌐 Frontend Routes

### Public Routes
| Route | Component | Description | Auth Required |
|-------|-----------|-------------|---|
| `/` | MainHome | Landing page | ❌ No |
| `/login` | Login | User login form | ❌ No |
| `/signup` | Signup | User registration | ❌ No |

### User Routes (Protected - `role: "user"`)
| Route | Component | Description | Auth Required |
|-------|-----------|-------------|---|
| `/user/` | Dashboard | User overview & metrics | ✅ Yes |
| `/user/training` | Training | Workout library & management | ✅ Yes |
| `/user/progress` | Progress | Analytics & tracking | ✅ Yes |
| `/user/meal` | MealPlanner | Daily meal planning | ✅ Yes |
| `/user/settings` | Settings | Profile & preferences | ✅ Yes |
| `/user/notifications` | Notification | Notification center | ✅ Yes |

### Admin Routes (Protected - `role: "admin"`)
| Route | Component | Description | Auth Required |
|-------|-----------|-------------|---|
| `/admin` | AdminDashboard | Real-time system metrics | ✅ Yes (Admin) |
| `/admin/users` | AdminUsers | User management & control | ✅ Yes (Admin) |
| `/admin/workout` | AdminWorkout | Exercise library management | ✅ Yes (Admin) |
| `/admin/meal` | AdminMeal | Meal content management | ✅ Yes (Admin) |
| `/admin/settings` | AdminSettings | System configuration | ✅ Yes (Admin) |

---

## 🔌 Backend Routes

### Authentication Routes
```
POST /api/auth/signup
  - Register new user
  - Required: name, email, password, phone
  - Returns: user._id, email, role, JWT token

POST /api/auth/login
  - Authenticate user
  - Required: email, password
  - Returns: JWT token (7-day expiration), user role
```

### User Profile Routes
```
GET /api/user/me
  - Get current user profile
  - Auth: Required (JWT)
  - Returns: User object (excluding password)

PUT /api/user/me
  - Update user profile
  - Auth: Required (JWT)
  - Can update: name, email, password, preferences, notifications, fitness data

PUT /api/user/me/avatar
  - Upload user avatar
  - Auth: Required (JWT)
  - File: image (2MB max)

DELETE /api/user/me
  - Delete user account
  - Auth: Required (JWT)
```

### User Workout Routes
```
GET /api/user-workouts/:userId
  - Get user's personal workout plan
  - Returns: Array of exercises in user's plan

POST /api/user-workouts/add
  - Add exercise to user plan
  - Required: userId, exerciseId, date

PATCH /api/user-workouts/toggle/:id
  - Mark workout as complete/incomplete
  - Updates completion status with timestamp

DELETE /api/user-workouts/remove/:id
  - Remove exercise from user plan
```

### Nutrition & Meal Routes
```
GET /api/meals
  - Get all available meals (Admin-created)
  - Auth: Required (JWT)
  - Returns: Array of meal objects

GET /api/meals/:userId/:date
  - Get meals for specific date
  - Returns: User's daily meals

GET /api/user-meals
  - Get user's meal selections
  - Auth: Required (JWT)

POST /api/user-meals
  - Add meal to user's daily plan
  - Auth: Required (JWT)
  - Required: userId, mealId, date, type

PUT /api/user-meals/:id
  - Update meal (mark complete, adjust portions)
  - Auth: Required (JWT)

DELETE /api/user-meals/:id
  - Remove meal from user's plan
  - Auth: Required (JWT)

GET /api/targets
  - Get user's nutrition targets
  - Auth: Required (JWT)
  - Returns: calories, protein, carbs, fats targets

PUT /api/targets
  - Update user's nutrition targets
  - Auth: Required (JWT)
```

### Progress & Analytics Routes
```
GET /api/progress
  - Get user's overall progress
  - Auth: Required (JWT)
  - Returns: Total workouts, completed, weight tracking, streaks

POST /api/progress/weight
  - Log weight entry
  - Auth: Required (JWT)
  - Required: userId, weight, date
```

### Admin User Management Routes
```
GET /api/admin/users
  - List all users with pagination
  - Auth: Required (JWT + Admin)
  - Query params: limit, offset, role, status, search

GET /api/admin/users/:id
  - Get specific user details
  - Auth: Required (JWT + Admin)

POST /api/admin/users
  - Create new user manually
  - Auth: Required (JWT + Admin)

PUT /api/admin/users/:id
  - Update user profile/settings
  - Auth: Required (JWT + Admin)

DELETE /api/admin/users/:id
  - Delete user account
  - Auth: Required (JWT + Admin)

PATCH /api/admin/users/:id/ban
  - Ban/unban user account
  - Auth: Required (JWT + Admin)
  - Required: isBanned (boolean)

POST /api/admin/users/:id/reset-password
  - Reset user password
  - Auth: Required (JWT + Admin)
```

### Admin Meal Management Routes
```
GET /api/admin-meals/meals
  - List all meals
  - Auth: Required (JWT + Admin)

POST /api/admin-meals/meals
  - Create new meal with image
  - Auth: Required (JWT + Admin)
  - File: image upload (Multer)
  - Body: type, foods array, nutrition data

PUT /api/admin-meals/meals/:id
  - Update meal details
  - Auth: Required (JWT + Admin)
  - File: optional image update

DELETE /api/admin-meals/meals/:id
  - Delete meal from library
  - Auth: Required (JWT + Admin)
```

### Admin Workout Management Routes
```
POST /api/admin/workouts/upload
  - Upload image for exercise
  - Auth: Required (JWT + Admin)
  - File: image

GET /api/admin/workouts
  - List all exercises
  - Auth: Required (JWT + Admin)
  - Returns: Full exercise library

GET /api/admin/workouts/:id
  - Get specific exercise details
  - Auth: Required (JWT + Admin)

POST /api/admin/workouts
  - Create new exercise
  - Auth: Required (JWT + Admin)
  - Required: title, tag, difficulty, sets, reps, description

PUT /api/admin/workouts/:id
  - Update exercise details
  - Auth: Required (JWT + Admin)

DELETE /api/admin/workouts/:id
  - Delete exercise from library
  - Auth: Required (JWT + Admin)
```

### Admin Dashboard & Monitoring Routes
```
GET /api/admin/dashboard/health
  - Server health check
  - Auth: Required (JWT + Admin)

GET /api/admin/dashboard/metrics/realtime
  - Get real-time system metrics
  - Auth: Required (JWT + Admin)
  - Returns: CPU, memory, disk, uptime, request count

GET /api/admin/dashboard/logs/recent
  - Get recent activity logs
  - Auth: Required (JWT + Admin)
  - Returns: Last 100 activities with timestamps

GET /api/admin/dashboard/metrics/database
  - Get database statistics
  - Auth: Required (JWT + Admin)
  - Returns: Collection counts, connection status

GET /api/admin/dashboard/system/info
  - Get system information
  - Auth: Required (JWT + Admin)
  - Returns: Node version, uptime, memory usage

POST /api/admin/dashboard/logs/clear
  - Clear activity logs
  - Auth: Required (JWT + Admin)

POST /api/admin/dashboard/cpu/stress-test
  - Run CPU stress test
  - Auth: Required (JWT + Admin)
  - For performance testing

POST /api/admin/dashboard/test/request
  - Test request tracking
  - Auth: Required (JWT + Admin)
```

### Notification Routes
```
GET /api/notifications
  - Get user's notifications
  - Auth: Required (JWT)

PUT /api/notifications/:id
  - Update notification
  - Auth: Required (JWT)

PUT /api/notifications/read-all
  - Mark all notifications as read
  - Auth: Required (JWT)

DELETE /api/notifications/:id
  - Delete notification
  - Auth: Required (JWT)
```

### Utility Routes
```
GET /db-test
  - Test MongoDB connection
  - Auth: Not required
  - Returns: Connection status, collections, connection state
```

---

## 🗄️ Database Models

### User Schema (58 fields)
```javascript
{
  // Identity
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  
  // Profile
  avatar: String (URL),
  location: String,
  age: Number,
  weight: Number,
  height: Number,
  
  // Authentication & Security
  role: "user" | "admin" | "moderator" (default: "user"),
  isBanned: Boolean (default: false),
  
  // JWT & Login
  lastLogin: Date,
  loginCount: Number,
  
  // Subscription
  plan: "Free" | "Basic" | "Pro" | "Elite" (default: "Free"),
  
  // Settings
  preferences: {
    language: String (default: "en")
  },
  
  notifications: {
    dailyReminder: Boolean,
    weeklyReport: Boolean,
    socialAlerts: Boolean
  },
  
  // Nutrition Targets
  targets: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fats: Number
  },
  
  // Metadata
  lastActive: Date,
  ipAddress: String,
  userAgent: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Meal Schema
```javascript
{
  userId: ObjectId (ref: User),
  date: Date,
  type: "breakfast" | "lunch" | "dinner" | "snacks",
  time: String,
  
  foods: [{
    name: String,
    calories: Number,
    protein: Number,
    carbs: Number,
    fats: Number
  }],
  
  image: String (URL),
  
  // Virtual property - auto-calculated totals
  totals: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fats: Number
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

### Workout Schema
```javascript
{
  exerciseId: String (unique),
  title: String,
  tag: String (muscle group),
  description: String,
  imageUrl: String,
  
  difficulty: "Beginner" | "Intermediate" | "Advanced",
  sets: Number,
  reps: String,
  
  isActive: Boolean (default: true),
  
  createdAt: Date,
  updatedAt: Date
}
```

### UserWorkout Schema
```javascript
{
  userId: ObjectId (ref: User),
  exerciseId: ObjectId (ref: Workout),
  date: Date,
  
  isCompleted: Boolean (default: false),
  completedAt: Date,
  
  createdAt: Date,
  updatedAt: Date
}
```

### UserMeal Schema
```javascript
{
  userId: ObjectId (ref: User),
  mealId: ObjectId (ref: Meal),
  date: Date,
  type: "breakfast" | "lunch" | "dinner" | "snacks",
  
  isCompleted: Boolean (default: false),
  completedAt: Date,
  
  createdAt: Date,
  updatedAt: Date
}
```

### Notification Schema
```javascript
{
  userId: ObjectId (ref: User),
  title: String,
  message: String,
  type: String (badge, achievement, goal, etc.),
  
  isRead: Boolean (default: false),
  readAt: Date,
  
  createdAt: Date,
  updatedAt: Date
}
```

### Counter Schema
```javascript
{
  _id: String (counter name),
  sequence: Number (current counter value)
}
```

---

## ✨ Key Features

### ✅ Authentication & Security
- JWT-based authentication (7-day token expiration)
- bcryptjs password hashing
- Role-based access control (User/Admin/Moderator)
- Ban system for user accounts
- Protected routes with middleware validation

### ✅ User Management
- Complete user profiles (58+ fields)
- Avatar upload and management
- User preferences and notification settings
- Last login tracking
- Account ban/unban functionality

### ✅ Dashboard Features
- Real-time metrics display
- Active calories tracking
- Heart rate monitoring
- Recovery score display
- Sleep quality tracking
- Weight progress with charts
- Nutrition breakdown

### ✅ Workout System
- Exercise library with 9+ muscle groups
- Difficulty levels (Beginner, Intermediate, Advanced)
- Workout plan management
- Completion tracking with streaks
- Search and filtering capabilities
- Image uploads for exercises

### ✅ Meal Planning & Nutrition
- Meal management with nutrition data
- Macro tracking (calories, protein, carbs, fats)
- Custom nutrition targets
- Daily meal planning
- Progress visualization
- Meal image uploads
- Completion tracking

### ✅ Progress Analytics
- Workout statistics (total, completed, streaks)
- Weight tracking with history
- Completion rates calculation
- Weekly/monthly averages
- Last workout information
- Auto-refresh capability

### ✅ Admin Dashboard
- Real-time system monitoring (CPU, memory, disk)
- Database statistics
- Request tracking and response times
- Activity logging with service categorization
- User management with filtering
- Content management (meals, exercises)
- System health checks

### ✅ Real-Time Features
- WebSocket integration via Socket.io
- Live metrics broadcasting
- Real-time notifications
- Active connection tracking
- Activity logging

### ✅ File Management
- Avatar uploads (2MB max, images only)
- Meal image uploads
- Exercise image uploads
- Static file serving

---

## 📦 Setup & Installation

### Prerequisites
```bash
# Verify installations
node --version    # v14+
npm --version     # v6+
mongod --version  # MongoDB running locally or Atlas URI ready
```

### Backend Setup

1. **Navigate to Backend:**
   ```bash
   cd Backend
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Create .env file:**
   ```bash
   # Backend/.env
   PORT=5000
   MONGO_URI=mongodb+srv://[username:password@]host/dbname
   JWT_SECRET=your-super-secret-key-here-change-in-production
   ```

4. **Verify connection:**
   ```bash
   # Database connection test
   curl http://localhost:5000/db-test
   ```

### Frontend Setup

1. **Navigate to Frontend:**
   ```bash
   cd ../Frontend
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Proxy is already configured in package.json:**
   ```json
   "proxy": "http://localhost:5000"
   ```

---

## ▶️ Running the Project

### Start Backend Server
```bash
cd Backend
node server.js
```

**Expected Output:**
```
Server running on 5000
WebSocket server ready
MongoDB connected
```

> Backend runs at: `http://localhost:5000`

### Start Frontend Development Server (in new terminal)
```bash
cd Frontend
npm start
```

**Expected Output:**
```
Compiled successfully!
You can now view stride in the browser.
```

> Frontend runs at: `http://localhost:3000`

### Production Build
```bash
cd Frontend
npm run build
```

Creates optimized build in `Frontend/build/` directory.

---

## ⚙️ Environment Configuration

### Backend .env File
```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database
MONGO_URI=mongodb+srv://stride117k:YOUR_PASSWORD@stride.hdopfy8.mongodb.net/?appName=Stride

# Authentication
JWT_SECRET=supersecretkeythatnobodycanguess123!@#
JWT_EXPIRATION=7d

# File Upload
MAX_FILE_SIZE=2097152  # 2MB in bytes
UPLOAD_DIR=./uploads

# Logging
LOG_LEVEL=info
```

### Frontend .env Configuration
The frontend uses the proxy setting from `package.json`:
```json
"proxy": "http://localhost:5000"
```

This automatically routes API calls from `http://localhost:3000` to `http://localhost:5000`.

---

## 🔒 Security Features

### Authentication
- **JWT Tokens:** Secure token-based auth (7-day expiration)
- **Password Hashing:** bcryptjs with salt rounds
- **Role-Based Access:** User/Admin/Moderator roles
- **Protected Routes:** Client and server-side protection


### Data Protection
- **CORS:** Cross-origin requests managed
- **Input Validation:** Mongoose schema validation
- **File Upload Validation:** Type and size restrictions
- **SQL Injection Prevention:** MongoDB with Mongoose

### Admin Security
- **Admin-Only Routes:** All admin endpoints protected
- **User Management:** Ban/unban capabilities
- **Activity Logging:** All requests logged
- **Request Tracking:** Monitored via middleware

---

## 📊 API Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed",
  "data": { /* response data */ },
  "token": "jwt-token-if-auth-endpoint"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error info"
}
```

---

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongosh

# If using Atlas, verify:
# 1. Connection string in .env is correct
# 2. IP address is whitelisted in Atlas
# 3. Username/password are correct
```

### Port Already in Use
```bash
# Find and kill process on port 5000
lsof -i :5000
kill -9 <PID>

# Or change PORT in .env
PORT=5001
```

### CORS Errors
- Ensure backend CORS is enabled in `server.js`
- Frontend proxy is configured correctly
- API URL in frontend matches backend URL

### Token Expiration
- Default JWT expiration: 7 days
- Expired tokens require re-login
- Check browser localStorage for token

---

## 📞 Development Notes

### To Add New Features
1. Create route in `Backend/Routes/`
2. Add controller logic
3. Create frontend component in `Frontend/src/`
4. Add route in `App.jsx`
5. Protect routes with `ProtectedRoute` if needed

### Database Indexing
Key fields are indexed for performance:
- User: email (unique), role
- Workout: exerciseId (unique), title, tag
- Meal: userId, date
- UserMeal: userId, date

### Socket.IO Events
For real-time updates, use Socket.io events:
- `connection` - User connects
- `notification_read` - Notification marked read
- `disconnect` - User disconnects
- `metrics_update` - Dashboard metrics broadcast

---

## 📈 Performance Metrics

- **Response Time:** Tracked in admin dashboard
- **Concurrent Connections:** Supported via Express.js
- **Socket.io:** Configured with 60s pingTimeout, 25s pingInterval
- **Frontend:** React 19 with optimized rendering

---

## 🎯 Next Steps for Team

1. **Code Review:** Review Architecture folder structure and component organization
2. **API Testing:** Use Postman/Insomnia to test all endpoints with auth tokens
3. **Feature Development:** Discuss new features to implement
4. **Performance Testing:** Run stress tests via admin dashboard
5. **Deployment Planning:** Plan hosting (Heroku, AWS, DigitalOcean)

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Feb 7, 2026 | Full-stack implementation complete |
| 0.9.0 | Feb 6, 2026 | Real-time dashboard added |
| 0.8.0 | Feb 5, 2026 | Meal planning system completed |
| 0.7.0 | Feb 4, 2026 | Admin routes implemented |
| 0.1.0 | Jan 2026 | Initial project setup |

---

## 📄 License

ISC License - See LICENSE file for details

---

## 👥 Team Notes

- **Frontend Lead:** React/components maintenance
- **Backend Lead:** API/database maintenance
- **DevOps:** Deployment and monitoring
- **QA:** Testing and bug reporting

For questions or issues, create a GitHub issue or contact the team.

---

*Last Updated: February 7, 2026 | Stride v1.0.0*
