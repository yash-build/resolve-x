/*
==========================================================
ResolveX — Advanced Issue Reporting Page
==========================================================

Features

• AI Issue Classification
• Image Upload (max 2 images)
• Image Preview
• Firebase Storage Upload
• Firestore Issue Creation
• Category Suggestion with Override
• AI Prediction Panel
• Form Validation
• Upload Progress Handling
• Success + Error Messages
• Clean Production Architecture

==========================================================
*/

import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { classifyIssue } from "../services/ai/classifier/issueClassifier";
import { uploadIssueImages } from "../services/uploadService";
import { createIssue } from "../services/issueService";

import ImageUploader from "../components/ImageUploader";
import AIPredictionPanel from "../components/AIPredictionPanel";



/* ======================================================
CATEGORY OPTIONS
====================================================== */

const CATEGORY_OPTIONS = [
  "Hostel",
  "Food",
  "Hygiene",
  "Infrastructure",
  "Discipline"
];



/* ======================================================
INITIAL FORM STATE
====================================================== */

const INITIAL_FORM = {

  title: "",
  description: "",
  category: ""

};



/* ======================================================
MAIN COMPONENT
====================================================== */

function ReportIssue() {

  const { user } = useAuth();

  const [searchParams] = useSearchParams();



  /* ==================================================
STATE MANAGEMENT
================================================== */

  const [form, setForm] = useState(INITIAL_FORM);

  const [prediction, setPrediction] = useState(null);

  const [images, setImages] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [submitError, setSubmitError] = useState(null);

  const [errors, setErrors] = useState({});



  /* ==================================================
PREFILL FROM CHATBOT
================================================== */

  useEffect(() => {

    const title = searchParams.get("title");
    const category = searchParams.get("category");

    if (title) {
      setForm((prev) => ({
        ...prev,
        title
      }));
    }

    if (category) {
      setForm((prev) => ({
        ...prev,
        category
      }));
    }

  }, [searchParams]);



  /* ==================================================
HANDLE FORM INPUT CHANGE
================================================== */

  function handleChange(e) {

    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

  }



  /* ==================================================
AI ANALYSIS WHILE TYPING
================================================== */

  function handleDescriptionChange(e) {

    const value = e.target.value;

    setForm((prev) => ({
      ...prev,
      description: value
    }));


    if (value.length > 10) {

      const result = classifyIssue(value);

      setPrediction(result);


      if (!form.category && result.category !== "Unknown") {

        setForm((prev) => ({
          ...prev,
          category: result.category
        }));

      }

    }

  }



  /* ==================================================
IMAGE HANDLER
================================================== */

  function handleImagesSelected(files) {

    setImages(files);

  }



  /* ==================================================
FORM VALIDATION
================================================== */

  function validateForm() {

    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "Issue title is required";
    }

    if (!form.description.trim()) {
      newErrors.description = "Issue description is required";
    }

    if (!form.category) {
      newErrors.category = "Please select a category";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;

  }



  /* ==================================================
SUBMIT ISSUE
================================================== */

  async function handleSubmit(e) {

    e.preventDefault();

    setSubmitError(null);
    setSubmitSuccess(false);

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {

      let imageUrls = [];

      /* -----------------------------------------
UPLOAD IMAGES
------------------------------------------ */

      if (images.length > 0) {

        imageUrls = await uploadIssueImages(images, user.uid);

      }



      /* -----------------------------------------
PREPARE ISSUE DATA
------------------------------------------ */

      const issueData = {

        title: form.title,

        description: form.description,

        category: form.category,

        assignedCommittee: prediction?.committee || "Unassigned",

        severity: prediction?.severity || "Low",

        aiConfidence: prediction?.confidence || 0,

        images: imageUrls,

        createdBy: user.uid,

        createdByName: user.displayName,

        upvotes: 0,

        status: "pending",

        createdAt: new Date()

      };



      /* -----------------------------------------
SAVE TO FIRESTORE
------------------------------------------ */

      await createIssue(issueData);



      /* -----------------------------------------
RESET FORM
------------------------------------------ */

      setSubmitSuccess(true);

      setForm(INITIAL_FORM);

      setImages([]);

      setPrediction(null);

    } catch (error) {

      console.error("Issue submission error:", error);

      setSubmitError("Failed to submit issue. Please try again.");

    }

    setIsSubmitting(false);

  }



  /* ==================================================
SEVERITY BADGE UI
================================================== */

  function renderSeverityBadge(level) {

    const styles = {

      High: "bg-red-500 text-white",

      Medium: "bg-yellow-500 text-white",

      Low: "bg-green-500 text-white"

    };

    return (

      <span className={`px-2 py-1 rounded text-xs ${styles[level]}`}>
        {level}
      </span>

    );

  }



  /* ==================================================
UI RENDER
================================================== */

  return (

    <div className="max-w-3xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Report Campus Issue
      </h1>



      {/* SUCCESS MESSAGE */}

      {submitSuccess && (

        <div className="bg-green-100 border border-green-300 text-green-800 p-4 rounded mb-6">

          Issue submitted successfully 🎉

        </div>

      )}



      {/* ERROR MESSAGE */}

      {submitError && (

        <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded mb-6">

          {submitError}

        </div>

      )}



      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 space-y-6"
      >



        {/* TITLE */}

        <div>

          <label className="block font-medium mb-1">
            Issue Title
          </label>

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border rounded p-2"
            placeholder="Short summary of the issue"
          />

          {errors.title && (
            <p className="text-red-500 text-sm">
              {errors.title}
            </p>
          )}

        </div>



        {/* DESCRIPTION */}

        <div>

          <label className="block font-medium mb-1">
            Issue Description
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleDescriptionChange}
            rows="5"
            className="w-full border rounded p-2"
            placeholder="Describe the issue in detail"
          />

          {errors.description && (
            <p className="text-red-500 text-sm">
              {errors.description}
            </p>
          )}

        </div>



        {/* CATEGORY */}

        <div>

          <label className="block font-medium mb-1">
            Category
          </label>

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >

            <option value="">Select category</option>

            {CATEGORY_OPTIONS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}

          </select>

          {errors.category && (
            <p className="text-red-500 text-sm">
              {errors.category}
            </p>
          )}

        </div>



        {/* AI PREDICTION PANEL */}

        {prediction && (

          <div className="space-y-3">

            <AIPredictionPanel prediction={prediction} />

            <div className="bg-gray-50 border p-3 rounded">

              <div className="text-sm">

                <strong>Severity:</strong>{" "}
                {renderSeverityBadge(prediction.severity)}

              </div>

              <div className="text-sm mt-2">

                <strong>Confidence:</strong>{" "}
                {(prediction.confidence * 100).toFixed(0)}%

              </div>

              <div className="text-sm mt-2">

                <strong>Committee Routing:</strong>{" "}
                {prediction.committee}

              </div>

            </div>

          </div>

        )}



        {/* IMAGE UPLOAD */}

        <ImageUploader onImagesSelected={handleImagesSelected} />



        {/* SUBMIT BUTTON */}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
        >

          {isSubmitting ? "Submitting..." : "Submit Issue"}

        </button>

      </form>

    </div>

  );

}



export default ReportIssue;