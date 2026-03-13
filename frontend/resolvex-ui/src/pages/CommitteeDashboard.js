/*
======================================================================
ResolveX Committee Dashboard
======================================================================

Purpose:
Allow committees to manage issues assigned to them.

Features:

• View assigned issues
• Resolve issues
• Real-time updates
• Priority awareness

======================================================================
*/

import React, { useEffect, useState } from "react";

import {
  collection,
  query,
  where,
  onSnapshot
} from "firebase/firestore";

import { db } from "../services/firebase";

import IssueCard from "../components/IssueCard";

const CommitteeDashboard = () => {

  /*
  ================================================================
  STATE VARIABLES
  ================================================================
  */

  const [issues, setIssues] = useState([]);

  const [loading, setLoading] = useState(true);

  const committeeName = "Mess Committee"; // Example committee

  /*
  ================================================================
  LOAD ASSIGNED ISSUES
  ================================================================
  */

  useEffect(() => {

    const issueQuery = query(

      collection(db, "issues"),

      where("assignedCommittee", "==", committeeName)

    );

    const unsubscribe = onSnapshot(

      issueQuery,

      (snapshot) => {

        const fetchedIssues = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setIssues(fetchedIssues);

        setLoading(false);

      }

    );

    return () => unsubscribe();

  }, []);

  /*
  ================================================================
  LOADING STATE
  ================================================================
  */

  if (loading) {

    return (
      <div className="text-center mt-10">
        Loading committee tasks...
      </div>
    );

  }

  /*
  ================================================================
  DASHBOARD UI
  ================================================================
  */

  return (

    <div className="max-w-4xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">

        {committeeName} Dashboard

      </h1>

      {issues.length === 0 && (

        <div className="text-gray-500">
          No assigned issues.
        </div>

      )}

      <div className="space-y-4">

        {issues.map(issue => (

          <IssueCard
            key={issue.id}
            issue={issue}
          />

        ))}

      </div>

    </div>

  );

};

export default CommitteeDashboard;