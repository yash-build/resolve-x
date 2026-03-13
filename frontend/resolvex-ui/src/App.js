/*
=====================================================================
ResolveX Main Application Router
=====================================================================

This is the central routing engine of ResolveX.

Responsibilities:

1. Wrap the application with AuthProvider
2. Control protected routes
3. Manage role-based access control
4. Render Navbar layout conditionally
5. Provide scalable routing architecture
6. Prevent unauthorized page access
7. Maintain clean separation between pages

=====================================================================
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
=====================================================================
Context Providers
=====================================================================
*/

import { AuthProvider } from "./context/AuthContext";

/*
=====================================================================
Layout Components
=====================================================================
*/

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

/*
=====================================================================
Page Components
=====================================================================
*/

import Login from "./pages/Login";

import StudentDashboard from "./pages/StudentDashboard";

import IssueFeed from "./pages/IssueFeed";

import ReportIssue from "./pages/ReportIssue";

import Notifications from "./pages/Notifications";

import CommitteeDashboard from "./pages/CommitteeDashboard";

import AdminDashboard from "./pages/AdminDashboard";

import MyIssues from "./pages/MyIssues";

/*
=====================================================================
Application Layout Controller
=====================================================================

This component determines:

• When to show sidebar
• Where pages render
• Layout consistency

=====================================================================
*/

function AppLayout() {

  const location = useLocation();

  /*
  ---------------------------------------------------------------
  Hide sidebar on login page
  ---------------------------------------------------------------
  */

  const hideNavbar = location.pathname === "/login";

  /*
  ---------------------------------------------------------------
  Main Layout Rendering
  ---------------------------------------------------------------
  */

  return (

    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar Navigation */}

      {!hideNavbar && (

        <div className="w-64">

          <Navbar />

        </div>

      )}

      {/* Main Content Area */}

      <div className="flex-1 p-8">

        <Routes>

          {/*
          =========================================================
          PUBLIC ROUTES
          =========================================================
          */}

          <Route
            path="/login"
            element={<Login />}
          />

          {/*
          =========================================================
          STUDENT ROUTES
          =========================================================
          */}

          <Route
            path="/student-dashboard"
            element={

              <ProtectedRoute allowedRoles={["student"]}>

                <StudentDashboard />

              </ProtectedRoute>

            }
          />

          <Route
            path="/report"
            element={

              <ProtectedRoute allowedRoles={["student"]}>

                <ReportIssue />

              </ProtectedRoute>

            }
          />

          <Route
            path="/feed"
            element={

              <ProtectedRoute allowedRoles={["student","committee","admin"]}>

                <IssueFeed />

              </ProtectedRoute>

            }
          />

          <Route
            path="/my-issues"
            element={

              <ProtectedRoute allowedRoles={["student"]}>

                <MyIssues />

              </ProtectedRoute>

            }
          />

          {/*
          =========================================================
          COMMITTEE ROUTES
          =========================================================
          */}

          <Route
            path="/committee"
            element={

              <ProtectedRoute allowedRoles={["committee"]}>

                <CommitteeDashboard />

              </ProtectedRoute>

            }
          />

          {/*
          =========================================================
          ADMIN ROUTES
          =========================================================
          */}

          <Route
            path="/admin-dashboard"
            element={

              <ProtectedRoute allowedRoles={["admin"]}>

                <AdminDashboard />

              </ProtectedRoute>

            }
          />

          {/*
          =========================================================
          SHARED ROUTES
          =========================================================
          */}

          <Route
            path="/notifications"
            element={

              <ProtectedRoute allowedRoles={["student","committee","admin"]}>

                <Notifications />

              </ProtectedRoute>

            }
          />

          {/*
          =========================================================
          DEFAULT ROUTE REDIRECTION
          =========================================================
          */}

          <Route
            path="/"
            element={<Navigate to="/student-dashboard" />}
          />

          {/*
          =========================================================
          FALLBACK ROUTE (404 HANDLER)
          =========================================================
          */}

          <Route
            path="*"
            element={

              <div className="text-center mt-20">

                <h1 className="text-4xl font-bold mb-4">

                  404

                </h1>

                <p className="text-gray-500">

                  Page not found.

                </p>

              </div>

            }
          />

        </Routes>

      </div>

    </div>

  );

}

/*
=====================================================================
Main App Component
=====================================================================

Wraps the entire application with:

• Authentication context
• Router provider
• Layout controller

=====================================================================
*/

function App() {

  return (

    <AuthProvider>

      <Router>

        <AppLayout />

      </Router>

    </AuthProvider>

  );

}

export default App;