import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* PAGES */
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
DEMO ROOT REDIRECT (NO LOGIN)
============================================================
*/

function RootRedirect() {
  return <Navigate to="/student" replace />;
}

/*
============================================================
APP ROUTER (PUBLIC MODE)
============================================================
*/

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ROOT */}
        <Route path="/" element={<RootRedirect />} />

        {/* DASHBOARDS (ALL PUBLIC) */}
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/committee" element={<CommitteeDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/authority" element={<AuthorityDashboard />} />

        {/* FEATURES (ALL PUBLIC) */}
        <Route path="/feed" element={<IssueFeed />} />
        <Route path="/report" element={<ReportIssue />} />
        <Route path="/my-issues" element={<MyIssues />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/leaderboard" element={<Leaderboard />} />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/student" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;