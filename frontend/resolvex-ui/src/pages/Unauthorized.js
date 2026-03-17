import React from "react";
import { Link } from "react-router-dom";

function Unauthorized() {

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="text-center max-w-sm">

        <div className="text-5xl font-bold text-indigo-200 mb-4">
          403
        </div>

        <h1 className="text-xl font-semibold text-gray-800 mb-2">
          Access denied
        </h1>

        <p className="text-sm text-gray-500 mb-6">
          You don't have permission to view this page.
        </p>

        <Link
          to="/login"
          className="inline-block px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Back to login
        </Link>

      </div>

    </div>

  );

}

export default Unauthorized;