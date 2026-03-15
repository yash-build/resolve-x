
/*
====================================================================
ResolveX Smart Priority Engine
====================================================================

Purpose
-------
Ranks campus issues intelligently so that the most important
problems rise to the top automatically.

Used In
-------
• Issue Feed
• Committee Dashboard
• Admin Analytics
• Future AI Insights

Priority Factors
----------------

1️⃣ Upvotes
   More students affected → higher priority

2️⃣ Severity
   AI classification of seriousness

3️⃣ Issue Age
   Older unresolved issues gain urgency

4️⃣ Status
   Resolved issues are automatically deprioritized

Formula
-------

priorityScore =
  (upvotesWeight * upvotes)
+ (severityWeight * severity)
+ (ageWeight * ageScore)

====================================================================
*/


/*
====================================================================
CONFIGURATION
====================================================================
*/

const PRIORITY_CONFIG = {

  upvotesWeight: 2,

  severityWeight: 3,

  ageWeight: 0.15,

  resolvedPenalty: 1000

};


/*
====================================================================
SEVERITY NORMALIZATION
====================================================================

Ensures severity always has a valid numeric value.
*/

function normalizeSeverity(severity) {

  if (!severity) return 1;

  if (typeof severity === "number") return severity;

  const map = {
    low: 1,
    medium: 2,
    high: 3,
    critical: 4
  };

  return map[severity] || 1;

}


/*
====================================================================
TIMESTAMP NORMALIZATION
====================================================================

Handles Firestore timestamp safely.
*/

function getIssueTimestamp(issue) {

  if (!issue.createdAt) return Date.now();

  if (issue.createdAt.seconds) {

    return issue.createdAt.seconds * 1000;

  }

  if (issue.createdAt instanceof Date) {

    return issue.createdAt.getTime();

  }

  return Date.now();

}


/*
====================================================================
AGE SCORE CALCULATION
====================================================================

Older issues become more important.

Example:

0 hours → 0
12 hours → 1.8
24 hours → 3.6
*/

function calculateAgeScore(issueTimestamp) {

  const now = Date.now();

  const ageMs = now - issueTimestamp;

  const ageHours = ageMs / (1000 * 60 * 60);

  return ageHours;

}


/*
====================================================================
MAIN PRIORITY CALCULATOR
====================================================================
*/

export function calculatePriorityScore(issue) {

  const upvotes = issue.upvotes || 0;

  const severity = normalizeSeverity(issue.severity);

  const timestamp = getIssueTimestamp(issue);

  const ageScore = calculateAgeScore(timestamp);

  let priorityScore =
    (PRIORITY_CONFIG.upvotesWeight * upvotes)
  + (PRIORITY_CONFIG.severityWeight * severity)
  + (PRIORITY_CONFIG.ageWeight * ageScore);

  /*
  ---------------------------------------------------------------
  Resolved Issues Penalty
  ---------------------------------------------------------------
  */

  if (issue.status === "resolved") {

    priorityScore -= PRIORITY_CONFIG.resolvedPenalty;

  }

  return priorityScore;

}


/*
====================================================================
SORT ISSUES BY PRIORITY
====================================================================
*/

export function sortIssuesByPriority(issues) {

  if (!Array.isArray(issues)) {

    console.warn("PriorityEngine: issues is not an array");

    return [];

  }

  const scoredIssues = issues.map(issue => {

    const priorityScore = calculatePriorityScore(issue);

    return {

      ...issue,

      priorityScore

    };

  });

  scoredIssues.sort((a, b) => {

    return b.priorityScore - a.priorityScore;

  });

  return scoredIssues;

}


/*
====================================================================
FILTER HIGH PRIORITY ISSUES
====================================================================

Used for dashboards.
*/

export function getHighPriorityIssues(issues, threshold = 10) {

  return issues.filter(issue => {

    const score = calculatePriorityScore(issue);

    return score >= threshold;

  });

}


/*
====================================================================
DEBUG UTILITIES
====================================================================
*/

export function debugPriority(issue) {

  const upvotes = issue.upvotes || 0;

  const severity = normalizeSeverity(issue.severity);

  const timestamp = getIssueTimestamp(issue);

  const ageScore = calculateAgeScore(timestamp);

  const score = calculatePriorityScore(issue);

  console.group("ResolveX Priority Debug");

  console.log("Title:", issue.title);

  console.log("Upvotes:", upvotes);

  console.log("Severity:", severity);

  console.log("AgeScore:", ageScore.toFixed(2));

  console.log("Priority Score:", score.toFixed(2));

  console.groupEnd();

}

