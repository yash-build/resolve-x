import React from "react";
import { db } from "../services/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { upvoteIssue } from "../services/issueService";

const IssueCard = ({ issue }) => {

  const handleUpvote = () => {
    upvoteIssue(issue.id);
  };

  const resolveIssue = async () => {

    const issueRef = doc(db, "issues", issue.id);

    await updateDoc(issueRef, {
      status: "resolved"
    });

  };

  return (

    <div className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition">

      <h3 className="text-lg font-semibold">
        {issue.title}
      </h3>

      <p className="text-gray-600 mt-2">
        {issue.description}
      </p>

      <div className="flex flex-wrap gap-2 mt-4">

        <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
          {issue.category}
        </span>

        <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
          {issue.assignedCommittee}
        </span>

        <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">
          {issue.status}
        </span>

      </div>

      <p className="text-xs text-gray-500 mt-2">
        Reported by {issue.createdByName}
      </p>

      <div className="flex gap-3 mt-4">

        <button
          onClick={handleUpvote}
          className="bg-indigo-600 text-white px-3 py-2 rounded text-sm"
        >
          Upvote ({issue.upvotes})
        </button>

        {issue.status !== "resolved" && (

          <button
            onClick={resolveIssue}
            className="bg-green-600 text-white px-3 py-2 rounded text-sm"
          >
            Resolve
          </button>

        )}

      </div>

    </div>

  );

};

export default IssueCard;