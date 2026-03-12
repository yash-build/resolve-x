import React from "react";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {

  const { currentUser } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (

    <nav className="bg-white border-b shadow-sm px-6 py-3 flex justify-between items-center">

      <h1 className="text-xl font-bold text-indigo-600">
        ResolveX
      </h1>

      <div className="flex gap-4 text-sm">

        <Link to="/">Home</Link>

        <Link to="/report">Report Issue</Link>

        <Link to="/feed">Issue Feed</Link>

        <Link to="/committee">Committee</Link>

        <Link to="/admin">Admin Panel</Link>

        {currentUser ? (

          <button
            onClick={handleLogout}
            className="text-red-600"
          >
            Logout
          </button>

        ) : (

          <Link to="/login">Login</Link>

        )}

      </div>

    </nav>

  );

};

export default Navbar;