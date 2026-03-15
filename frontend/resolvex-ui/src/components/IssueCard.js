
/*
=========================================================
ResolveX Issue Card Component
=========================================================

Displays a single issue in the Issue Feed.

Features
--------
• Issue title and description
• Category badge
• Severity indicator
• Upvote system
• Resolve button
• Priority score display
• Image previews
• Timestamp formatting

Used in:
IssueFeed.js
MyIssues.js
CommitteeDashboard.js
=========================================================
*/

import React from "react";

import {
  doc,
  updateDoc,
  increment
} from "firebase/firestore";

import { db } from "../services/firebase";

/*
=========================================================
Helper: Format Firestore Timestamp
=========================================================
*/

function formatTime(timestamp) {
  if (!timestamp) return "Unknown time";

  if (timestamp.seconds) {
    return new Date(timestamp.seconds * 1000).toLocaleString();
  }

  return new Date(timestamp).toLocaleString();
}

/*
=========================================================
Helper: Category Badge Colors
=========================================================
*/

function getCategoryColor(category) {
  const colors = {
    Hostel: "bg-indigo-500",
    Food: "bg-pink-500",
    Hygiene: "bg-teal-500",
    Infrastructure: "bg-blue-500",
    Discipline: "bg-gray-600"
  };

  return colors[category] || "bg-gray-400";
}

/*
=========================================================
Helper: Severity Badge Colors
=========================================================
*/

function getSeverityColor(severity) {
  const level = Number(severity);

  if (level >= 4) return "bg-red-500 text-white";
  if (level === 3) return "bg-orange-500 text-white";
  if (level === 2) return "bg-yellow-400 text-black";

  return "bg-green-400 text-black";
}

/*
=========================================================
Main Issue Card Component
=========================================================
*/

const IssueCard = ({ issue }) => {

  /*
  -------------------------------------------------------
  Upvote Issue
  -------------------------------------------------------
  */

  const handleUpvote = async () => {

    try {

      const issueRef = doc(db, "issues", issue.id);

      await updateDoc(issueRef, {
        upvotes: increment(1)
      });

    } catch (error) {

      console.error("Upvote error:", error);

    }

  };


  /*
  -------------------------------------------------------
  Mark Issue Resolved
  -------------------------------------------------------
  */

  const handleResolve = async () => {

    try {

      const issueRef = doc(db, "issues", issue.id);

      await updateDoc(issueRef, {
        status: "resolved"
      });

    } catch (error) {

      console.error("Resolve error:", error);

    }

  };


  return (

    <div className="bg-white shadow rounded-lg p-5 space-y-4">

      {/* =========================================
      Header
      ========================================= */}

      <div className="flex justify-between items-start">

        <div>

          <h3 className="text-lg font-semibold">
            {issue.title}
          </h3>

          <p className="text-sm text-gray-500">
            {issue.createdByName || "Student"}
          </p>

        </div>

        <span
          className={`text-xs px-3 py-1 rounded text-white ${getCategoryColor(issue.category)}`}
        >
          {issue.category || "General"}
        </span>

      </div>


      {/* =========================================
      Description
      ========================================= */}

      <p className="text-gray-700">
        {issue.description}
      </p>


      {/* =========================================
      Image Preview
      ========================================= */}

      {issue.images && issue.images.length > 0 && (

        <div className="flex gap-3 overflow-x-auto">

          {issue.images.map((img, index) => (

            <img
              key={index}
              src={img}
              alt="Issue"
              className="w-32 h-24 object-cover rounded"
            />

          ))}

        </div>

      )}


      {/* =========================================
      Metadata
      ========================================= */}

      <div className="flex flex-wrap gap-3 text-sm">

        <span
          className={`px-2 py-1 rounded ${getSeverityColor(issue.severity)}`}
        >
          Severity: {issue.severity || 1}
        </span>

        <span className="px-2 py-1 bg-gray-200 rounded">
          Upvotes: {issue.upvotes || 0}
        </span>

        {issue.priorityScore !== undefined && (
          <span className="px-2 py-1 bg-purple-200 rounded">
            Priority: {issue.priorityScore.toFixed(2)}
          </span>
        )}

        <span className="px-2 py-1 bg-gray-100 rounded">
          {formatTime(issue.createdAt)}
        </span>

      </div>


      {/* =========================================
      Actions
      ========================================= */}

      <div className="flex gap-3">

        <button
          onClick={handleUpvote}
          className="bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700"
        >
          Upvote
        </button>

        {issue.status !== "resolved" && (

          <button
            onClick={handleResolve}
            className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
          >
            Mark Resolved
          </button>

        )}

      </div>


      {/* =========================================
      Status
      ========================================= */}

      <div>

        <span
          className={`text-xs px-2 py-1 rounded ${
            issue.status === "resolved"
              ? "bg-green-200"
              : "bg-yellow-200"
          }`}
        >
          Status: {issue.status || "pending"}
        </span>

      </div>

    </div>

  );

};

export default IssueCard;

