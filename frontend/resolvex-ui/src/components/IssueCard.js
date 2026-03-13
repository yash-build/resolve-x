import React from "react";

import {
  upvoteIssue,
  resolveIssue
} from "../services/issueService";

const IssueCard = ({ issue }) => {

  const priorityColors = {

    low: "bg-gray-200",

    medium: "bg-yellow-300",

    high: "bg-orange-400",

    critical: "bg-red-500 text-white"

  };

  const statusColors = {

    pending: "bg-yellow-200",

    resolved: "bg-green-300"

  };

  const createdTime = issue.createdAt
    ? issue.createdAt.toDate().toLocaleString()
    : "Unknown time";

  return (

    <div className="bg-white p-6 rounded shadow">

      <div className="flex justify-between items-center">

        <h2 className="text-xl font-semibold">
          {issue.title}
        </h2>

        <span
          className={`px-2 py-1 rounded text-sm ${priorityColors[issue.priority]}`}
        >
          {issue.priority}
        </span>

      </div>

      <p className="text-gray-600 mt-2">
        {issue.description}
      </p>

      <div className="flex justify-between mt-4 text-sm">

        <span>
          Category: {issue.category}
        </span>

        <span
          className={`px-2 py-1 rounded ${statusColors[issue.status]}`}
        >
          {issue.status}
        </span>

      </div>

      <div className="text-xs text-gray-400 mt-2">
        Reported at: {createdTime}
      </div>

      <div className="flex justify-between mt-4">

        <button
          onClick={() => upvoteIssue(issue.id)}
          className="bg-indigo-600 text-white px-4 py-1 rounded"
        >
          Upvote
        </button>

        <span>
          👍 {issue.upvotes}
        </span>

      </div>

      {issue.status === "pending" && (

        <button
          onClick={() => resolveIssue(issue.id, issue)}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
        >
          Mark Resolved
        </button>

      )}

    </div>

  );

};

export default IssueCard;