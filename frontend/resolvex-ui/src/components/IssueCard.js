import React from "react";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../services/firebase";

const IssueCard = ({ issue }) => {

  const handleUpvote = async () => {
    const ref = doc(db, "issues", issue.id);

    await updateDoc(ref, {
      upvotes: increment(1)
    });
  };

  return (

    <div className="bg-white p-5 rounded shadow">

      <h2 className="text-xl font-semibold">
        {issue.title}
      </h2>

      <p className="text-gray-600 mt-2">
        {issue.description}
      </p>

      <div className="flex justify-between items-center mt-4">

        <span className="text-sm text-gray-500">
          Category: {issue.category}
        </span>

        <span className="text-sm text-gray-500">
          Status: {issue.status}
        </span>

      </div>

      <div className="flex justify-between items-center mt-4">

        <button
          onClick={handleUpvote}
          className="bg-indigo-600 text-white px-4 py-1 rounded"
        >
          Upvote
        </button>

        <span>
          👍 {issue.upvotes}
        </span>

      </div>

    </div>
  );
};

export default IssueCard;