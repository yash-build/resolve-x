import React, { useEffect, useState } from "react";

import {
  collection,
  query,
  orderBy,
  onSnapshot
} from "firebase/firestore";

import { db } from "../services/firebase";

import IssueCard from "../components/IssueCard";

const priorityOrder = {
  critical: 1,
  high: 2,
  medium: 3,
  low: 4
};

const IssueFeed = () => {

  const [issues, setIssues] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {

    const issueQuery = query(
      collection(db, "issues"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(

      issueQuery,

      (snapshot) => {

        const fetched = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        /*
        LOCAL PRIORITY SORT
        */

        fetched.sort((a, b) => {

          return (
            priorityOrder[a.priority] -
            priorityOrder[b.priority]
          );

        });

        setIssues(fetched);

        setLoading(false);

      },

      (err) => {

        console.error(err);

        setError("Failed to load issues");

        setLoading(false);

      }

    );

    return () => unsubscribe();

  }, []);

  /*
  SEARCH + FILTER
  */

  const filteredIssues = issues.filter(issue => {

    const matchCategory =
      categoryFilter === "all" ||
      issue.category === categoryFilter;

    const matchSearch =
      issue.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      issue.description
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    return matchCategory && matchSearch;

  });

  if (loading) {

    return (
      <div className="text-center">
        Loading issues...
      </div>
    );

  }

  if (error) {

    return (
      <div className="text-center text-red-500">
        {error}
      </div>
    );

  }

  return (

    <div className="max-w-5xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">
        Issue Feed
      </h1>

      <div className="flex gap-4 mb-6">

        <input
          type="text"
          placeholder="Search issues"
          className="border p-2 rounded"
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />

        <select
          className="border p-2 rounded"
          value={categoryFilter}
          onChange={(e) =>
            setCategoryFilter(e.target.value)
          }
        >

          <option value="all">
            All Categories
          </option>

          <option value="Hostel">
            Hostel
          </option>

          <option value="Food">
            Food
          </option>

          <option value="Hygiene">
            Hygiene
          </option>

          <option value="Infrastructure">
            Infrastructure
          </option>

          <option value="Discipline">
            Discipline
          </option>

        </select>

      </div>

      <div className="space-y-4">

        {filteredIssues.map(issue => (

          <IssueCard
            key={issue.id}
            issue={issue}
          />

        ))}

      </div>

    </div>

  );

};

export default IssueFeed;