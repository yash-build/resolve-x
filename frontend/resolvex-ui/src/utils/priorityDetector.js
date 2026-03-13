/*
=====================================================================
ResolveX Intelligent Priority Detection System
=====================================================================

Purpose:
Automatically determine issue severity based on keywords.

Priority Levels:

1. CRITICAL
2. HIGH
3. MEDIUM
4. LOW

Detection Process:

Step 1: Normalize text
Step 2: Check CRITICAL keywords
Step 3: Check HIGH keywords
Step 4: Check MEDIUM keywords
Step 5: Check LOW keywords
Step 6: Return detected priority

=====================================================================
*/


/*
=====================================================================
Normalize Text
=====================================================================
*/

function normalizeText(text) {

  if (!text) return "";

  return text
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .trim();

}


/*
=====================================================================
Keyword Dictionaries
=====================================================================
*/

const criticalKeywords = [

  "gas leak",
  "gas leakage",
  "fire",
  "electric shock",
  "short circuit",
  "explosion",
  "toxic",
  "hazard",
  "danger",
  "water contamination"

];

const highKeywords = [

  "water leak",
  "water leakage",
  "food poisoning",
  "sewage",
  "power failure",
  "electric issue",
  "broken pipe",
  "overflow"

];

const mediumKeywords = [

  "food quality",
  "mess food",
  "dirty",
  "unclean",
  "maintenance",
  "fan not working",
  "light not working",
  "water supply issue"

];

const lowKeywords = [

  "broken chair",
  "noise",
  "wifi slow",
  "paint damage",
  "minor issue",
  "cosmetic damage"

];


/*
=====================================================================
Keyword Matching Utility
=====================================================================
*/

function containsKeyword(text, keywordList) {

  for (let keyword of keywordList) {

    if (text.includes(keyword)) {

      return true;

    }

  }

  return false;

}


/*
=====================================================================
Priority Detection Function
=====================================================================
*/

export function detectPriority(title, description) {

  const combinedText = normalizeText(
    `${title} ${description}`
  );

  /*
  --------------------------------------------------------------
  CRITICAL CHECK
  --------------------------------------------------------------
  */

  if (containsKeyword(combinedText, criticalKeywords)) {

    return "critical";

  }

  /*
  --------------------------------------------------------------
  HIGH CHECK
  --------------------------------------------------------------
  */

  if (containsKeyword(combinedText, highKeywords)) {

    return "high";

  }

  /*
  --------------------------------------------------------------
  MEDIUM CHECK
  --------------------------------------------------------------
  */

  if (containsKeyword(combinedText, mediumKeywords)) {

    return "medium";

  }

  /*
  --------------------------------------------------------------
  LOW CHECK
  --------------------------------------------------------------
  */

  if (containsKeyword(combinedText, lowKeywords)) {

    return "low";

  }

  /*
  --------------------------------------------------------------
  DEFAULT PRIORITY
  --------------------------------------------------------------
  */

  return "low";

}