import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";

import StudentDashboard from "./pages/StudentDashboard";
import CommitteeDashboard from "./pages/CommitteeDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AuthorityDashboard from "./pages/AuthorityDashboard";

import ReportIssue from "./pages/ReportIssue";
import IssueFeed from "./pages/IssueFeed";
import MyIssues from "./pages/MyIssues";
import Leaderboard from "./pages/Leaderboard";
import Notifications from "./pages/Notifications";

function App() {

return (


<AuthProvider>

  <Router>

    <Routes>

      {/* ========================= */}
      {/* PUBLIC ROUTES */}
      {/* ========================= */}

      <Route path="/login" element={<Login />} />

      {/* ========================= */}
      {/* PROTECTED APP LAYOUT */}
      {/* ========================= */}

      <Route element={<ProtectedRoute />}>

        <Route element={<Navbar />}>

          {/* Default Redirect */}
          <Route
  index
  element={<Navigate to="/student-dashboard" />}
/>

          {/* ========================= */}
          {/* STUDENT ROUTES */}
          {/* ========================= */}

          <Route
            path="/student-dashboard"
            element={<StudentDashboard />}
          />

          <Route
            path="/report-issue"
            element={<ReportIssue />}
          />

          <Route
            path="/issues"
            element={<IssueFeed />}
          />

          <Route
            path="/my-issues"
            element={<MyIssues />}
          />

          <Route
            path="/leaderboard"
            element={<Leaderboard />}
          />

          <Route
            path="/notifications"
            element={<Notifications />}
          />

          {/* ========================= */}
          {/* COMMITTEE ROUTES */}
          {/* ========================= */}

          <Route
            path="/committee-dashboard"
            element={<CommitteeDashboard />}
          />

          {/* ========================= */}
          {/* ADMIN ROUTES */}
          {/* ========================= */}

          <Route
            path="/admin-dashboard"
            element={<AdminDashboard />}
          />

          {/* ========================= */}
          {/* AUTHORITY ROUTES */}
          {/* ========================= */}

          <Route
            path="/authority-dashboard"
            element={<AuthorityDashboard />}
          />

        </Route>

      </Route>

    </Routes>

  </Router>

</AuthProvider>


);

}

export default App;
