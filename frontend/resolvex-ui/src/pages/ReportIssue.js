import React, { useState, useContext } from "react";
import { createIssue } from "../services/issueService";
import { AuthContext } from "../context/AuthContext";

function ReportIssue() {

  const { currentUser } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!currentUser) {
      alert("Please login first");
      return;
    }

    setLoading(true);

    try {

      await createIssue({
        title,
        description,
        category,
        createdBy: currentUser.uid
      });

      alert("Issue reported successfully!");

      setTitle("");
      setDescription("");
      setCategory("");

    } catch (error) {

      alert("Failed to submit issue");

    }

    setLoading(false);

  };

  return (

    <div style={{ padding: "20px" }}>

      <h2>Report Issue</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Issue Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <br /><br />

        <textarea
          placeholder="Describe issue"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <br /><br />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >

          <option value="">Select Category</option>
          <option value="Hostel">Hostel</option>
          <option value="Food">Food</option>
          <option value="Hygiene">Hygiene</option>
          <option value="Infrastructure">Infrastructure</option>
          <option value="Discipline">Discipline</option>

        </select>

        <br /><br />

        <button type="submit">

          {loading ? "Submitting..." : "Submit Issue"}

        </button>

      </form>

    </div>

  );

}

export default ReportIssue;