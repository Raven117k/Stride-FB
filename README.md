<p align="left">
  <img src="./icon.png" alt="Stride Logo" width="120" />
</p>

# Stride — Full-Stack Fitness Tracker

Welcome to **Stride** — a comprehensive full-stack fitness tracker application built with React, Tailwind CSS, Express.js, and MongoDB.  
This project provides a complete solution for tracking workouts, managing user authentication, and navigating fitness features with a sleek, modern design.

> 🚀 *This repository includes both frontend and backend components for a complete fitness tracking experience.*

---

## 📌 Features

- 🚀 **Responsive Layout:** Optimized for mobile, tablet, and desktop  
- 📋 **User Authentication:** Secure login and signup with JWT tokens  
- 🎨 **Dark Themed UI:** Custom Tailwind CSS theme with clean, modern components  
- 🌐 **React Router Integration:** Seamless client-side navigation  
- 💪 **Fitness-Focused UX:** Workout tracking, meal planning, progress monitoring  
- 🔐 **Protected Routes:** Role-based access for users and admins  
- 🗄️ **MongoDB Integration:** Persistent data storage with Mongoose  
- 🛡️ **Security:** Password hashing with bcrypt and CORS support  
- ⚡ **Real-Time Features:** WebSocket integration with Socket.io for live updates  
- 📊 **System Monitoring:** Real-time admin dashboard with metrics and activity tracking  
- 📤 **File Upload:** Multer integration for avatar and meal image uploads  

---

## 🛠 Technologies

### Frontend
- **React** — UI library  
- **Tailwind CSS** — Utility-first styling  
- **React Router DOM** — Routing  
- **Framer Motion** — Animations  
- **Create React App** — Project scaffold  
- **Material Symbols** — Icons  
- **Socket.io Client** — Real-time communication  
- **Axios** — HTTP client  
- **React Toastify** — Toast notifications  

### Backend
- **Express.js** — Web framework  
- **MongoDB** — NoSQL database  
- **Mongoose** — ODM for MongoDB  
- **JWT** — Authentication tokens  
- **bcryptjs** — Password hashing  
- **CORS** — Cross-origin resource sharing  
- **Socket.io** — Real-time bidirectional communication  
- **Multer** — File upload handling  
- **ES Modules** — Modern JavaScript module system  

---

## 📁 Full Folder Structure

```
Stride-React/
├── README.md
├── Backend/
│   ├── package.json
│   ├── server.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── Models/
│   │   ├── mealSchema.js
│   │   ├── userMealSchema.js
│   │   └── userSchema.js
│   ├── Routes/
│   │   ├── adminMeals.js
│   │   ├── adminUsers.js
│   │   ├── authRoutes.js
│   │   ├── fetchUserMeals.js
│   │   ├── mealRoute.js
│   │   ├── protectedRoutes.js
│   │   ├── userMeals.js
│   │   ├── userRoutes.js
│   │   ├── userTargetRoutes.js
│   │   └── system/
│   │       └── adminDashboardRoutes.js
│   └── uploads/
│       ├── avatars/
│       └── meals/
├── Frontend/
│   ├── package.json
│   ├── postcss.config.js
│   ├── README.md
│   ├── tailwind.config.js
│   ├── build/
│   │   ├── asset-manifest.json
│   │   ├── index.html
│   │   ├── manifest.json
│   │   ├── robots.txt
│   │   └── static/
│   │       ├── css/
│   │       │   └── main.67ff7ed3.css
│   │       ├── js/
│   │       │   ├── main.4ad52ac7.js
│   │       │   └── main.4ad52ac7.js.LICENSE.txt
│   │       └── media/
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── robots.txt
│   └── src/
│       ├── App.jsx
│       ├── index.css
│       ├── index.js
│       ├── AdminPanel/
│       │   ├── AdminContent.jsx
│       │   ├── AdminDashboard.jsx
│       │   ├── AdminMeal.jsx
│       │   ├── AdminSettings.jsx
│       │   ├── AdminUsers.jsx
│       │   └── components/
│       │       ├── AdminLayout.jsx
│       │       ├── Header.jsx
│       │       └── Sidebar.jsx
│       ├── assets/
│       │   ├── Fonts/
│       │   └── images/
│       ├── Components/
│       │   └── ProtectedRoute.js
│       ├── DisplaySite/
│       │   ├── Features.jsx
│       │   ├── MainHome.jsx
│       │   └── Pricing.jsx
│       └── UserPanel/
│       │    ├── Dashboard.jsx
│       │    ├── Login.jsx
│       │    ├── MealPlanner.jsx
│       │    ├── Notification.jsx
│       │    ├── Progress.jsx
│       │    ├── Settings.jsx
│       │    ├── settingsbck.jsx
│       │    ├── Signup.jsx
│       │    ├── Training.jsx
│       │    ├── components/
│       │    │   ├── Grid.jsx
│       │    │   ├── Header.jsx
│       │    │   ├── Sidebar.jsx
│       │    │   └── UserLayout.jsx
│       │    └── context/
│       │        └── UserContext.js
│       │ 
│       ├── DisplaySite/
│           ├── Features.jsx
│           ├── MainHome.jsx
│           └── Pricing.jsx
└────────────────────────────────────
```

