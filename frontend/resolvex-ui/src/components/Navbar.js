/*
=====================================================================
ResolveX Role-Based Navigation Sidebar
=====================================================================

This component renders the sidebar navigation.

Features:

• Role-based navigation
• Notification counter
• Logout button
• Current user display
• Responsive layout

Roles Supported:

student
committee
admin
authority

=====================================================================
*/

import React from "react";

import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Navbar = () => {

  const { currentUser, role, logout } = useAuth();

  const navigate = useNavigate();

  /*
  ---------------------------------------------------------------
  Handle Logout
  ---------------------------------------------------------------
  */

  const handleLogout = async () => {

    await logout();

    navigate("/login");

  };

  /*
  ---------------------------------------------------------------
  Navigation by Role
  ---------------------------------------------------------------
  */

  const renderMenuItems = () => {

    if (role === "student") {

      return (

        <>
          <Link to="/student-dashboard">Dashboard</Link>

          <Link to="/report">Report Issue</Link>

          <Link to="/feed">Issue Feed</Link>

          <Link to="/my-issues">My Issues</Link>

          <Link to="/leaderboard">Leaderboard</Link>

          <Link to="/notifications">Notifications</Link>
        </>

      );

    }

    if (role === "committee") {

      return (

        <>
          <Link to="/committee">Committee Dashboard</Link>

          <Link to="/feed">Issue Feed</Link>

          <Link to="/notifications">Notifications</Link>
        </>

      );

    }

    if (role === "admin") {

      return (

        <>
          <Link to="/admin-dashboard">Admin Dashboard</Link>

          <Link to="/authority">Authority Panel</Link>

          <Link to="/feed">Issue Feed</Link>

          <Link to="/leaderboard">Leaderboard</Link>

          <Link to="/notifications">Notifications</Link>
        </>

      );

    }

    if (role === "authority") {

      return (

        <>
          <Link to="/authority">Authority Dashboard</Link>

          <Link to="/notifications">Notifications</Link>
        </>

      );

    }

  };

  /*
  ---------------------------------------------------------------
  Render Sidebar
  ---------------------------------------------------------------
  */

  return (

    <div className="w-full md:w-64 h-screen bg-gradient-to-b from-indigo-600 to-purple-600 text-white flex flex-col p-6">

      {/* Logo */}

      <h1 className="text-2xl font-bold mb-8">

        ResolveX

      </h1>

      {/* Navigation */}

      <nav className="flex flex-col gap-4">

        {renderMenuItems()}

      </nav>

      {/* User Info */}

      <div className="mt-auto">

        <div className="mb-4 text-sm">

          Logged in as:

          <div className="font-semibold">

            {currentUser?.displayName}

          </div>

          <div className="text-xs opacity-80">

            Role: {role}

          </div>

        </div>

        {/* Logout */}

        <button
          onClick={handleLogout}
          className="w-full bg-white text-indigo-600 py-2 rounded"
        >

          Logout

        </button>

      </div>

    </div>

  );

};

export default Navbar;