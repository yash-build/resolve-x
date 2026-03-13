import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { currentUser, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-indigo-600 to-purple-600 text-white flex flex-col p-6">

      {/* App Title */}
      <h1 className="text-2xl font-bold mb-10">ResolveX</h1>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-4">

        {role === "student" && (
          <>
            <Link to="/student-dashboard" className="hover:text-gray-200">
              Dashboard
            </Link>

            <Link to="/report" className="hover:text-gray-200">
              Report Issue
            </Link>

            <Link to="/feed" className="hover:text-gray-200">
              Issue Feed
            </Link>
          </>
        )}

        {role === "committee" && (
          <>
            <Link to="/committee" className="hover:text-gray-200">
              Committee Dashboard
            </Link>

            <Link to="/feed" className="hover:text-gray-200">
              Issue Feed
            </Link>
          </>
        )}

        {role === "admin" && (
          <>
            <Link to="/admin-dashboard" className="hover:text-gray-200">
              Admin Dashboard
            </Link>

            <Link to="/feed" className="hover:text-gray-200">
              Issue Feed
            </Link>
          </>
        )}

      </nav>

      {/* Bottom section */}
      <div className="mt-auto">

        {currentUser && (
          <button
            onClick={handleLogout}
            className="w-full bg-white text-indigo-600 font-semibold py-2 rounded hover:bg-gray-200 transition"
          >
            Logout
          </button>
        )}

      </div>
    </div>
  );
};

export default Navbar;