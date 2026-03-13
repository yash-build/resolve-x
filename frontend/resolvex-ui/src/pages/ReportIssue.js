import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";

const ReportIssue = () => {

  const { currentUser } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Hostel");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await addDoc(collection(db, "issues"), {
        title,
        description,
        category,
        createdBy: currentUser.uid,
        createdByName: currentUser.displayName,
        assignedCommittee: category + " Committee",
        upvotes: 0,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      setTitle("");
      setDescription("");

      alert("Issue reported successfully!");

    } catch (error) {
      console.error("Error reporting issue:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">

      <h2 className="text-2xl font-bold mb-4">Report New Issue</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <input
          type="text"
          placeholder="Issue Title"
          className="border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

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
          className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          Submit Issue
        </button>

      </form>
    </div>
  );
};

export default ReportIssue;