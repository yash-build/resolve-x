import React from "react";
import { auth, googleProvider } from "../services/firebase";
import { signInWithPopup } from "firebase/auth";

const Login = () => {

  const handleLogin = async () => {

    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login error:", error);
    }

  };

  return (

    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <div className="bg-white p-10 rounded-xl shadow-lg w-96 text-center">

        <h1 className="text-3xl font-bold mb-6 text-indigo-600">
          ResolveX
        </h1>

        <p className="mb-6 text-gray-600">
          Preventive Campus Issue Management
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