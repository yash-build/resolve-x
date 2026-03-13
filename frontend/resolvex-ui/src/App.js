/*
=====================================================================
ResolveX - Main Application Router
=====================================================================

This file controls the entire navigation architecture of ResolveX.

Responsibilities:

1. Wrap the app with authentication provider
2. Configure all application routes
3. Apply role-based route protection
4. Render global layout (Navbar + content)
5. Hide navigation on login page
6. Prevent unauthorized page access
7. Provide scalable routing structure

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

import CommitteeDashboard from "./pages/CommitteeDashboard";

import AdminDashboard from "./pages/AdminDashboard";

import AuthorityDashboard from "./pages/AuthorityDashboard";

import IssueFeed from "./pages/IssueFeed";

import ReportIssue from "./pages/ReportIssue";

import MyIssues from "./pages/MyIssues";

import Notifications from "./pages/Notifications";

import Leaderboard from "./pages/Leaderboard";

/*
=====================================================================
Application Layout Controller
=====================================================================

This component manages:

• Sidebar visibility
• Content rendering
• Page routing layout

Navbar should NOT appear on login screen.

=====================================================================
*/

function ApplicationLayout() {

  const location = useLocation();

  /*
  ---------------------------------------------------------------
  Determine if Navbar should be hidden
  ---------------------------------------------------------------
  */

  const hideNavbar = location.pathname === "/login";

  /*
  ---------------------------------------------------------------
  Main Layout Rendering
  ---------------------------------------------------------------
  */

  return (

    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">

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
          AUTHORITY ROUTES
          =========================================================
          */}

          <Route
            path="/authority"
            element={

              <ProtectedRoute allowedRoles={["admin","authority"]}>

                <AuthorityDashboard />

              </ProtectedRoute>

            }
          />

          {/*
          =========================================================
          SHARED ROUTES
          =========================================================
          */}

          <Route
            path="/feed"
            element={

              <ProtectedRoute allowedRoles={["student","committee","admin"]}>

                <IssueFeed />

              </ProtectedRoute>

            }
          />

          <Route
            path="/notifications"
            element={

              <ProtectedRoute allowedRoles={["student","committee","admin"]}>

                <Notifications />

              </ProtectedRoute>

            }
          />

          <Route
            path="/leaderboard"
            element={

              <ProtectedRoute allowedRoles={["student","committee","admin"]}>

                <Leaderboard />

              </ProtectedRoute>

            }
          />

          {/*
          =========================================================
          DEFAULT REDIRECTION
          =========================================================
          */}

          <Route
            path="/"
            element={<Navigate to="/student-dashboard" />}
          />

          {/*
          =========================================================
          FALLBACK ROUTE (404 PAGE)
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
                  The page you are looking for does not exist.
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
Main Application Component
=====================================================================

Wraps entire app with:

• Firebase Authentication context
• React Router provider
• Application layout controller

=====================================================================
*/

function App() {

  return (

    <AuthProvider>

      <Router>

        <ApplicationLayout />

      </Router>

    </AuthProvider>

  );

}

export default App;