---

## 🚀 Getting Started

Follow these instructions to set up and run the full-stack application locally.

### 🔧 Requirements

- **Node.js** (v14 or higher)  
- **npm** or **yarn**  
- **MongoDB** (local or cloud instance like MongoDB Atlas)  

Verify installations:
```bash
node --version
npm --version
```

### 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Raven117k/Stride.git
   cd Stride-React
   ```

2. **Set up Backend:**
   ```bash
   cd Backend
   npm install
   ```
   Create a `.env` file in the `Backend` directory with or you can use the default one which is already created in `Backend` Folder:
   ```
   MONGO_URI=mongodb://localhost:27017/stridedb  # or your MongoDB URI
   PORT=5000
   JWT_SECRET=your_jwt_secret_key
   ```

3. **Set up Frontend:**
   ```bash
   cd ../Frontend  
   npm install
   ```

---

## ▶️ How to Run

1. **Start the Backend Server:**
   ```bash
   cd Backend
   node server.js
   ```
   The backend will run on `http://localhost:5000`

2. **Start the Frontend Development Server:**
   ```bash
   cd ../Frontend
   npm start
   ```
   The frontend will run on `http://localhost:3000`

3. **Access the Application:**
   Open your browser and navigate to `http://localhost:3000`

---

## � Default Login Credentials

For testing and development purposes, use these default accounts:

### Admin Account
- **Email:** admin@stride.com  
- **Password:** Admin1234  

### User Account
- **Email:** user@stride.com  
- **Password:** User1234  

> 💡 *These credentials are pre-configured in the database for quick access during development.*

---

## 🍽️ **Meal & Nutrition Features**

### **Core Functionality**
- **Meal Management**: Admins can create, update, and delete meals with nutritional information
- **Nutrition Tracking**: Track calories, protein, carbs, and fats for each meal
- **Daily Planning**: Users can add meals to their daily plan from available options
- **Progress Monitoring**: Visual progress bars showing daily intake vs targets
- **Custom Targets**: Users can set personalized nutrition goals
- **Meal Completion**: Mark meals as completed with timestamps

### **Data Models**
- **Meal Schema**: Stores meal details with embedded food items and nutritional data
- **UserMeal Schema**: Tracks user's daily meal plans and completion status
- **User Targets**: Stores personalized nutrition goals in user profile

### **API Endpoints**
- Complete CRUD operations for meal management
- User meal planning and tracking
- Nutrition target management
- Daily totals calculation with virtual properties

---

### 🚀 **REAL-TIME FEATURES**

#### ⚡ **WebSocket Integration**
- **Socket.io Server:** Real-time bidirectional communication
- **Live Metrics:** Real-time system performance monitoring
- **Activity Tracking:** Live activity logging and broadcasting
- **Connection Management:** Active client connection tracking
- **Admin Dashboard:** Live updates for system metrics and user activities

#### 📊 **System Monitoring**
- **Request Tracking:** Real-time API request monitoring
- **Response Times:** Average response time calculations
- **Error Tracking:** Live error count and logging
- **CPU Usage:** Real-time CPU utilization monitoring
- **Uptime Tracking:** Server uptime and availability monitoring
- **Activity Logs:** Comprehensive activity logging system

---

### ✅ **Total FEATURES**

#### 🔐 **Authentication System**
- ✅ User registration 
- ✅ JWT-based login system
- ✅ Role-based access control (User/Admin)
- ✅ Protected routes middleware
- ✅ Password hashing with bcrypt
- ✅ Session management with localStorage

#### 👤 **User Management**
- ✅ Comprehensive user profiles (name, email, phone, avatar)
- ✅ Fitness data tracking (weight, height, age, location)
- ✅ User preferences and notification settings
- ✅ Account status management (active, banned, etc.)
- ✅ Subscription plans (Free, Basic, Pro, Elite)

#### 🎯 **User Dashboard**
- ✅ User-Interface
- ❌ Active calories tracking with progress bars
- ❌ Heart rate monitoring with status indicators
- ❌ Recovery score calculations
- ❌ Daily activity summaries

#### 💪 **Training Module**
- ✅ User-interface
- ❌ Exercise library with categories (Strength, Cardio)
- ❌ Exercise search and filtering
- ❌ Workout planning interface
- ❌ Exercise addition/removal functionality

