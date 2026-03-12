import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import IssueCard from "../components/IssueCard";

const CommitteeDashboard = () => {

  const [issues, setIssues] = useState([]);
  const [committee, setCommittee] = useState("Mess Committee");

  useEffect(() => {

    const unsubscribe = onSnapshot(
      collection(db, "issues"),
      (snapshot) => {

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        setIssues(data);

      }
    );

    return () => unsubscribe();

  }, []);

  const filteredIssues = issues.filter(
    (issue) => issue.assignedCommittee === committee
  );

  return (

    <div className="max-w-3xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">
        Committee Dashboard
      </h1>

      <select
        className="border px-3 py-2 rounded mb-6"
        value={committee}
        onChange={(e) => setCommittee(e.target.value)}
      >

        <option>Mess Committee</option>
        <option>Hostel Committee</option>
        <option>Maintenance Committee</option>
        <option>Sanitation Committee</option>
        <option>Disciplinary Committee</option>

      </select>

      <div className="space-y-4">

        {filteredIssues.length === 0 ? (
          <p>No issues assigned.</p>
        ) : (
          filteredIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))
        )}

      </div>

    </div>

  );

};

export default CommitteeDashboard;