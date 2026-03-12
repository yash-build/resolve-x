import React from "react";
import { Link } from "react-router-dom";

const StudentDashboard = () => {

  return (

    <div className="max-w-4xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">
        Student Dashboard
      </h1>

      <div className="grid grid-cols-2 gap-6">

        <Link
          to="/report"
          className="bg-white shadow rounded-xl p-6 hover:shadow-md"
        >
          <h2 className="text-lg font-semibold">
            Report New Issue
          </h2>
          <p className="text-gray-500 mt-2">
            Submit a complaint or campus problem
          </p>
        </Link>

        <Link
          to="/feed"
          className="bg-white shadow rounded-xl p-6 hover:shadow-md"
        >
          <h2 className="text-lg font-semibold">
            View Issue Feed
          </h2>
          <p className="text-gray-500 mt-2">
            See all reported issues and upvote
          </p>
        </Link>

      </div>

    </div>

  );

};

export default StudentDashboard;