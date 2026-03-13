/*
=====================================================================
ResolveX Admin Analytics Dashboard
=====================================================================

This dashboard provides administrators with deep insight into
campus operations.

Analytics Included:

1. Total issues
2. Pending issues
3. Resolved issues
4. Issue category chart
5. Campus location heatmap
6. Committee performance
7. Issue distribution insights

=====================================================================
*/

import React, { useEffect, useState } from "react";

import {
  collection,
  getDocs
} from "firebase/firestore";

import { db } from "../services/firebase";

import {
  Bar
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {

  /*
  ===============================================================
  STATE VARIABLES
  ===============================================================
  */

  const [stats, setStats] = useState({

    total: 0,
    pending: 0,
    resolved: 0

  });

  const [categoryStats, setCategoryStats] = useState({});

  const [locationStats, setLocationStats] = useState([]);

  const [loading, setLoading] = useState(true);

  /*
  ===============================================================
  LOAD DATA FROM FIRESTORE
  ===============================================================
  */

  useEffect(() => {

    async function loadAnalytics() {

      const snapshot = await getDocs(
        collection(db, "issues")
      );

      const issues = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      /*
      ------------------------------------------------------------
      BASIC STATISTICS
      ------------------------------------------------------------
      */

      const total = issues.length;

      const pending = issues.filter(
        issue => issue.status === "pending"
      ).length;

      const resolved = issues.filter(
        issue => issue.status === "resolved"
      ).length;

      setStats({
        total,
        pending,
        resolved
      });

      /*
      ------------------------------------------------------------
      CATEGORY ANALYTICS
      ------------------------------------------------------------
      */

      const categoryMap = {};

      issues.forEach(issue => {

        const category = issue.category || "Unknown";

        if (!categoryMap[category]) {

          categoryMap[category] = 0;

        }

        categoryMap[category]++;

      });

      setCategoryStats(categoryMap);

      /*
      ------------------------------------------------------------
      LOCATION HEATMAP DATA
      ------------------------------------------------------------
      */

      const locationMap = {};

      issues.forEach(issue => {

        const location = issue.location || "Unknown";

        if (!locationMap[location]) {

          locationMap[location] = 0;

        }

        locationMap[location]++;

      });

      const locationData = Object.entries(locationMap)
        .sort((a,b)=>b[1]-a[1])
        .map(([location,count])=>({
          location,
          count
        }));

      setLocationStats(locationData);

      setLoading(false);

    }

    loadAnalytics();

  }, []);

  /*
  ===============================================================
  LOADING STATE
  ===============================================================
  */

  if (loading) {

    return (
      <div className="text-center mt-10">
        Loading analytics...
      </div>
    );

  }

  /*
  ===============================================================
  CHART DATA
  ===============================================================
  */

  const chartData = {

    labels: Object.keys(categoryStats),

    datasets: [

      {
        label: "Issues by Category",

        data: Object.values(categoryStats),

        backgroundColor: "rgba(99,102,241,0.6)"

      }

    ]

  };

  /*
  ===============================================================
  UI RENDER
  ===============================================================
  */

  return (

    <div className="max-w-6xl mx-auto">

      <h1 className="text-3xl font-bold mb-8">

        Admin Analytics Dashboard

      </h1>

      {/* STATISTICS CARDS */}

      <div className="grid grid-cols-3 gap-6 mb-10">

        <div className="bg-white p-6 rounded shadow text-center">
          <h2>Total Issues</h2>
          <p className="text-3xl font-bold">
            {stats.total}
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow text-center">
          <h2>Pending</h2>
          <p className="text-3xl text-yellow-600 font-bold">
            {stats.pending}
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow text-center">
          <h2>Resolved</h2>
          <p className="text-3xl text-green-600 font-bold">
            {stats.resolved}
          </p>
        </div>

      </div>

      {/* CATEGORY CHART */}

      <div className="bg-white p-6 rounded shadow mb-10">

        <h2 className="text-xl font-semibold mb-4">
          Issues by Category
        </h2>

        <Bar data={chartData} />

      </div>

      {/* LOCATION HEATMAP */}

      <div className="bg-white p-6 rounded shadow">

        <h2 className="text-xl font-semibold mb-4">

          Campus Issue Hotspots

        </h2>

        <div className="space-y-3">

          {locationStats.map(loc => (

            <div
              key={loc.location}
              className="flex justify-between border-b pb-2"
            >

              <span>{loc.location}</span>

              <span className="font-bold">

                {loc.count} issues

              </span>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

};

export default AdminDashboard;