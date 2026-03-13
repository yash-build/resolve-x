import React, { useState } from "react";

import { useAuth } from "../context/AuthContext";

import { createIssue, fetchAllIssues } from "../services/issueService";

import { detectPriority } from "../utils/priorityDetector";

import { findSimilarIssues } from "../utils/duplicateDetector";

const ReportIssue = () => {

  const { currentUser } = useAuth();

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [category, setCategory] = useState("Hostel");

  const [similarIssues, setSimilarIssues] = useState([]);

  const [loading, setLoading] = useState(false);

  /*
  ------------------------------------------------
  Check for duplicate issues
  ------------------------------------------------
  */

  const checkDuplicates = async () => {

    if (!title) return;

    const issues = await fetchAllIssues();

    const matches = findSimilarIssues(title, issues);

    setSimilarIssues(matches);
  };

  /*
  ------------------------------------------------
  Submit Issue
  ------------------------------------------------
  */

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const priority = detectPriority(title, description);

      const issueData = {

        title,

        description,

        category,

        priority,

        createdBy: currentUser.uid,

        createdByName: currentUser.displayName,

        assignedCommittee: category + " Committee"

      };

      await createIssue(issueData);

      alert("Issue reported successfully!");

      setTitle("");
      setDescription("");
      setSimilarIssues([]);

    } catch (error) {

      console.error("Issue creation error:", error);

      alert("Failed to report issue");

    }

    setLoading(false);
  };

  return (

    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">

      <h2 className="text-2xl font-bold mb-4">
        Report New Issue
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <input
          type="text"
          placeholder="Issue Title"
          className="border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={checkDuplicates}
          required
        />

        {similarIssues.length > 0 && (

          <div className="bg-yellow-100 p-3 rounded">

            <p className="font-semibold mb-1">
              Similar issues already exist:
            </p>

            {similarIssues.map((issue) => (
              <p key={issue.id} className="text-sm">
                • {issue.title}
              </p>
            ))}

          </div>

        )}

        <textarea
          placeholder="Describe the issue"
          className="border p-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <select
          className="border p-2 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >

          <option>Hostel</option>
          <option>Food</option>
          <option>Hygiene</option>
          <option>Infrastructure</option>
          <option>Discipline</option>

        </select>

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          {loading ? "Submitting..." : "Submit Issue"}
        </button>

      </form>

    </div>

  );

};

export default ReportIssue;