import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { AuthContext } from "../context/AuthContext";

function Navbar() {

  const { currentUser } = useContext(AuthContext);

  const handleLogout = async () => {

    try {

      await signOut(auth);

      alert("Logged out successfully");

    } catch (error) {

      console.error("Logout error:", error);

    }

  };

  return (

    <nav style={{
      padding: "10px",
      borderBottom: "1px solid #ccc",
      marginBottom: "20px"
    }}>

      <Link to="/" style={{ marginRight: "15px" }}>
        Home
      </Link>

      <Link to="/report" style={{ marginRight: "15px" }}>
        Report Issue
      </Link>

      <Link to="/feed" style={{ marginRight: "15px" }}>
        Issue Feed
      </Link>

      <Link to="/admin" style={{ marginRight: "15px" }}>
        Admin Panel
      </Link>

      {!currentUser && (
        <Link to="/login">
          Login
        </Link>
      )}

      {currentUser && (
        <button
          onClick={handleLogout}
          style={{ marginLeft: "10px" }}
        >
          Logout
        </button>
      )}

    </nav>

  );

}

export default Navbar;