/*
==========================================
DUPLICATE ISSUE DETECTION ENGINE
==========================================

Algorithm:

1 Normalize text
2 Tokenize
3 Compare tokens
4 Calculate Jaccard similarity

If similarity > threshold → duplicate
*/

const normalize = (text) => {

  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .trim();

};

const tokenize = (text) => {

  return normalize(text).split(/\s+/);

};

const jaccardSimilarity = (tokensA, tokensB) => {

  const setA = new Set(tokensA);
  const setB = new Set(tokensB);

  const intersection = new Set(
    [...setA].filter(x => setB.has(x))
  );

  const union = new Set([...setA, ...setB]);

  return intersection.size / union.size;

};

export const detectDuplicateIssues = (
  newDescription,
  existingIssues
) => {

  const newTokens = tokenize(newDescription);

  const threshold = 0.4;

  const duplicates = [];

  existingIssues.forEach(issue => {

    const existingTokens = tokenize(issue.description);

    const similarity = jaccardSimilarity(
      newTokens,
      existingTokens
    );

    if (similarity > threshold) {

      duplicates.push({
        ...issue,
        similarity
      });

    }

  });

  duplicates.sort((a, b) => b.similarity - a.similarity);

  return duplicates.slice(0, 3);

};