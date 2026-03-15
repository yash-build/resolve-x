import React from "react";
import { useNavigate } from "react-router-dom";

/*
=========================================
DUPLICATE ISSUE WARNING COMPONENT
=========================================

Shows a warning when a similar issue exists.

Allows user to:

• view existing issue
• upvote existing issue
*/

const DuplicateWarning = ({ duplicates, onUpvote }) => {

  const navigate = useNavigate();

  if (!duplicates || duplicates.length === 0) return null;

  return (

    <div className="bg-yellow-100 border border-yellow-400 p-4 rounded-lg mt-4">

      <h3 className="font-bold text-yellow-800 mb-2">
        ⚠ Similar Issues Already Reported
      </h3>

      <p className="text-sm text-yellow-700 mb-3">
        You may want to upvote an existing issue instead of creating a new one.
      </p>

      <div className="space-y-3">

        {duplicates.map(issue => (

          <div
            key={issue.id}
            className="bg-white p-3 rounded shadow-sm"
          >

            <h4 className="font-semibold">
              {issue.title}
            </h4>

            <p className="text-sm text-gray-600">
              {issue.description}
            </p>

            <div className="flex gap-2 mt-2">

              <button
                onClick={() => navigate(`/issue/${issue.id}`)}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
              >
                View Issue
              </button>

              <button
                onClick={() => onUpvote(issue.id)}
                className="bg-green-500 text-white px-3 py-1 rounded text-sm"
              >
                Upvote Instead
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

};

export default DuplicateWarning;