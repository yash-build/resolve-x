import React, { useEffect, useState } from "react";

import {
  getIssueStats,
  getCategoryStats,
  getMonthlyStats
} from "../services/analyticsService";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

const COLORS = [
  "#6366f1",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#06b6d4"
];

const AdminDashboard = () => {

  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    pending: 0
  });

  const [categoryData, setCategoryData] = useState([]);

  const [monthlyData, setMonthlyData] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function loadAnalytics() {

      try {

        const basicStats = await getIssueStats();

        const categories = await getCategoryStats();

        const monthly = await getMonthlyStats();

        setStats(basicStats);

        setCategoryData(categories);

        setMonthlyData(monthly);

      } catch (error) {

        console.error("Analytics error:", error);

      }

      setLoading(false);

    }

    loadAnalytics();

  }, []);

  if (loading) {

    return (
      <div className="text-center">
        Loading analytics...
      </div>
    );

  }

  return (

    <div className="max-w-6xl mx-auto">

      <h1 className="text-3xl font-bold mb-8">
        Admin Analytics Dashboard
      </h1>

      {/* Stats Cards */}

      <div className="grid grid-cols-3 gap-6 mb-10">

        <div className="bg-white p-6 rounded shadow text-center">
          <h2 className="text-lg text-gray-500">
            Total Issues
          </h2>
          <p className="text-3xl font-bold">
            {stats.total}
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow text-center">
          <h2 className="text-lg text-gray-500">
            Pending
          </h2>
          <p className="text-3xl font-bold text-yellow-500">
            {stats.pending}
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow text-center">
          <h2 className="text-lg text-gray-500">
            Resolved
          </h2>
          <p className="text-3xl font-bold text-green-600">
            {stats.resolved}
          </p>
        </div>

      </div>

      {/* Category Chart */}

      <div className="bg-white p-6 rounded shadow mb-10">

        <h2 className="text-xl font-semibold mb-4">
          Issue Category Distribution
        </h2>

        <PieChart width={400} height={300}>

          <Pie
            data={categoryData}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >

            {categoryData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}

          </Pie>

          <Tooltip />

        </PieChart>

      </div>

      {/* Monthly Chart */}

      <div className="bg-white p-6 rounded shadow">

        <h2 className="text-xl font-semibold mb-4">
          Monthly Issue Trends
        </h2>

        <BarChart
          width={600}
          height={300}
          data={monthlyData}
        >

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="issues"
            fill="#6366f1"
          />

        </BarChart>

      </div>

    </div>

  );

};

export default AdminDashboard;