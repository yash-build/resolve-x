/*
=====================================================
ResolveX MAIN AI ISSUE CLASSIFIER
=====================================================

Pipeline

User Description
      ↓
Text Processor
      ↓
Keyword Matching
      ↓
Category Detection
      ↓
Severity Detection
      ↓
Confidence Calculation

=====================================================
*/

import { processText } from "./textProcessor";
import { CATEGORY_DATABASE, COMMITTEE_MAP } from "./keywordDatabase";
import { detectSeverity } from "./severityEngine";
import { calculateConfidence } from "./confidenceEngine";



/* =====================================================
MAIN CLASSIFICATION FUNCTION
===================================================== */

export function classifyIssue(description) {

  /* --------------------------------------------
  Process text into tokens
  -------------------------------------------- */

  const tokens = processText(description);

  let bestCategory = null;
  let highestScore = 0;
  let matchedKeywords = [];



  /* --------------------------------------------
  Category Detection
  -------------------------------------------- */

  Object.keys(CATEGORY_DATABASE).forEach((category) => {

    let score = 0;

    CATEGORY_DATABASE[category].keywords.forEach((keyword) => {

      if (tokens.includes(keyword)) {

        score += CATEGORY_DATABASE[category].weight;

        matchedKeywords.push(keyword);

      }

    });

    if (score > highestScore) {

      highestScore = score;
      bestCategory = category;

    }

  });



  /* --------------------------------------------
  Severity Detection
  -------------------------------------------- */

  const severity = detectSeverity(tokens);



  /* --------------------------------------------
  Committee Routing
  -------------------------------------------- */

  const committee =
    COMMITTEE_MAP[bestCategory] || "Unassigned";



  /* --------------------------------------------
  Confidence Calculation
  -------------------------------------------- */

  const confidence = calculateConfidence({
    categoryScore: highestScore,
    tokens: tokens,
    matchedKeywords: matchedKeywords,
    severity: severity
  });



  /* --------------------------------------------
  Final Prediction Object
  -------------------------------------------- */

  return {

    category: bestCategory || "Unknown",

    committee: committee,

    severity: severity,

    confidence: confidence,

    matchedKeywords: matchedKeywords,

    analysis: {
      tokens: tokens,
      score: highestScore
    }

  };

}