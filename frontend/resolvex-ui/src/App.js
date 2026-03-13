/*
========================================================
ResolveX Main Application Router
========================================================

This file handles:

• React Router configuration
• Page routing
• Layout system
• Protected routes
• Sidebar display logic
• Authentication wrapper

Architecture Overview

AuthProvider
    ↓
Router
    ↓
Layout System
    ↓
Routes

Pages Available:

/login
/student-dashboard
/report
/feed
/notifications
/committee
/admin-dashboard

========================================================
*/

import React from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";

/*
========================================================
Context
========================================================
*/

import { AuthProvider } from "./context/AuthContext";

/*
========================================================
Components
========================================================
*/

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

/*
========================================================
Pages
========================================================
*/

import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import CommitteeDashboard from "./pages/CommitteeDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import IssueFeed from "./pages/IssueFeed";
import ReportIssue from "./pages/ReportIssue";
import Notifications from "./pages/Notifications";

/*
========================================================
Layout Component
Controls when sidebar appears
========================================================
*/

function Layout() {

  const location = useLocation();

  /*
  Hide sidebar on login page
  */

  const hideNavbar = location.pathname === "/login";

  return (

    <div className="flex">

      {/* Sidebar */}

      {!hideNavbar && <Navbar />}

      {/* Main Content Area */}

      <div className="flex-1 p-8 bg-gray-100 min-h-screen">

        <Routes>

          {/* Login Page */}

          <Route
            path="/login"
            element={<Login />}
          />

          {/* Student Dashboard */}

          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          {/* Report Issue */}

          <Route
            path="/report"
            element={
              <ProtectedRoute>
                <ReportIssue />
              </ProtectedRoute>
            }
          />

          {/* Issue Feed */}

          <Route
            path="/feed"
            element={
              <ProtectedRoute>
                <IssueFeed />
              </ProtectedRoute>
            }
          />

          {/* Notifications */}

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />

          {/* Committee Dashboard */}

          <Route
            path="/committee"
            element={
              <ProtectedRoute>
                <CommitteeDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Dashboard */}

          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Default Redirect */}

          <Route
            path="/"
            element={<Navigate to="/student-dashboard" />}
          />

          {/* Fallback Route */}

          <Route
            path="*"
            element={<Navigate to="/student-dashboard" />}
          />

        </Routes>

      </div>

    </div>

  );

}

/*
========================================================
Main App Component
========================================================
*/

function App() {

  return (

    <AuthProvider>

      <Router>

        <Layout />

      </Router>

    </AuthProvider>

  );

}

export default App;