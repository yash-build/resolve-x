import React, { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {

const { currentUser, userProfile, logout } = useAuth();
const location = useLocation();
const [collapsed, setCollapsed] = useState(false);

const navigationConfig = {

student: [
  { name: "Dashboard", path: "/student-dashboard" },
  { name: "Report Issue", path: "/report-issue" },
  { name: "Issue Feed", path: "/issues" },
  { name: "My Issues", path: "/my-issues" },
  { name: "Leaderboard", path: "/leaderboard" },
  { name: "Notifications", path: "/notifications" }
]


};

const role = userProfile?.role || "student";
const navigationItems = navigationConfig[role] || [];

const isActive = (path) => location.pathname === path;

const toggleSidebar = () => setCollapsed(!collapsed);

if (!currentUser) {
  return (
    <div className="flex items-center justify-center h-screen">
      <p>Loading user...</p>
    </div>
  );
}

return (


<div className="flex h-screen">

  {/* SIDEBAR */}

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
    `}
  >

    <div className="p-6 flex items-center justify-between">

      <h1 className={`font-bold text-xl ${collapsed ? "hidden" : "block"}`}>
        ResolveX
      </h1>

      <button onClick={toggleSidebar}>☰</button>

    </div>

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

    <div className="p-4 border-t border-purple-400">

      <p className="text-sm">Logged in as:</p>

      <p className="text-sm font-semibold">
        {currentUser?.email}
      </p>

      <button
        onClick={logout}
        className="mt-4 w-full bg-white text-purple-700 px-4 py-2 rounded"
      >
        Logout
      </button>

    </div>

  </div>

  {/* PAGE CONTENT AREA */}

  <div className="flex-1 bg-gray-100 overflow-y-auto p-8">

    <Outlet />

  </div>

</div>


);

};

export default Navbar;
