import React from "react";
import { db } from "../services/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";

function IssueCard({ issue }) {

  const handleUpvote = async () => {

    try {

      const issueRef = doc(db, "issues", issue.id);

      await updateDoc(issueRef, {
        upvotes: increment(1)
      });

    } catch (error) {
      console.error("Upvote failed:", error);
    }

  };

  const markResolved = async () => {

    try {

      const issueRef = doc(db, "issues", issue.id);

      await updateDoc(issueRef, {
        status: "resolved"
      });

    } catch (error) {
      console.error("Resolve failed:", error);
    }

  };

  return (

    <div style={{
      border: "1px solid #ccc",
      padding: "15px",
      marginBottom: "10px",
      borderRadius: "5px"
    }}>

      <h3>{issue.title}</h3>

      <p>{issue.description}</p>

      <p><b>Category:</b> {issue.category}</p>

      <p><b>Upvotes:</b> {issue.upvotes}</p>

      <p><b>Status:</b> {issue.status}</p>

      <button onClick={handleUpvote}>
        👍 Upvote
      </button>

      <button
        onClick={markResolved}
        style={{ marginLeft: "10px" }}
      >
        ✅ Mark Resolved
      </button>

    </div>

  );

}

export default IssueCard;