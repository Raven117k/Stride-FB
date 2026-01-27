import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./UserPanel/context/UserContext";


import Dashboard from "./UserPanel/Dashboard";
import Training from "./UserPanel/Training";
import Progress from "./UserPanel/Progress";
import MealPlanner from "./UserPanel/MealPlanner";
import Settings from "./UserPanel/Settings";
import Notification from "./UserPanel/Notification";
import Login from "./UserPanel/Login";
import Signup from "./UserPanel/Signup";
import MainHome from "./DisplaySite/MainHome";
import AdminDashboard from "./AdminPanel/AdminDashboard";
import AdminLayout from "./AdminPanel/components/AdminLayout";
import AdminUsers from "./AdminPanel/AdminUsers";
import AdminWorkout from "./AdminPanel/AdminWorkout";
import AdminSettings from "./AdminPanel/AdminSettings";
import AdminMeal from "./AdminPanel/AdminMeal";
import UserLayout from "./UserPanel/components/UserLayout";
import ProtectedRoute from "./Components/ProtectedRoute";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          {/* Display Site */}
          <Route path="/" element={<MainHome />} />

          {/* User */}
          <Route
            path="/user/"
            element={
              <ProtectedRoute role="user">
                <UserLayout>
                  <Dashboard />
                </UserLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/training"
            element={
              <ProtectedRoute role="user">
                <UserLayout>
                  <Training />
                </UserLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/progress"
            element={
              <ProtectedRoute role="user">
                <UserLayout>
                  <Progress />
                </UserLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/meal"
            element={
              <ProtectedRoute role="user">
                <UserLayout>
                  <MealPlanner />
                </UserLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/settings"
            element={
              <ProtectedRoute role="user">
                <UserLayout>
                  <Settings />
                </UserLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/notifications"
            element={
              <ProtectedRoute role="user">
                <UserLayout>
                  <Notification />
                </UserLayout>
              </ProtectedRoute>
            }
          />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout>
                  <AdminUsers />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/workout"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout>
                  <AdminWorkout />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout>
                  <AdminSettings />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/meal"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout>
                  <AdminMeal />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
