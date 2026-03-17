/* ===================================================== */
/* RESOLVEX DUPLICATE ISSUE DETECTION ENGINE */
/* ===================================================== */

/*
This service detects whether a newly reported issue
is similar to existing issues.

Goals:

• prevent duplicate reports
• keep issue database clean
• encourage students to support existing issues

Algorithm Used:

1. Normalize text
2. Remove stopwords
3. Tokenize sentences
4. Compare tokens using Jaccard similarity
5. Return issues above similarity threshold
   */

/* ===================================================== */
/* CONFIGURATION */
/* ===================================================== */

const SIMILARITY_THRESHOLD = 0.45;

/*
Words that don't add meaningful context
*/

const STOP_WORDS = [

"a","an","the","is","are","was","were","in","on","at",
"of","to","for","with","and","or","this","that","it",
"my","our","your","their"

];

/* ===================================================== */
/* TEXT NORMALIZATION */
/* ===================================================== */

function normalizeText(text) {

if (!text) return "";

return text
.toLowerCase()
.replace(/[^\w\s]/g,"")
.trim();

}

/* ===================================================== */
/* TOKENIZATION */
/* ===================================================== */

function tokenize(text) {

const normalized = normalizeText(text);

const tokens = normalized.split(" ");

return tokens.filter(word => !STOP_WORDS.includes(word));

}

/* ===================================================== */
/* JACCARD SIMILARITY */
/* ===================================================== */

function calculateJaccardSimilarity(tokensA, tokensB) {

const setA = new Set(tokensA);
const setB = new Set(tokensB);

const intersection = new Set(
[...setA].filter(x => setB.has(x))
);

const union = new Set([
...setA,
...setB
]);

return intersection.size / union.size;

}

/* ===================================================== */
/* COMPARE TWO TITLES */
/* ===================================================== */

function compareTitles(titleA, titleB) {

const tokensA = tokenize(titleA);
const tokensB = tokenize(titleB);

return calculateJaccardSimilarity(tokensA, tokensB);

}

/* ===================================================== */
/* MAIN DUPLICATE DETECTION FUNCTION */
/* ===================================================== */

export function detectDuplicateIssues(newIssueTitle, existingIssues = []) {

if (!newIssueTitle || existingIssues.length === 0) {

return [];

}

const duplicates = [];

existingIssues.forEach(issue => {

const similarityScore = compareTitles(
newIssueTitle,
issue.title
);

if (similarityScore >= SIMILARITY_THRESHOLD) {

duplicates.push({

id: issue.id,
title: issue.title,
similarity: similarityScore,
upvotes: issue.upvotes || 0,
status: issue.status || "pending"

});

}

});

/*
Sort duplicates by similarity
*/

duplicates.sort((a,b) => b.similarity - a.similarity);

return duplicates;

}

/* ===================================================== */
/* HELPER: FORMAT DUPLICATE RESULTS */
/* ===================================================== */

export function formatDuplicateResults(duplicates) {

if (!duplicates.length) {

return null;

}

return duplicates.map(issue => ({

id: issue.id,
title: issue.title,
similarity: Math.round(issue.similarity * 100),
upvotes: issue.upvotes,
status: issue.status

}));

}
