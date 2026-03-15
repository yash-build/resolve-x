import React, { useEffect, useState } from "react";

import { db } from "../services/firebase";

import {
  collection,
  getDocs
} from "firebase/firestore";

import { Link } from "react-router-dom";

import AnnouncementFeed from "../components/AnnouncementFeed";

/*
============================================================
RESOLVEX STUDENT DASHBOARD
============================================================

Purpose
-------

This is the main landing page for student users.

Students can:

• View campus announcements
• Report new issues
• Browse issue feed
• Track their submitted issues
• Check leaderboard
• View campus statistics

Architecture
------------

Firestore
    ↓
Issue Statistics
    ↓
Student Dashboard UI

Future Features Prepared:

• AI Issue Suggestions
• GPT Chat Assistant
• Smart Issue Prioritization
• Personalized Notifications
*/

const StudentDashboard = () => {

  /*
  ============================================================
  STATE MANAGEMENT
  ============================================================
  */

  const [issues, setIssues] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /*
  ============================================================
  FETCH ISSUES FROM FIRESTORE
  ============================================================
  */

  useEffect(() => {

    const fetchIssues = async () => {

      try {

        setLoading(true);

        const snapshot = await getDocs(
          collection(db, "issues")
        );

        const issuesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        setIssues(issuesData);

      } catch (err) {

        console.error("Student dashboard error:", err);

        setError("Failed to load campus issues.");

      } finally {

        setLoading(false);

      }

    };

    fetchIssues();

  }, []);

  /*
  ============================================================
  DASHBOARD METRICS
  ============================================================
  */

  const totalIssues = issues.length;

  const pendingIssues = issues.filter(
    (issue) => issue.status === "pending"
  ).length;

  const resolvedIssues = issues.filter(
    (issue) => issue.status === "resolved"
  ).length;

  const hostelIssues = issues.filter(
    (issue) => issue.category === "Hostel"
  ).length;

  const foodIssues = issues.filter(
    (issue) => issue.category === "Food"
  ).length;

  const infrastructureIssues = issues.filter(
    (issue) => issue.category === "Infrastructure"
  ).length;

  /*
  ============================================================
  LOADING STATE
  ============================================================
  */

  if (loading) {

    return (

      <div className="p-8">

        <h1 className="text-2xl font-bold">

          Loading Student Dashboard...

        </h1>

      </div>

    );

  }

  /*
  ============================================================
  ERROR STATE
  ============================================================
  */

  if (error) {

    return (

      <div className="p-8">

        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded">

          {error}

        </div>

      </div>

    );

  }

  /*
  ============================================================
  STUDENT DASHBOARD UI
  ============================================================
  */

  return (

    <div className="p-8 space-y-10">

      {/* PAGE HEADER */}

      <h1 className="text-3xl font-bold">

        ResolveX Student Dashboard

      </h1>

      {/* =====================================================
          QUICK ACTIONS
      ===================================================== */}

      <div>

        <h2 className="text-2xl font-semibold mb-4">

          Quick Actions

        </h2>

        <div className="grid grid-cols-3 gap-6">

          <Link
            to="/report-issue"
            className="bg-blue-600 text-white p-4 rounded shadow text-center hover:bg-blue-700"
          >

            Report New Issue

          </Link>

          <Link
            to="/issues"
            className="bg-green-600 text-white p-4 rounded shadow text-center hover:bg-green-700"
          >

            View Issue Feed

          </Link>

          <Link
            to="/my-issues"
            className="bg-purple-600 text-white p-4 rounded shadow text-center hover:bg-purple-700"
          >

            My Reported Issues

          </Link>

          <Link
            to="/leaderboard"
            className="bg-orange-600 text-white p-4 rounded shadow text-center hover:bg-orange-700"
          >

            Leaderboard

          </Link>

          <Link
            to="/notifications"
            className="bg-gray-700 text-white p-4 rounded shadow text-center hover:bg-gray-800"
          >

            Notifications

          </Link>

        </div>

      </div>

      {/* =====================================================
          CAMPUS ANNOUNCEMENTS
      ===================================================== */}

      <div>

        <AnnouncementFeed />

      </div>

      {/* =====================================================
          CAMPUS ISSUE STATISTICS
      ===================================================== */}

      <div>

        <h2 className="text-2xl font-semibold mb-4">

          Campus Issue Statistics

        </h2>

        <div className="grid grid-cols-4 gap-6">

          <div className="bg-white shadow p-4 rounded">

            <h3 className="font-semibold">
              Total Issues
            </h3>

            <p className="text-2xl">
              {totalIssues}
            </p>

          </div>

          <div className="bg-white shadow p-4 rounded">

            <h3 className="font-semibold">
              Pending Issues
            </h3>

            <p className="text-2xl">
              {pendingIssues}
            </p>

          </div>

          <div className="bg-white shadow p-4 rounded">

            <h3 className="font-semibold">
              Resolved Issues
            </h3>

            <p className="text-2xl">
              {resolvedIssues}
            </p>

          </div>

        </div>

      </div>

      {/* =====================================================
          ISSUE CATEGORY OVERVIEW
      ===================================================== */}

      <div>

        <h2 className="text-2xl font-semibold mb-4">

          Issue Category Overview

        </h2>

        <div className="grid grid-cols-3 gap-6">

          <div className="bg-gray-100 p-4 rounded shadow">

            <h3 className="font-semibold">

              Hostel Issues

            </h3>

            <p className="text-2xl">

              {hostelIssues}

            </p>

          </div>

          <div className="bg-gray-100 p-4 rounded shadow">

            <h3 className="font-semibold">

              Food Issues

            </h3>

            <p className="text-2xl">

              {foodIssues}

            </p>

          </div>

          <div className="bg-gray-100 p-4 rounded shadow">

            <h3 className="font-semibold">

              Infrastructure Issues

            </h3>

            <p className="text-2xl">

              {infrastructureIssues}

            </p>

          </div>

        </div>

      </div>

      {/* =====================================================
          SYSTEM INFORMATION
      ===================================================== */}

      <div className="text-sm text-gray-500">

        <p>Total Issues Loaded: {issues.length}</p>

        <p>
          ResolveX Campus Governance Platform
        </p>

      </div>

    </div>

  );

};

export default StudentDashboard;