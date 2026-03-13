import React, { useState } from "react";

import { createIssue } from "../services/issueService";

import { useAuth } from "../context/AuthContext";

const ReportIssue = () => {

  const { currentUser } = useAuth();

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [category, setCategory] = useState("Hostel");

  const [location, setLocation] = useState("Hostel Block A");

  const [submitting, setSubmitting] = useState(false);

  /*
  ================================================================
  HANDLE SUBMIT
  ================================================================
  */

  const handleSubmit = async (e) => {

    e.preventDefault();

    setSubmitting(true);

    await createIssue({

      title,
      description,
      category,
      location,

      createdBy: currentUser.uid,

      createdByName: currentUser.displayName

    });

    setTitle("");
    setDescription("");

    setSubmitting(false);

    alert("Issue reported successfully");

  };

  /*
  ================================================================
  UI
  ================================================================
  */

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
            setTitle(e.target.value)
          }
          className="w-full border p-2 rounded"
          required
        />

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

        <select
          value={location}
          onChange={(e) =>
            setLocation(e.target.value)
          }
          className="w-full border p-2 rounded"
        >

          <option>Hostel Block A</option>
          <option>Hostel Block B</option>
          <option>Mess Hall</option>
          <option>Library</option>
          <option>Main Campus</option>

        </select>

        <button
          type="submit"
          disabled={submitting}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >

          {submitting
            ? "Submitting..."
            : "Submit Issue"}

        </button>

      </form>

    </div>

  );

};

export default ReportIssue;