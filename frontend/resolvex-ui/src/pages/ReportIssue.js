import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../services/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import gptService from "../services/ai/gptService";
import { detectDuplicateIssues } from "../services/ai/duplicateDetection";
import { uploadIssueImages } from "../services/uploadService";

const ISSUE_CATEGORIES = [
"Hostel",
"Food",
"Hygiene",
"Infrastructure",
"Discipline"
];

function ReportIssue() {

const { user } = useAuth();

const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
const [category, setCategory] = useState("");
const [images, setImages] = useState([]);

const [loading, setLoading] = useState(false);
const [duplicateWarning, setDuplicateWarning] = useState("");
const [errorMessage, setErrorMessage] = useState("");

// IMAGE UPLOAD
const handleImageChange = (event) => {


const files = Array.from(event.target.files);

if (files.length > 2) {
  setErrorMessage("Maximum 2 images allowed.");
  return;
}

setImages(files);


};

// AI IMPROVE DESCRIPTION
const improveDescription = async () => {

if (!description) return;

try {

  const improved =
    await gptService.improveIssueReport(description);

  setDescription(improved);

} catch (error) {

  console.error("AI improve error:", error);

}


};

// AI CATEGORY SUGGESTION
const suggestCategory = async () => {

if (!description) return;

try {

  const suggestion =
    await gptService.suggestIssueCategory(description);

  if (ISSUE_CATEGORIES.includes(suggestion)) {
    setCategory(suggestion);
  }

} catch (error) {

  console.error("Category suggestion error:", error);

}


};

// DUPLICATE DETECTION
const checkDuplicate = async () => {


if (!description) return;

try {

  const duplicate =
    await detectDuplicateIssues(description);

  if (duplicate) {

    setDuplicateWarning(
      "A similar issue may already exist."
    );

  } else {

    setDuplicateWarning("");

  }

} catch (error) {

  console.error("Duplicate detection error:", error);

}


};

// SUBMIT ISSUE
const handleSubmit = async (event) => {


event.preventDefault();

if (!title || !description || !category) {

  setErrorMessage("Please fill all required fields.");
  return;

}

try {

  setLoading(true);

  const summary =
    await gptService.summarizeIssue(description);

  let imageUrls = [];

  if (images.length > 0) {

    imageUrls =
      await uploadIssueImages(images);

  }

  const issueData = {

    title,
    description,
    summary,

    category,
    assignedCommittee: category + " Committee",

    images: imageUrls,

    createdBy: user.uid,
    createdByName: user.displayName || "Student",

    status: "pending",
    upvotes: 0,

    createdAt: serverTimestamp()

  };

  await addDoc(collection(db, "issues"), issueData);

  setTitle("");
  setDescription("");
  setCategory("");
  setImages([]);
  setDuplicateWarning("");

} catch (error) {

  console.error("Issue submission error:", error);
  setErrorMessage("Failed to submit issue.");

} finally {

  setLoading(false);

}


};

return (


<div className="max-w-3xl mx-auto p-6">

  <h1 className="text-2xl font-bold mb-6">
    Report Campus Issue
  </h1>



  {errorMessage && (
    <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">
      {errorMessage}
    </div>
  )}



  {duplicateWarning && (
    <div className="bg-yellow-100 text-yellow-800 p-3 mb-4 rounded">
      {duplicateWarning}
    </div>
  )}



  <form onSubmit={handleSubmit} className="space-y-5">

    {/* TITLE */}
    <div>

      <label className="block font-medium mb-1">
        Issue Title
      </label>

      <input
        type="text"
        className="w-full border p-2 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

    </div>



    {/* DESCRIPTION */}
    <div>

      <label className="block font-medium mb-1">
        Description
      </label>

      <textarea
        rows="5"
        className="w-full border p-2 rounded"
        placeholder="Describe the campus issue..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onBlur={checkDuplicate}
      />

      <div className="flex gap-3 mt-3">

        <button
          type="button"
          onClick={improveDescription}
          className="bg-blue-500 text-white px-3 py-2 rounded"
        >
          Improve with AI
        </button>

        <button
          type="button"
          onClick={suggestCategory}
          className="bg-purple-500 text-white px-3 py-2 rounded"
        >
          Suggest Category
        </button>

      </div>

    </div>



    {/* CATEGORY */}
    <div>

      <label className="block font-medium mb-1">
        Category
      </label>

      <select
        className="w-full border p-2 rounded"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >

        <option value="">
          Select Category
        </option>

        {ISSUE_CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}

      </select>

    </div>



    {/* IMAGE UPLOAD */}
    <div>

      <label className="block font-medium mb-1">
        Upload Images
      </label>

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
      />

    </div>



    {/* SUBMIT */}
    <button
      type="submit"
      disabled={loading}
      className="bg-green-600 text-white px-5 py-2 rounded"
    >

      {loading ? "Submitting..." : "Submit Issue"}

    </button>



  </form>

</div>


);

}

export default ReportIssue;