#### 🥗 **Nutrition & Meal Planning**
- ✅ User-interface
- ✅ Macronutrient monitoring (Protein, Carbs, Fats)
- ✅ Meal planning interface
- ✅ Nutrition progress visualization
- ✅ Dietary goal setting
- ✅ Admin meal management
- ✅ Meal completion tracking
- ✅ Daily nutrition totals
- ✅ Customizable nutrition targets
- ✅ Meal logging and tracking APIs
- ✅ File upload for meal images

#### 📈 **Progress Analytics**
- ✅ User-interface
- ❌ Time-based filtering (Week/Month/Year/All Time)
- ❌ Data export functionality
- ❌ Performance trend analysis
- ❌ Achievement tracking

#### 🔔 **Notifications System**
- ✅ User-interface
- ❌ Badge/achievement notifications
- ❌ Goal completion notifications
- ❌ Community interaction alerts
- ❌ Mark as read functionality

#### ⚙️ **Settings & Profile**
- ✅ User profile editing
- ✅ Password change functionality
- ✅ Notification preferences
- ✅ Account deletion
- ✅ Privacy settings
- ✅ File upload for meal images

#### 🛡️ **Admin Panel**
- ✅ Admin dashboard with system metrics
- ✅ User management (view, edit, delete, ban)
- ✅ User search and filtering
- ✅ Role assignment and management
- ✅ Real-time system monitoring
- ✅ Activity logging and tracking
- ✅ Live metrics broadcasting
- ✅ Request/response monitoring

#### 🎨 **Workout Management (Admin)**
- ✅ Exercise content management
- ✅ Content categorization
- ✅ Content approval workflow

#### 🎨 **Design & UI/UX**
- ✅ Fully responsive design (mobile/tablet/desktop)
- ✅ Dark theme with neon accent colors
- ✅ Material Symbols icon integration
- ✅ Smooth animations with Framer Motion
- ✅ Custom scrollbar styling
- ✅ Card-based layouts
- ✅ Professional typography (Inter font)

#### 🏗️ **Technical Architecture**
- 🔄 React 19 with modern hooks
- 🔄 Express.js backend with RESTful APIs
- 🔄 MongoDB with Mongoose ODM
- 🔄 JWT authentication system
- 🔄 Tailwind CSS with custom design system
- 🔄 React Router for navigation
- 🔄 Axios for API communication
- 🔄 Environment-based configuration

---

### 🚧 **IN DEVELOPMENT / PLANNED FEATURES**

#### 🔄 **Backend Enhancements**
- 🔄 User workout data persistence
- 🔄 Progress data storage and analytics
- 🔄 Email notifications system
- 🔄 Password reset functionality

#### 📱 **Frontend Enhancements**
- 🔄 Real-time data synchronization
- 🔄 Advanced workout logging
- 🔄 Social features (following, sharing)
- 🔄 Integration with fitness wearables
- 🔄 Advanced analytics charts
- 🔄 Mobile app optimization

---

### 📈 **PROJECT METRICS**

- **Frontend Components**: 25+ React components
- **Backend Routes**: 20+ API endpoints
- **Database Models**: 3 models (User, Meal, UserMeal)
- **UI Pages**: 15+ pages (landing, auth, user panels, admin panels)
- **Technologies**: 20+ npm packages
- **Code Lines**: ~10,000+ lines of code
- **Responsive Breakpoints**: Mobile, tablet, desktop support

---

### 🎯 **CURRENT PROJECT STATE**

**Status**: 🟢 **FULLY FUNCTIONAL MVP** - Complete authentication, meal planning, nutrition tracking, and real-time admin dashboard implemented

**Usability**: ✅ **HIGH** - Beautiful, responsive interface with smooth UX
**Security**: ✅ **SECURE** - JWT authentication, password hashing, role-based access
**Scalability**: ✅ **GOOD** - Well-structured codebase with modular architecture
**Performance**: ✅ **OPTIMIZED** - Fast loading, efficient rendering, real-time updates
**Real-time**: ✅ **ENABLED** - WebSocket integration for live system monitoring

---

### 🚀 **NEXT STEPS FOR DEVELOPMENT**

1. **Complete Training Module** - Exercise library and workout logging
2. **Progress Analytics** - Advanced charts and trend analysis with real-time updates
3. **Enhanced File Upload System** - Avatar and media uploads with cloud storage
4. **Email Integration** - Notifications and password reset system
5. **Mobile App Development** - React Native implementation
6. **AI Integration** - Smart meal and workout recommendations
7. **Payment System** - Subscription management with Stripe
8. **Advanced Real-time Features** - Live user collaboration and social features
9. **Data Export** - CSV/PDF export functionality for user data
10. **API Rate Limiting** - Implement rate limiting and request throttling
---


