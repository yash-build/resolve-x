import React, { useEffect, useState } from "react";

import {
  collection,
  query,
  where,
  onSnapshot
} from "firebase/firestore";

import { db } from "../services/firebase";

import { useAuth } from "../context/AuthContext";

import IssueCard from "../components/IssueCard";

const MyIssues = () => {

  const { currentUser } = useAuth();

  const [issues, setIssues] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (!currentUser) return;

    const q = query(
      collection(db, "issues"),
      where("createdBy", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {

      const fetchedIssues = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setIssues(fetchedIssues);

      setLoading(false);

    });

    return () => unsubscribe();

  }, [currentUser]);

  if (loading) {

    return (
      <div className="text-center mt-10">
        Loading your issues...
      </div>
    );

  }

  return (

    <div className="max-w-4xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">
        My Reported Issues
      </h1>

      {issues.length === 0 && (

        <div className="text-gray-500">
          You haven't reported any issues yet.
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

export default MyIssues;