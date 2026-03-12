import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
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

    });

    return () => unsubscribe();

  }, []);

  const filteredIssues =
    selectedCategory === "All"
      ? issues
      : issues.filter((issue) => issue.category === selectedCategory);

  return (

    <div className="max-w-3xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">
        Campus Issues
      </h1>

      <div className="flex flex-wrap gap-2 mb-6">

        {["All","Hostel","Food","Hygiene","Infrastructure","Discipline"].map((cat) => (

          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-sm ${
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

        {filteredIssues.length === 0 ? (
          <p className="text-gray-500">No issues found.</p>
        ) : (
          filteredIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))
        )}

      </div>

    </div>

  );

};

export default IssueFeed;