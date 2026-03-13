import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";

import { db } from "../services/firebase";
import IssueCard from "../components/IssueCard";

const IssueFeed = () => {

  const [issues, setIssues] = useState([]);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {

    let q;

    if (sortBy === "newest") {
      q = query(collection(db, "issues"), orderBy("createdAt", "desc"));
    }

    if (sortBy === "oldest") {
      q = query(collection(db, "issues"), orderBy("createdAt", "asc"));
    }

    if (sortBy === "mostUpvoted") {
      q = query(collection(db, "issues"), orderBy("upvotes", "desc"));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {

      const issueList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setIssues(issueList);
    });

    return () => unsubscribe();

  }, [sortBy]);

  return (

    <div>

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-bold">
          Issue Feed
        </h1>

        <select
          className="border p-2 rounded"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="mostUpvoted">Most Upvoted</option>
        </select>

      </div>

      <div className="space-y-4">

        {issues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))}

      </div>

    </div>

  );
};

export default IssueFeed;