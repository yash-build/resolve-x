import React, { useEffect, useState } from "react";

import {
  collection,
  query,
  where,
  onSnapshot
} from "firebase/firestore";

import { db } from "../services/firebase";

import IssueCard from "../components/IssueCard";

const AuthorityDashboard = () => {

  const [issues, setIssues] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const q = query(

      collection(db, "issues"),

      where("sensitive", "==", true)

    );

    const unsubscribe = onSnapshot(

      q,

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

  if (loading) {

    return (
      <div className="text-center mt-10">
        Loading sensitive issues...
      </div>
    );

  }

  return (

    <div className="max-w-4xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">

        Authority Dashboard

      </h1>

      <p className="mb-4 text-gray-600">

        Confidential issues reported by students.

      </p>

      {issues.length === 0 && (

        <div className="text-gray-500">

          No sensitive issues reported.

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

export default AuthorityDashboard;