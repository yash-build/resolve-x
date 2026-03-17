/* ===================================================== */
/* RESOLVEX KNOWLEDGE SEARCH ENGINE */
/* ===================================================== */

/*
This service searches the ResolveX knowledge base
for answers before calling the AI API.

Benefits:

• Faster responses
• Reduced API cost
• More accurate platform answers
*/

/* ===================================================== */
/* IMPORT KNOWLEDGE BASE */
/* ===================================================== */

import campusKnowledge from "../../data/campusKnowledge";

/* ===================================================== */
/* TEXT NORMALIZATION */
/* ===================================================== */

function normalizeText(text) {

return text
.toLowerCase()
.replace(/[^\w\s]/gi, "");

}

/* ===================================================== */
/* KEYWORD MATCHING ENGINE */
/* ===================================================== */

function findKeywordMatch(question) {

const normalizedQuestion = normalizeText(question);

for (let item of campusKnowledge) {

```
for (let keyword of item.keywords) {

  if (normalizedQuestion.includes(keyword)) {

    return item.answer;

  }

}
```

}

return null;

}

/* ===================================================== */
/* MAIN SEARCH FUNCTION */
/* ===================================================== */

export function searchKnowledgeBase(question) {

const result = findKeywordMatch(question);

if (result) {

```
return {
  found: true,
  answer: result
};
```

}

return {
found: false,
answer: null
};

}
