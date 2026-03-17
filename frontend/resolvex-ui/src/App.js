import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* PAGES */
import Home from "./pages/Home"; // ✅ NEW

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
APP ROUTER (PUBLIC MODE)
============================================================
*/

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ✅ LANDING PAGE */}
        <Route path="/" element={<Home />} />

        {/* DASHBOARDS */}
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/committee" element={<CommitteeDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/authority" element={<AuthorityDashboard />} />

        {/* FEATURES */}
        <Route path="/feed" element={<IssueFeed />} />
        <Route path="/report" element={<ReportIssue />} />
        <Route path="/my-issues" element={<MyIssues />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/leaderboard" element={<Leaderboard />} />

        {/* ✅ FALLBACK → GO HOME */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;