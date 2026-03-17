
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {

  const { user, loading, loginWithGoogle } = useAuth();

  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  /*
  ============================================================
  REDIRECT AFTER LOGIN
  ============================================================
  */

  useEffect(() => {

    if (loading) return;

    if (user) {
      navigate("/student", { replace: true });
    }

  }, [user, loading, navigate]);

  /*
  ============================================================
  GOOGLE LOGIN
  ============================================================
  */

  const handleGoogleLogin = async () => {

    setError("");

    try {

      setSigningIn(true);

      await loginWithGoogle();

    } catch (err) {

      console.error(err);

      setError("Google login failed.");

    } finally {

      setSigningIn(false);

    }

  };

  /*
  ============================================================
  LOADING STATE
  ============================================================
  */

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-gray-50">

        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />

      </div>

    );

  }

  /*
  ============================================================
  LOGIN UI
  ============================================================
  */

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">

        <h1 className="text-2xl font-bold mb-4 text-center">
          ResolveX Login
        </h1>

        {error && (
          <div className="mb-4 text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={signingIn}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >

          {signingIn ? "Signing in..." : "Login with Google"}

        </button>

      </div>

    </div>

  );

}

export default Login;

