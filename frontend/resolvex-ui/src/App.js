import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import ReportIssue from "./pages/ReportIssue";
import IssueFeed from "./pages/IssueFeed";
import CommitteeDashboard from "./pages/CommitteeDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";

import { useAuth } from "./context/AuthContext";

function App() {

  const { role } = useAuth();

  const getDashboard = () => {

    if (role === "admin") return "/admin-dashboard";
    if (role === "committee") return "/committee";
    return "/student-dashboard";

  };

  return (

    <Router>

      <Navbar />

      <Routes>

        <Route path="/" element={<Navigate to={getDashboard()} />} />

        <Route path="/report" element={<ReportIssue />} />

        <Route path="/feed" element={<IssueFeed />} />

        <Route path="/committee" element={<CommitteeDashboard />} />

        <Route path="/student-dashboard" element={<StudentDashboard />} />

        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        <Route path="/login" element={<Login />} />

      </Routes>

    </Router>

  );

}

export default App;