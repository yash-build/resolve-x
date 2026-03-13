import React, { useState, useEffect } from "react";

import {
  collection,
  getDocs
} from "firebase/firestore";

import { db } from "../services/firebase";

import { createIssue } from "../services/issueService";

import { useAuth } from "../context/AuthContext";

import {
  detectDuplicate
} from "../utils/duplicateDetector";

const ReportIssue = () => {

  const { currentUser } = useAuth();

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [category, setCategory] = useState("Hostel");

  const [existingIssues, setExistingIssues] = useState([]);

  const [duplicateWarning, setDuplicateWarning] = useState(null);

  /*
  ==========================================================
  LOAD EXISTING ISSUES
  ==========================================================
  */

  useEffect(() => {

    async function fetchIssues() {

      const snapshot = await getDocs(
        collection(db, "issues")
      );

      const issues = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setExistingIssues(issues);

    }

    fetchIssues();

  }, []);

  /*
  ==========================================================
  HANDLE TITLE CHANGE
  ==========================================================
  */

  const handleTitleChange = (value) => {

    setTitle(value);

    const result = detectDuplicate(
      value,
      existingIssues
    );

    if (result.isDuplicate) {

      setDuplicateWarning(
        `Similar issue exists: "${result.similarIssue.title}"`
      );

    }

    else {

      setDuplicateWarning(null);

    }

  };

  /*
  ==========================================================
  SUBMIT ISSUE
  ==========================================================
  */

  const handleSubmit = async (e) => {

    e.preventDefault();

    await createIssue({

      title,
      description,
      category,
      createdBy: currentUser.uid,
      createdByName: currentUser.displayName

    });

    setTitle("");

    setDescription("");

    alert("Issue reported successfully");

  };

  return (

    <div className="max-w-xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">
        Report Issue
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        <input
          type="text"
          placeholder="Issue title"
          value={title}
          onChange={(e) =>
            handleTitleChange(e.target.value)
          }
          className="w-full border p-2 rounded"
          required
        />

        {duplicateWarning && (

          <div className="text-red-500 text-sm">
            {duplicateWarning}
          </div>

        )}

        <textarea
          placeholder="Describe the issue"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          className="w-full border p-2 rounded"
          rows="4"
          required
        />

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
          className="w-full border p-2 rounded"
        >

          <option value="Hostel">Hostel</option>
          <option value="Food">Food</option>
          <option value="Hygiene">Hygiene</option>
          <option value="Infrastructure">Infrastructure</option>
          <option value="Discipline">Discipline</option>

        </select>

        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >

          Submit Issue

        </button>

      </form>

    </div>

  );

};

export default ReportIssue;