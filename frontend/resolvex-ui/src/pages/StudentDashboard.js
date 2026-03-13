import React, { useEffect, useState } from "react";

import { collection, query, onSnapshot } from "firebase/firestore";

import { db } from "../services/firebase";

const StudentDashboard = () => {

  const [stats, setStats] = useState({

    total: 0,

    pending: 0,

    resolved: 0

  });

  useEffect(() => {

    const q = query(collection(db, "issues"));

    const unsubscribe = onSnapshot(q, (snapshot) => {

      const issues = snapshot.docs.map(doc => doc.data());

      const total = issues.length;

      const pending = issues.filter(i => i.status === "pending").length;

      const resolved = issues.filter(i => i.status === "resolved").length;

      setStats({
        total,
        pending,
        resolved
      });

    });

    return () => unsubscribe();

  }, []);

  return (

    <div>

      <h1 className="text-3xl font-bold mb-6">
        Student Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-6">

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
            Pending
          </h2>

          <p className="text-3xl font-bold text-yellow-500">
            {stats.pending}
          </p>

        </div>

        <div className="bg-white p-6 rounded shadow text-center">

          <h2 className="text-gray-500">
            Resolved
          </h2>

          <p className="text-3xl font-bold text-green-600">
            {stats.resolved}
          </p>

        </div>

      </div>

    </div>

  );

};

export default StudentDashboard;