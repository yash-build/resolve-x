/*
========================================================
ResolveX Analytics Service
========================================================

Provides analytics data for the Admin Dashboard.

Includes:
• Total issues
• Pending issues
• Resolved issues
• Category statistics
• Monthly trends

========================================================
*/

import { collection, getDocs } from "firebase/firestore";

import { db } from "./firebase";

/*
========================================================
Fetch all issues
========================================================
*/

async function fetchIssues() {

  const snapshot = await getDocs(
    collection(db, "issues")
  );

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }));

}

/*
========================================================
Basic Stats
========================================================
*/

export async function getIssueStats() {

  const issues = await fetchIssues();

  const total = issues.length;

  const resolved = issues.filter(
    issue => issue.status === "resolved"
  ).length;

  const pending = issues.filter(
    issue => issue.status === "pending"
  ).length;

  return {
    total,
    resolved,
    pending
  };

}

/*
========================================================
Category Distribution
========================================================
*/

export async function getCategoryStats() {

  const issues = await fetchIssues();

  const categoryMap = {};

  issues.forEach(issue => {

    if (!categoryMap[issue.category]) {
      categoryMap[issue.category] = 0;
    }

    categoryMap[issue.category]++;

  });

  return Object.keys(categoryMap).map(category => ({
    name: category,
    value: categoryMap[category]
  }));

}

/*
========================================================
Monthly Issue Trends
========================================================
*/

export async function getMonthlyStats() {

  const issues = await fetchIssues();

  const monthMap = {};

  issues.forEach(issue => {

    if (!issue.createdAt) return;

    const date = issue.createdAt.toDate();

    const month = date.toLocaleString("default", {
      month: "short"
    });

    if (!monthMap[month]) {
      monthMap[month] = 0;
    }

    monthMap[month]++;

  });

  return Object.keys(monthMap).map(month => ({
    month,
    issues: monthMap[month]
  }));

}