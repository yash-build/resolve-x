import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import ReportIssue from "./pages/ReportIssue";
import IssueFeed from "./pages/IssueFeed";
import AdminPanel from "./pages/AdminPanel";
import Login from "./pages/Login";

function App() {

  return (

    <Router>

      <Navbar />

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/report" element={<ReportIssue />} />

        <Route path="/feed" element={<IssueFeed />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />

      </Routes>

    </Router>

  );

}

export default App;