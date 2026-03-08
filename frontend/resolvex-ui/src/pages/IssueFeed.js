import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import IssueCard from "../components/IssueCard";

function IssueFeed() {

  const [issues, setIssues] = useState([]);

  useEffect(() => {

    const q = query(
      collection(db, "issues"),
      orderBy("upvotes", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {

      const issueList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setIssues(issueList);

    });

    return () => unsubscribe();

  }, []);

  return (

    <div style={{ padding: "20px" }}>

      <h2>Issue Feed</h2>

      {issues.length === 0 ? (
        <p>No issues reported yet.</p>
      ) : (
        issues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))
      )}

    </div>

  );

}

export default IssueFeed;