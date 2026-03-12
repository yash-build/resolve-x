import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, getDocs } from "firebase/firestore";

const AdminDashboard = () => {

  const [totalIssues, setTotalIssues] = useState(0);
  const [resolvedIssues, setResolvedIssues] = useState(0);
  const [pendingIssues, setPendingIssues] = useState(0);

  useEffect(() => {

    const fetchData = async () => {

      const snapshot = await getDocs(collection(db, "issues"));

      const issues = snapshot.docs.map((doc) => doc.data());

      setTotalIssues(issues.length);

      const resolved = issues.filter(
        (issue) => issue.status === "resolved"
      );

      setResolvedIssues(resolved.length);

      setPendingIssues(issues.length - resolved.length);

    };

    fetchData();

  }, []);

  return (

    <div className="max-w-5xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-6">

        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-gray-500">Total Issues</h2>
          <p className="text-3xl font-bold">{totalIssues}</p>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-gray-500">Resolved</h2>
          <p className="text-3xl font-bold">{resolvedIssues}</p>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-gray-500">Pending</h2>
          <p className="text-3xl font-bold">{pendingIssues}</p>
        </div>

      </div>

    </div>

  );

};

export default AdminDashboard;