import React from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";

import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import IssueFeed from "./pages/IssueFeed";
import ReportIssue from "./pages/ReportIssue";
import Notifications from "./pages/Notifications";
import CommitteeDashboard from "./pages/CommitteeDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import MyIssues from "./pages/MyIssues";

function Layout() {

  const location = useLocation();

  const hideNavbar = location.pathname === "/login";

  return (

    <div className="flex">

      {!hideNavbar && <Navbar />}

      <div className="flex-1 p-8 bg-gray-100 min-h-screen">

        <Routes>

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/feed"
            element={
              <ProtectedRoute>
                <IssueFeed />
              </ProtectedRoute>
            }
          />

          <Route
            path="/report"
            element={
              <ProtectedRoute>
                <ReportIssue />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-issues"
            element={
              <ProtectedRoute>
                <MyIssues />
              </ProtectedRoute>
            }
          />

          <Route
            path="/committee"
            element={
              <ProtectedRoute>
                <CommitteeDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/"
            element={<Navigate to="/student-dashboard" />}
          />

        </Routes>

      </div>

    </div>

  );

}

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