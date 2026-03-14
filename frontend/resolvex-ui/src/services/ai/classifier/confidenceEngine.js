/*
==========================================================
ResolveX AI Confidence Engine
==========================================================

Purpose
-------
Calculate the confidence score of AI predictions
for issue classification.

This engine evaluates multiple factors:

1. Category score strength
2. Keyword match density
3. Token coverage ratio
4. Severity signal strength
5. Score normalization

This produces a final confidence value between:

0.0 → Very weak prediction
1.0 → Very strong prediction

==========================================================
*/


/* ======================================================
CONFIGURATION CONSTANTS
====================================================== */

const MAX_CATEGORY_SCORE = 12

const KEYWORD_DENSITY_WEIGHT = 0.35
const CATEGORY_SCORE_WEIGHT = 0.40
const TOKEN_COVERAGE_WEIGHT = 0.15
const SEVERITY_WEIGHT = 0.10



/* ======================================================
UTILITY — CLAMP VALUE
Ensures value remains between min and max
====================================================== */

function clamp(value, min, max) {

  if (value < min) return min
  if (value > max) return max

  return value

}



/* ======================================================
CALCULATE CATEGORY SCORE CONFIDENCE
====================================================== */

function calculateCategoryConfidence(score) {

  const normalized = score / MAX_CATEGORY_SCORE

  return clamp(normalized, 0, 1)

}



/* ======================================================
CALCULATE KEYWORD DENSITY
====================================================== */

function calculateKeywordDensity(matchedKeywords, tokens) {

  if (!tokens || tokens.length === 0) return 0

  const density = matchedKeywords.length / tokens.length

  return clamp(density, 0, 1)

}



/* ======================================================
CALCULATE TOKEN COVERAGE
Measures how much of the text contributed
to classification.
====================================================== */

function calculateTokenCoverage(tokens, matchedKeywords) {

  if (!tokens || tokens.length === 0) return 0

  const uniqueMatches = new Set(matchedKeywords)

  const coverage = uniqueMatches.size / tokens.length

  return clamp(coverage, 0, 1)

}



/* ======================================================
SEVERITY CONFIDENCE BOOST
High severity signals slightly increase confidence
====================================================== */

function severityBoost(severity) {

  switch (severity) {

    case "High":
      return 0.15

    case "Medium":
      return 0.08

    case "Low":
      return 0.02

    default:
      return 0

  }

}



/* ======================================================
MAIN CONFIDENCE CALCULATION
====================================================== */

export function calculateConfidence({

  categoryScore,
  tokens,
  matchedKeywords,
  severity

}) {

  /* ----------------------------------------------
  CATEGORY CONFIDENCE
  ---------------------------------------------- */

  const categoryConfidence =
    calculateCategoryConfidence(categoryScore)



  /* ----------------------------------------------
  KEYWORD DENSITY
  ---------------------------------------------- */

  const keywordDensity =
    calculateKeywordDensity(matchedKeywords, tokens)



  /* ----------------------------------------------
  TOKEN COVERAGE
  ---------------------------------------------- */

  const tokenCoverage =
    calculateTokenCoverage(tokens, matchedKeywords)



  /* ----------------------------------------------
  SEVERITY BOOST
  ---------------------------------------------- */

  const severitySignal =
    severityBoost(severity)



  /* ----------------------------------------------
  WEIGHTED CONFIDENCE
  ---------------------------------------------- */

  const weightedScore =

    categoryConfidence * CATEGORY_SCORE_WEIGHT +
    keywordDensity * KEYWORD_DENSITY_WEIGHT +
    tokenCoverage * TOKEN_COVERAGE_WEIGHT +
    severitySignal * SEVERITY_WEIGHT



  /* ----------------------------------------------
  FINAL CONFIDENCE
  ---------------------------------------------- */

  const finalConfidence = clamp(weightedScore, 0, 1)



  return finalConfidence

}



/* ======================================================
CONFIDENCE LABEL HELPER
Used for UI display
====================================================== */

export function getConfidenceLabel(confidence) {

  if (confidence >= 0.85) {
    return "Very High"
  }

  if (confidence >= 0.65) {
    return "High"
  }

  if (confidence >= 0.45) {
    return "Medium"
  }

  if (confidence >= 0.25) {
    return "Low"
  }

  return "Very Low"

}



/* ======================================================
CONFIDENCE COLOR HELPER
Used for UI badge coloring
====================================================== */

export function getConfidenceColor(confidence) {

  if (confidence >= 0.85) {
    return "green"
  }

  if (confidence >= 0.65) {
    return "blue"
  }

  if (confidence >= 0.45) {
    return "yellow"
  }

  if (confidence >= 0.25) {
    return "orange"
  }

  return "red"

}