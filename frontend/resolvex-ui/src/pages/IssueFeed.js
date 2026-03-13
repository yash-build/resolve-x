import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";

import IssueCard from "../components/IssueCard";

const IssueFeed = () => {

  const [issues, setIssues] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {

    const q = query(
      collection(db, "issues"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {

      const issueList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setIssues(issueList);

    }, (error) => {

      console.error("Firestore error:", error);

    });

    return () => unsubscribe();

  }, []);

  const filteredIssues =
    selectedCategory === "All"
      ? issues
      : issues.filter((issue) => issue.category === selectedCategory);

  return (

    <div className="max-w-3xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">
        Issue Feed
      </h1>

      <div className="flex gap-2 mb-6 flex-wrap">

        {["All","Hostel","Food","Hygiene","Infrastructure","Discipline"].map((cat) => (

          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded ${
              selectedCategory === cat
                ? "bg-indigo-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {cat}
          </button>

        ))}

      </div>

      <div className="space-y-4">

        {filteredIssues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))}

      </div>

    </div>

  );

};

export default IssueFeed;