## �🔗 API Routes

### Backend Endpoints
- `POST /api/auth/signup` — User registration  
- `POST /api/auth/login` — User login  
- `GET /db-test` — Database connection test  
- `GET /api/health` — Server health check  
- `GET /api/meals` — Get available meals (user)  
- `POST /api/user-meals` — Add meal to user plan  
- `GET /api/user-meals` — Get user's daily meals  
- `PUT /api/user-meals/:id` — Update meal status  
- `DELETE /api/user-meals/:id` — Remove meal from plan  
- `GET /api/targets` — Get user nutrition targets  
- `PUT /api/targets` — Update user nutrition targets  
- `GET /api/admin/meals` — Get all meals (admin)  
- `POST /api/admin/meals` — Create new meal (admin)  
- `PUT /api/admin/meals/:id` — Update meal (admin)  
- `DELETE /api/admin/meals/:id` — Delete meal (admin)  
- `GET /api/admin/dashboard/metrics` — Get system metrics  
- `GET /api/admin/dashboard/logs` — Get activity logs  
- `GET /api/admin/users` — Get all users (admin)  
- `PUT /api/admin/users/:id` — Update user (admin)  
- `DELETE /api/admin/users/:id` — Delete user (admin)

### Frontend Routes
| Path              | Component          | Description                  |
|-------------------|--------------------|------------------------------|
| `/`               | MainHome          | Landing page                 |
| `/login`          | Login             | User login                   |
| `/signup`         | Signup            | User registration            |
| `/user/`          | Dashboard         | User dashboard               |
| `/user/training`  | Training          | Workout tracking             |
| `/user/progress`  | Progress          | Progress monitoring          |
| `/user/meal`      | MealPlanner       | Meal planning                |
| `/user/settings`  | Settings          | User settings                |
| `/user/notifications`| Notification     | User notifications           |
| `/admin`          | AdminDashboard    | Admin panel                  |
| `/admin/users`    | AdminUsers        | User management              |
| `/admin/content`  | AdminContent      | Content management           |
| `/admin/settings` | AdminSettings     | Admin settings               |
| `/admin/meal`     | AdminMeal         | Meal management              |

---

## 📦 Dependencies

### Backend Dependencies
- `bcryptjs: ^3.0.3` — Password hashing  
- `cors: ^2.8.5` — Cross-origin resource sharing  
- `dotenv: ^17.2.3` — Environment variables  
- `express: ^5.2.1` — Web framework  
- `jsonwebtoken: ^9.0.3` — JWT authentication  
- `mongoose: ^9.1.4` — MongoDB ODM  
- `multer: ^2.0.2` — File upload handling  
- `socket.io: ^4.8.3` — Real-time communication  
- `ws: ^8.19.0` — WebSocket support

### Frontend Dependencies
- `@testing-library/dom: ^10.4.1` — DOM testing utilities  
- `@testing-library/jest-dom: ^6.9.1` — Jest DOM assertions  
- `@testing-library/react: ^16.3.1` — React testing utilities  
- `@testing-library/user-event: ^13.5.0` — User event simulation  
- `axios: ^1.13.2` — HTTP client for API calls  
- `framer-motion: ^12.26.2` — Animation library  
- `lucide-react: ^0.563.0` — Icon library  
- `react: ^19.2.3` — UI library  
- `react-dom: ^19.2.3` — React DOM rendering  
- `react-router-dom: ^6.30.3` — Routing  
- `react-scripts: 5.0.1` — CRA scripts  
- `react-toastify: ^11.0.5` — Toast notifications  
- `socket.io-client: ^4.8.3` — Real-time communication client  
- `ws: ^8.19.0` — WebSocket client support  
- `web-vitals: ^2.1.4` — Performance metrics  

### Frontend DevDependencies
- `@tailwindcss/container-queries: ^0.1.1` — Tailwind container queries  
- `@tailwindcss/forms: ^0.5.11` — Tailwind form styles  
- `autoprefixer: ^10.4.23` — CSS autoprefixing  
- `postcss: ^8.5.6` — CSS processing  
- `tailwindcss: ^3.4.14` — Utility-first CSS  

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

### **README Updates Made**
- Added real-time WebSocket features with Socket.io integration
- Updated folder structure to include system monitoring routes
- Added comprehensive system monitoring and activity tracking features
- Updated dependencies to include socket.io, socket.io-client, and ws packages
- Expanded API endpoints list with admin dashboard routes
- Updated project metrics (25+ components, 20+ routes, 10,000+ lines)
- Updated project status to include real-time capabilities
- Added file upload features for meal images
- Revised next steps to reflect current implementation status
- Updated frontend routes to match actual routing structure


## 📄 License

This project is licensed under the ISC License.
