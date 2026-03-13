import React, { useEffect } from "react";

import { signInWithPopup } from "firebase/auth";

import { auth, googleProvider } from "../services/firebase";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Login = () => {

  const navigate = useNavigate();

  const { currentUser } = useAuth();

  /*
  ------------------------------------------------
  Redirect if already logged in
  ------------------------------------------------
  */

  useEffect(() => {

    if (currentUser) {
      navigate("/student-dashboard");
    }

  }, [currentUser, navigate]);

  /*
  ------------------------------------------------
  Google Login
  ------------------------------------------------
  */

  const handleLogin = async () => {

    try {

      await signInWithPopup(auth, googleProvider);

      navigate("/student-dashboard");

    } catch (error) {

      console.error("Login error:", error);

      alert("Login failed. Try again.");

    }

  };

  return (

    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <div className="bg-white p-10 rounded-xl shadow-lg w-96 text-center">

        <h1 className="text-3xl font-bold text-indigo-600 mb-6">
          ResolveX
        </h1>

        <p className="text-gray-600 mb-6">
          Smart Campus Issue Resolution Platform
        </p>

        <button
          onClick={handleLogin}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          Sign in with Google
        </button>

      </div>

    </div>

  );

};

export default Login;