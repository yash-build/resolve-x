import React, { useEffect, useState } from "react";

import { db } from "../services/firebase";

import {
  collection,
  getDocs
} from "firebase/firestore";

import HeatmapPanel from "../components/HeatmapPanel";
import AnnouncementForm from "../components/AnnouncementForm";

import {
  calculateCommitteeAnalytics,
  calculateCategoryDistribution
} from "../services/analyticsEngine";

import { calculateLocationHeatmap } from "../services/locationHeatmapEngine";

/*
============================================================
RESOLVEX ADMIN DASHBOARD
============================================================

Purpose
-------

The Admin Dashboard provides a centralized control panel
for monitoring campus operational issues.

Admins can observe:

• Total issue activity
• Committee performance
• Issue category distribution
• Campus problem hotspots
• Post campus announcements

Architecture
------------

Firestore Issues
        ↓
Analytics Engine
        ↓
Dashboard Metrics
        ↓
Admin Interface

Future upgrades:

• AI predictive alerts
• smart issue prioritization
• automated escalation
• GPT analytics assistant
*/

const AdminDashboard = () => {

  /*
  ============================================================
  STATE MANAGEMENT
  ============================================================
  */

  const [issues, setIssues] = useState([]);

  const [committeeAnalytics, setCommitteeAnalytics] =
    useState([]);

  const [categoryDistribution, setCategoryDistribution] =
    useState({});

  const [heatmapData, setHeatmapData] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

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

        /*
        ===============================================
        CALCULATE COMMITTEE ANALYTICS
        ===============================================
        */

        const committeeStats =
          calculateCommitteeAnalytics(issuesData);

        setCommitteeAnalytics(committeeStats);

        /*
        ===============================================
        CALCULATE CATEGORY DISTRIBUTION
        ===============================================
        */

        const categoryStats =
          calculateCategoryDistribution(issuesData);

        setCategoryDistribution(categoryStats);

        /*
        ===============================================
        CALCULATE CAMPUS HEATMAP DATA
        ===============================================
        */

        const heatmapStats =
          calculateLocationHeatmap(issuesData);

        setHeatmapData(heatmapStats);

      } catch (err) {

        console.error("Admin dashboard error:", err);

        setError(
          "Failed to load dashboard analytics."
        );

      } finally {

        setLoading(false);

      }

    };

    fetchIssues();

  }, []);

  /*
  ============================================================
  SYSTEM OVERVIEW METRICS
  ============================================================
  */

  const totalIssues =
    issues.length;

  const resolvedIssues =
    issues.filter(
      (issue) => issue.status === "resolved"
    ).length;

  const pendingIssues =
    issues.filter(
      (issue) => issue.status === "pending"
    ).length;

  const resolutionRate =
    totalIssues === 0
      ? 0
      : (
          (resolvedIssues / totalIssues) * 100
        ).toFixed(1);

  /*
  ============================================================
  LOADING STATE
  ============================================================
  */

  if (loading) {

    return (

      <div className="p-8">

        <h1 className="text-2xl font-bold">

          Loading ResolveX Admin Dashboard...

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
  DASHBOARD USER INTERFACE
  ============================================================
  */

  return (

    <div className="p-8 space-y-10">

      {/* PAGE HEADER */}

      <h1 className="text-3xl font-bold">

        ResolveX Admin Dashboard

      </h1>

      {/* =====================================================
          SYSTEM OVERVIEW
      ===================================================== */}

      <div>

        <h2 className="text-2xl font-semibold mb-4">

          System Overview

        </h2>

        <div className="grid grid-cols-4 gap-6">

          <div className="bg-white shadow p-4 rounded">

            <h3 className="text-lg font-semibold">
              Total Issues
            </h3>

            <p className="text-3xl">
              {totalIssues}
            </p>

          </div>

          <div className="bg-white shadow p-4 rounded">

            <h3 className="text-lg font-semibold">
              Pending Issues
            </h3>

            <p className="text-3xl">
              {pendingIssues}
            </p>

          </div>

          <div className="bg-white shadow p-4 rounded">

            <h3 className="text-lg font-semibold">
              Resolved Issues
            </h3>

            <p className="text-3xl">
              {resolvedIssues}
            </p>

          </div>

          <div className="bg-white shadow p-4 rounded">

            <h3 className="text-lg font-semibold">
              Resolution Rate
            </h3>

            <p className="text-3xl">
              {resolutionRate}%
            </p>

          </div>

        </div>

      </div>

      {/* =====================================================
          ANNOUNCEMENT SYSTEM
      ===================================================== */}

      <div>

        <AnnouncementForm />

      </div>

      {/* =====================================================
          COMMITTEE PERFORMANCE ANALYTICS
      ===================================================== */}

      <div>

        <h2 className="text-2xl font-semibold mb-4">

          Committee Performance

        </h2>

        <table className="w-full border bg-white">

          <thead>

            <tr className="bg-gray-200">

              <th className="p-3 border">
                Committee
              </th>

              <th className="p-3 border">
                Total Issues
              </th>

              <th className="p-3 border">
                Resolved
              </th>

              <th className="p-3 border">
                Avg Resolution Time (days)
              </th>

              <th className="p-3 border">
                Efficiency Score
              </th>

            </tr>

          </thead>

          <tbody>

            {committeeAnalytics.map((item) => (

              <tr key={item.committee}>

                <td className="border p-2">
                  {item.committee}
                </td>

                <td className="border p-2">
                  {item.totalIssues}
                </td>

                <td className="border p-2">
                  {item.resolvedIssues}
                </td>

                <td className="border p-2">
                  {item.avgResolutionTime}
                </td>

                <td className="border p-2">
                  {item.efficiencyScore}%
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* =====================================================
          ISSUE CATEGORY DISTRIBUTION
      ===================================================== */}

      <div>

        <h2 className="text-2xl font-semibold mb-4">

          Issue Category Distribution

        </h2>

        <div className="grid grid-cols-4 gap-6">

          {Object.entries(categoryDistribution).map(
            ([category, count]) => (

              <div
                key={category}
                className="bg-gray-100 p-4 rounded shadow"
              >

                <h3 className="font-semibold text-lg">

                  {category}

                </h3>

                <p className="text-2xl">

                  {count}

                </p>

                <p className="text-sm text-gray-600">

                  issues reported

                </p>

              </div>

            )
          )}

        </div>

      </div>

      {/* =====================================================
          CAMPUS ISSUE HEATMAP
      ===================================================== */}

      <div>

        <HeatmapPanel heatmapData={heatmapData} />

      </div>

      {/* =====================================================
          DEBUG PANEL
      ===================================================== */}

      <div className="text-sm text-gray-500">

        <p>
          Issues Loaded: {issues.length}
        </p>

        <p>
          Committees Tracked: {committeeAnalytics.length}
        </p>

        <p>
          Heatmap Locations: {heatmapData.length}
        </p>

      </div>

    </div>

  );

};

export default AdminDashboard;