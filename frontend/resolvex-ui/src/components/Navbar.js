
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {

  const { user, role, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navigationConfig = {

    student: [
      { name: "Dashboard", path: "/student" },
      { name: "Report Issue", path: "/student/report" },
      { name: "Issue Feed", path: "/student/feed" },
      { name: "My Issues", path: "/student/my-issues" },
      { name: "Leaderboard", path: "/student/leaderboard" },
      { name: "Notifications", path: "/student/notifications" }
    ],

    committee: [
      { name: "Dashboard", path: "/committee" }
    ],

    admin: [
      { name: "Dashboard", path: "/admin" },
      { name: "Authority", path: "/authority" }
    ],

    authority: [
      { name: "Dashboard", path: "/authority" }
    ]

  };

  const navigationItems = navigationConfig[role] || [];

  const isActive = (path) => location.pathname === path;

  const toggleSidebar = () => setCollapsed(!collapsed);

  if (!user) {

    return (

      <div className="w-64 min-h-screen bg-white border-r border-gray-200 p-6">

        <p className="text-gray-500">Loading...</p>

      </div>

    );

  }

  return (

    <div
      className={`
      bg-gradient-to-b
      from-indigo-600
      to-purple-700
      text-white
      flex
      flex-col
      transition-all
      duration-300
      ${collapsed ? "w-20" : "w-64"}
      min-h-screen
      `}
    >

      {/* HEADER */}

      <div className="p-6 flex items-center justify-between">

        <h1 className={`font-bold text-xl ${collapsed ? "hidden" : "block"}`}>
          ResolveX
        </h1>

        <button onClick={toggleSidebar}>
          ☰
        </button>

      </div>

      {/* NAVIGATION */}

      <div className="flex-1 px-4 space-y-2">

        {navigationItems.map((item) => (

          <Link
            key={item.path}
            to={item.path}
            className={`block px-4 py-2 rounded ${
              isActive(item.path)
                ? "bg-white text-purple-700"
                : "hover:bg-purple-600"
            }`}
          >
            {collapsed ? item.name[0] : item.name}
          </Link>

        ))}

      </div>

      {/* USER SECTION */}

      <div className="p-4 border-t border-purple-400">

        <p className="text-sm">
          Logged in as
        </p>

        <p className="text-sm font-semibold">
          {user?.email}
        </p>

        <button
          onClick={logout}
          className="mt-4 w-full bg-white text-purple-700 px-4 py-2 rounded"
        >
          Logout
        </button>

      </div>

    </div>

  );

};

export default Navbar;

