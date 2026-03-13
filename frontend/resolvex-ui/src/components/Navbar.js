/*
====================================================================
ResolveX Navigation Sidebar + Notification Panel
====================================================================

This component handles:

1. Navigation sidebar
2. Notification bell
3. Real-time unread notification count
4. Notification dropdown panel
5. Mark notification as read
6. Logout functionality
7. Current user display

====================================================================
*/

import React, { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import {
  subscribeToNotifications,
  markNotificationAsRead
} from "../services/notificationService";

const Navbar = () => {

  /*
  ================================================================
  AUTHENTICATION CONTEXT
  ================================================================
  */

  const { currentUser, logout } = useAuth();

  const navigate = useNavigate();

  /*
  ================================================================
  STATE VARIABLES
  ================================================================
  */

  const [notifications, setNotifications] = useState([]);

  const [notificationCount, setNotificationCount] = useState(0);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  /*
  ================================================================
  SUBSCRIBE TO REAL-TIME NOTIFICATIONS
  ================================================================
  */

  useEffect(() => {

    if (!currentUser) return;

    const unsubscribe = subscribeToNotifications(

      currentUser.uid,

      (data) => {

        setNotifications(data);

        const unread = data.filter(
          n => !n.read
        ).length;

        setNotificationCount(unread);

      }

    );

    return () => unsubscribe();

  }, [currentUser]);

  /*
  ================================================================
  HANDLE LOGOUT
  ================================================================
  */

  const handleLogout = async () => {

    await logout();

    navigate("/login");

  };

  /*
  ================================================================
  HANDLE NOTIFICATION CLICK
  ================================================================
  */

  const handleNotificationClick = async (notification) => {

    if (!notification.read) {

      await markNotificationAsRead(notification.id);

    }

  };

  /*
  ================================================================
  UI RENDER
  ================================================================
  */

  return (

    <div className="w-64 h-screen bg-gradient-to-b from-indigo-600 to-purple-600 text-white flex flex-col p-6">

      {/* LOGO */}

      <h1 className="text-2xl font-bold mb-8">
        ResolveX
      </h1>

      {/* NAVIGATION LINKS */}

      <nav className="flex flex-col gap-4">

        <Link to="/student-dashboard">
          Dashboard
        </Link>

        <Link to="/report">
          Report Issue
        </Link>

        <Link to="/feed">
          Issue Feed
        </Link>

        <Link to="/my-issues">
          My Issues
        </Link>

        {/* NOTIFICATION BELL */}

        <button
          onClick={() =>
            setDropdownOpen(!dropdownOpen)
          }
          className="text-left"
        >

          🔔 Notifications ({notificationCount})

        </button>

      </nav>

      {/* NOTIFICATION DROPDOWN */}

      {dropdownOpen && (

        <div className="mt-4 bg-white text-black rounded shadow p-4 max-h-64 overflow-y-auto">

          <h2 className="font-bold mb-2">
            Notifications
          </h2>

          {notifications.length === 0 && (

            <div className="text-gray-500">
              No notifications yet
            </div>

          )}

          {notifications.map(notification => (

            <div
              key={notification.id}
              onClick={() =>
                handleNotificationClick(notification)
              }
              className={`p-2 border-b cursor-pointer ${
                notification.read
                  ? "bg-gray-100"
                  : "bg-blue-100"
              }`}
            >

              {notification.message}

            </div>

          ))}

        </div>

      )}

      {/* USER INFO */}

      <div className="mt-auto">

        <div className="mb-4 text-sm">

          Logged in as:

          <div className="font-semibold">
            {currentUser?.displayName}
          </div>

        </div>

        {/* LOGOUT BUTTON */}

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