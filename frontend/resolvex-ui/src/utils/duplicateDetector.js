/*
====================================================================
ResolveX Duplicate Issue Detector
====================================================================

This module detects similar issues.

It compares titles using word similarity.

Algorithm steps:

1. Normalize text
2. Split words
3. Compare shared words
4. Calculate similarity score

====================================================================
*/

export function normalizeText(text) {

  return text
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .trim();

}

export function calculateSimilarity(a, b) {

  const wordsA = normalizeText(a).split(" ");

  const wordsB = normalizeText(b).split(" ");

  const shared = wordsA.filter(word =>
    wordsB.includes(word)
  );

  const similarityScore =
    shared.length /
    Math.max(wordsA.length, wordsB.length);

  return similarityScore;

}

export function detectDuplicate(newTitle, existingIssues) {

  const threshold = 0.6;

  for (let issue of existingIssues) {

    const score = calculateSimilarity(
      newTitle,
      issue.title
    );

    if (score >= threshold) {

      return {
        isDuplicate: true,
        similarIssue: issue
      };

    }

  }

  return {
    isDuplicate: false
  };

}