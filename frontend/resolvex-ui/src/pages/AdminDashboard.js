import React, { useEffect, useState } from "react";

import {
  collection,
  getDocs
} from "firebase/firestore";

import { db } from "../services/firebase";

/*
==============================================================
Admin Analytics Dashboard
==============================================================

Displays:

• Total issues
• Pending issues
• Resolved issues
• Committee performance
• Average resolution times

==============================================================
*/

const AdminDashboard = () => {

  const [stats, setStats] = useState({

    total: 0,
    pending: 0,
    resolved: 0

  });

  const [committeeStats, setCommitteeStats] = useState([]);

  const [loading, setLoading] = useState(true);

  /*
  ==============================================================
  Fetch Issues
  ============================================================== 
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

      const total = issues.length;

      const pending = issues.filter(
        i => i.status === "pending"
      ).length;

      const resolved = issues.filter(
        i => i.status === "resolved"
      ).length;

      setStats({
        total,
        pending,
        resolved
      });

      /*
      ==========================================================
      Committee Performance Calculation
      ==========================================================
      */

      const committeeMap = {};

      issues.forEach(issue => {

        const committee = issue.assignedCommittee;

        if (!committeeMap[committee]) {

          committeeMap[committee] = {

            name: committee,
            resolved: 0,
            pending: 0,
            totalResolutionTime: 0,
            resolvedCount: 0

          };

        }

        if (issue.status === "resolved") {

          committeeMap[committee].resolved++;

          if (issue.resolutionTimeHours) {

            committeeMap[committee].totalResolutionTime += issue.resolutionTimeHours;

            committeeMap[committee].resolvedCount++;

          }

        }

        if (issue.status === "pending") {

          committeeMap[committee].pending++;

        }

      });

      const committees = Object.values(committeeMap).map(c => {

        const avgTime = c.resolvedCount
          ? (c.totalResolutionTime / c.resolvedCount).toFixed(2)
          : "N/A";

        return {

          name: c.name,
          resolved: c.resolved,
          pending: c.pending,
          avgResolutionHours: avgTime

        };

      });

      setCommitteeStats(committees);

      setLoading(false);

    }

    loadAnalytics();

  }, []);

  if (loading) {

    return (
      <div className="text-center">
        Loading admin analytics...
      </div>
    );

  }

  return (

    <div className="max-w-6xl mx-auto">

      <h1 className="text-3xl font-bold mb-8">

        Admin Analytics Dashboard

      </h1>

      {/* Statistics Cards */}

      <div className="grid grid-cols-3 gap-6 mb-10">

        <div className="bg-white p-6 rounded shadow text-center">

          <h2 className="text-gray-500">
            Total Issues
          </h2>

          <p className="text-3xl font-bold">
            {stats.total}
          </p>

        </div>

        <div className="bg-white p-6 rounded shadow text-center">

          <h2 className="text-gray-500">
            Pending Issues
          </h2>

          <p className="text-3xl font-bold text-yellow-600">
            {stats.pending}
          </p>

        </div>

        <div className="bg-white p-6 rounded shadow text-center">

          <h2 className="text-gray-500">
            Resolved Issues
          </h2>

          <p className="text-3xl font-bold text-green-600">
            {stats.resolved}
          </p>

        </div>

      </div>

      {/* Committee Performance */}

      <h2 className="text-2xl font-semibold mb-4">
        Committee Performance
      </h2>

      <div className="space-y-4">

        {committeeStats.map(committee => (

          <div
            key={committee.name}
            className="bg-white p-6 rounded shadow"
          >

            <h3 className="text-xl font-bold mb-2">
              {committee.name}
            </h3>

            <div className="grid grid-cols-3 gap-4">

              <div>
                Resolved Issues:
                <strong> {committee.resolved}</strong>
              </div>

              <div>
                Pending Issues:
                <strong> {committee.pending}</strong>
              </div>

              <div>
                Avg Resolution Time:
                <strong> {committee.avgResolutionHours} hrs</strong>
              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

};

export default AdminDashboard;