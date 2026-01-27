# Stride Backend API

The backend API for the Stride fitness tracker application, built with Express.js, MongoDB, and JWT authentication.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Navigate to backend directory:**
   ```bash
   cd Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the Backend directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/stridedb
   PORT=5000
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. **Start the server:**
   ```bash
   node server.js
   ```

The server will run on `http://localhost:5000`

## 📁 Project Structure

```
Backend/
├── middleware/
│   ├── auth.js          # Authentication middleware
│   └── upload.js        # File upload middleware
├── Models/
│   ├── userSchema.js    # User data model
│   ├── mealSchema.js    # Meal data model
│   └── userMealSchema.js # User meal tracking model
├── Routes/
│   ├── authRoutes.js    # Authentication endpoints
│   ├── userRoutes.js    # User management
│   ├── adminUsers.js    # Admin user management
│   ├── userTargetRoutes.js # Nutrition targets
│   ├── adminMeals.js    # Admin meal management
│   ├── fetchUserMeals.js # Available meals for users
│   ├── userMeals.js     # User meal planning
│   ├── mealRoute.js     # Meal CRUD operations
│   └── protectedRoutes.js # Protected route examples
├── uploads/             # File upload directory
│   ├── avatars/         # User profile images
│   └── meals/           # Meal images
├── server.js            # Main server file
├── package.json         # Dependencies
└── .env                 # Environment variables
```

## 🛠 Technologies Used

- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **multer** - File upload handling
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📊 Data Models

### User Model
```javascript
{
  name: String,
  email: String,
  password: String,
  role: String (user/admin),
  avatar: String,
  targets: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fats: Number
  },
  // ... other user fields
}
```

### Meal Model
```javascript
{
  userId: ObjectId (ref: User),
  date: Date,
  type: String (breakfast/lunch/dinner/snacks),
  time: String,
  foods: [{
    name: String,
    calories: Number,
    protein: Number,
    carbs: Number,
    fats: Number
  }],
  image: String,
  // Virtual: totals (calculated from foods)
}
```

### UserMeal Model
```javascript
{
  userId: ObjectId (ref: User),
  mealId: ObjectId (ref: Meal),
  date: String (YYYY-MM-DD),
  type: String,
  isDone: Boolean,
  completedAt: Date
}
```

## 🔗 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### User Routes (`/api/user`)
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `DELETE /api/user/profile` - Delete user account

### Admin User Management (`/api/admin/users`)
- `GET /api/admin/users` - Get all users (admin only)
- `PUT /api/admin/users/:id` - Update user (admin only)
- `DELETE /api/admin/users/:id` - Delete user (admin only)

### Nutrition Targets (`/api/targets`)
- `GET /api/targets` - Get user nutrition targets
- `PUT /api/targets` - Update user nutrition targets

### Admin Meal Management (`/api/admin/meals`)
- `GET /api/admin/meals` - Get all meals (admin only)
- `POST /api/admin/meals` - Create new meal (admin only)
- `PUT /api/admin/meals/:id` - Update meal (admin only)
- `DELETE /api/admin/meals/:id` - Delete meal (admin only)

### Available Meals (`/api/meals`)
- `GET /api/meals` - Get all available meals for users

### User Meal Planning (`/api/user-meals`)
- `GET /api/user-meals` - Get user's daily meals
- `POST /api/user-meals` - Add meal to user's plan
- `PUT /api/user-meals/:id` - Update meal status (mark done/undone)
- `DELETE /api/user-meals/:id` - Remove meal from plan

### Meal CRUD (`/api/meal`)
- `GET /api/meal/:userId/:date` - Get daily meals with totals
- `POST /api/meal/create` - Create new meal
- `POST /api/meal/add-food` - Add food to existing meal

### Utility Routes
- `GET /db-test` - Database connection test
- `GET /api/health` - Server health check
- `GET /uploads/*` - Serve uploaded files

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Login/Signup** to receive a JWT token
2. **Include token** in Authorization header: `Bearer <token>`
3. **Protected routes** require valid JWT token

### Middleware
- `protect` - Verifies JWT token and adds user to request
- `admin` - Additional check for admin role

## 📁 File Upload

- **Directory**: `/uploads`
- **Meal Images**: `/uploads/meals/`
- **User Avatars**: `/uploads/avatars/`
- **Supported Formats**: Images (jpg, png, etc.)
- **Access**: Public via `/uploads/*` route

## 🧪 Testing

### Database Connection Test
```bash
GET /db-test
```

### Health Check
```bash
GET /api/health
```

Returns server status, uptime, and database connection state.

## 🚀 Deployment

1. Set environment variables in production
2. Ensure MongoDB connection string is configured
3. Set strong JWT secret
4. Configure file upload limits if needed
5. Set up proper CORS origins for production domain

## 📝 Environment Variables

```env
MONGO_URI=mongodb://localhost:27017/stridedb
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_here
```

## 🔧 Development

### Available Scripts
- `npm test` - Run tests (currently placeholder)

### Code Style
- ES6+ modules
- Async/await for asynchronous operations
- Consistent error handling
- JWT-based authentication
- Role-based access control

## 📚 API Documentation

For detailed API documentation with request/response examples, see the main project README or use tools like Postman to test endpoints.

## 🤝 Contributing

1. Follow the existing code structure
2. Add proper error handling
3. Include authentication for protected routes
4. Test endpoints thoroughly
5. Update this README for new endpoints

## 📄 License

This project is licensed under the ISC License.