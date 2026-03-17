
import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

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
============================================================
UNAUTHORIZED PAGE
============================================================
*/

function Unauthorized() {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="text-center">

        <h1 className="text-4xl font-bold text-indigo-500 mb-4">
          403
        </h1>

        <p className="text-gray-600 mb-6">
          You don't have permission to view this page.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 bg-indigo-600 text-white rounded"
        >
          Back to Login
        </button>

      </div>

    </div>
  );
}

/*
============================================================
ROOT REDIRECT LOGIC
============================================================
*/

function RootRedirect() {

  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading authentication...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role === "student" || role === "teacher") {
    return <Navigate to="/student" replace />;
  }

  if (role === "committee") {
    return <Navigate to="/committee" replace />;
  }

  if (role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  if (role === "authority") {
    return <Navigate to="/authority" replace />;
  }

  return <Navigate to="/login" replace />;
}

/*
============================================================
LOGIN REDIRECT
============================================================
*/

function LoginRoute() {

  const { user, role, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (user) {

    if (role === "student" || role === "teacher") {
      return <Navigate to="/student" replace />;
    }

    if (role === "committee") {
      return <Navigate to="/committee" replace />;
    }

    if (role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    if (role === "authority") {
      return <Navigate to="/authority" replace />;
    }

  }

  return <Login />;
}

/*
============================================================
APP ROUTER
============================================================
*/

function App() {

  return (

    <BrowserRouter>

      <AuthProvider>

        <Routes>

          <Route path="/" element={<RootRedirect />} />

          <Route path="/login" element={<LoginRoute />} />

          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={["student","teacher"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/committee"
            element={
              <ProtectedRoute allowedRoles={["committee"]}>
                <CommitteeDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/authority"
            element={
              <ProtectedRoute allowedRoles={["authority"]}>
                <AuthorityDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/feed"
            element={
              <ProtectedRoute allowedRoles={["student","teacher","committee","admin","authority"]}>
                <IssueFeed />
              </ProtectedRoute>
            }
          />

          <Route
            path="/report"
            element={
              <ProtectedRoute allowedRoles={["student","teacher"]}>
                <ReportIssue />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-issues"
            element={
              <ProtectedRoute allowedRoles={["student","teacher"]}>
                <MyIssues />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute allowedRoles={["student","teacher","committee","admin","authority"]}>
                <Notifications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute allowedRoles={["student","teacher","committee","admin","authority"]}>
                <Leaderboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>

      </AuthProvider>

    </BrowserRouter>

  );
}

export default App;

