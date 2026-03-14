// src/services/aiIssueClassifier.js

/*
====================================================
ResolveX AI Issue Classification Engine
====================================================

Purpose:
Analyze issue descriptions and predict:

• Category
• Committee
• Severity
• Confidence Score

This is a rule-based NLP classifier designed
for campus issue detection.

====================================================
*/


/* ===============================================
CATEGORY KEYWORD DATABASE
=============================================== */

const categoryKeywords = {

  Hostel: [
    "hostel",
    "room",
    "fan",
    "water",
    "electricity",
    "bathroom",
    "leak",
    "bed",
    "repair",
    "maintenance"
  ],

  Food: [
    "food",
    "mess",
    "canteen",
    "meal",
    "breakfast",
    "lunch",
    "dinner",
    "spoiled",
    "bad food",
    "hygiene"
  ],

  Hygiene: [
    "dirty",
    "unclean",
    "garbage",
    "trash",
    "cleaning",
    "washroom",
    "smell",
    "sanitation"
  ],

  Infrastructure: [
    "wifi",
    "internet",
    "network",
    "router",
    "lab",
    "classroom",
    "projector",
    "computer",
    "electric"
  ],

  Discipline: [
    "ragging",
    "fight",
    "harassment",
    "abuse",
    "threat",
    "misconduct"
  ]

};



/* ===============================================
COMMITTEE ROUTING
=============================================== */

const committeeMap = {

  Hostel: "Hostel Committee",
  Food: "Mess Committee",
  Hygiene: "Sanitation Committee",
  Infrastructure: "Maintenance Committee",
  Discipline: "Disciplinary Committee"

};



/* ===============================================
SEVERITY KEYWORDS
=============================================== */

const severityKeywords = {

  High: [
    "danger",
    "emergency",
    "broken",
    "leak",
    "electric shock",
    "fire"
  ],

  Medium: [
    "not working",
    "issue",
    "problem",
    "bad",
    "slow"
  ],

  Low: [
    "suggestion",
    "request",
    "improvement"
  ]

};



/* ===============================================
TEXT NORMALIZER
=============================================== */

function normalizeText(text) {

  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .trim();

}



/* ===============================================
KEYWORD SCORING
=============================================== */

function calculateScore(text, keywords) {

  let score = 0;

  keywords.forEach(word => {

    if (text.includes(word)) {
      score += 1;
    }

  });

  return score;

}



/* ===============================================
CATEGORY DETECTION
=============================================== */

function detectCategory(text) {

  let bestCategory = null;
  let highestScore = 0;

  Object.keys(categoryKeywords).forEach(category => {

    const score = calculateScore(text, categoryKeywords[category]);

    if (score > highestScore) {

      highestScore = score;
      bestCategory = category;

    }

  });

  return { bestCategory, highestScore };

}



/* ===============================================
SEVERITY DETECTION
=============================================== */

function detectSeverity(text) {

  let severity = "Low";

  Object.keys(severityKeywords).forEach(level => {

    const score = calculateScore(text, severityKeywords[level]);

    if (score > 0) {

      severity = level;

    }

  });

  return severity;

}



/* ===============================================
MAIN CLASSIFIER FUNCTION
=============================================== */

export function classifyIssue(description) {

  const text = normalizeText(description);

  const { bestCategory, highestScore } = detectCategory(text);

  const severity = detectSeverity(text);

  const committee = bestCategory
    ? committeeMap[bestCategory]
    : null;

  const confidence = Math.min(1, highestScore / 3);



  return {

    category: bestCategory || "Unknown",

    committee: committee || "Unassigned",

    severity: severity,

    confidence: confidence

  };

}