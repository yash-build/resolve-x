import React, { useEffect, useState } from "react";

import {
  collection,
  getDocs
} from "firebase/firestore";

import { db } from "../services/firebase";

const Leaderboard = () => {

  const [topIssues, setTopIssues] = useState([]);

  useEffect(() => {

    async function loadLeaderboard() {

      const snapshot = await getDocs(
        collection(db, "issues")
      );

      const issues = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const titleMap = {};

      issues.forEach(issue => {

        const title = issue.title;

        if (!titleMap[title]) {

          titleMap[title] = 0;

        }

        titleMap[title]++;

      });

      const sorted = Object.entries(titleMap)

        .sort((a, b) => b[1] - a[1])

        .slice(0, 5);

      setTopIssues(sorted);

    }

    loadLeaderboard();

  }, []);

  return (

    <div className="max-w-4xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">

        Campus Issue Leaderboard

      </h1>

      <div className="space-y-4">

        {topIssues.map((issue, index) => (

          <div
            key={index}
            className="bg-white p-4 rounded shadow flex justify-between"
          >

            <span>

              {index + 1}. {issue[0]}

            </span>

            <span>

              {issue[1]} reports

            </span>

          </div>

        ))}

      </div>

    </div>

  );

};

export default Leaderboard;