/*
=====================================================================
ResolveX Admin Analytics Dashboard
=====================================================================

Displays:

• Total Issues
• Pending Issues
• Resolved Issues
• Issues by Category (Chart)
• Committee Performance
• Location Heatmap Data

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

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0
  });

  const [categoryStats, setCategoryStats] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function loadData() {

      const snapshot = await getDocs(
        collection(db, "issues")
      );

      const issues = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const total = issues.length;

      const pending = issues.filter(
        i => i.status === "pending"
      ).length;

      const resolved = issues.filter(
        i => i.status === "resolved"
      ).length;

      setStats({ total, pending, resolved });

      /*
      CATEGORY ANALYTICS
      */

      const categoryMap = {};

      issues.forEach(issue => {

        const cat = issue.category || "Unknown";

        if (!categoryMap[cat]) {

          categoryMap[cat] = 0;

        }

        categoryMap[cat]++;

      });

      setCategoryStats(categoryMap);

      setLoading(false);

    }

    loadData();

  }, []);

  if (loading) {

    return <div>Loading analytics...</div>;

  }

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

  return (

    <div className="max-w-6xl mx-auto">

      <h1 className="text-3xl font-bold mb-8">

        Admin Analytics

      </h1>

      <div className="grid grid-cols-3 gap-6 mb-8">

        <div className="bg-white p-6 rounded shadow text-center">
          Total Issues
          <p className="text-3xl font-bold">
            {stats.total}
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow text-center">
          Pending
          <p className="text-3xl text-yellow-600 font-bold">
            {stats.pending}
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow text-center">
          Resolved
          <p className="text-3xl text-green-600 font-bold">
            {stats.resolved}
          </p>
        </div>

      </div>

      <div className="bg-white p-6 rounded shadow">

        <h2 className="text-xl font-semibold mb-4">
          Issue Categories
        </h2>

        <Bar data={chartData} />

      </div>

    </div>

  );

};

export default AdminDashboard;