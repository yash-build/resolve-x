/* ===================================================== */
/* RESOLVEX AI ISSUE SUMMARY SERVICE */
/* ===================================================== */

/*
This service generates short summaries for issue descriptions.

Purpose:

Students often submit long descriptions.
This service converts them into short summaries.

Example:

Input:
"The fan in hostel room 203 is making loud noise and stopped working."

Output:
"Hostel room fan malfunction affecting student comfort."
*/

/* ===================================================== */
/* ENV CONFIG */
/* ===================================================== */

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

/* ===================================================== */
/* SYSTEM PROMPT */
/* ===================================================== */

function buildPrompt(description) {

return `
You are an assistant for the ResolveX campus governance platform.

Your job is to summarize student issue descriptions into a
short clear sentence.

Rules:

• Maximum 15 words
• Clear and professional
• Describe the problem only
• No extra explanation

Issue description:

${description}
`;

}

/* ===================================================== */
/* AI SUMMARY GENERATOR */
/* ===================================================== */

export async function generateIssueSummary(description) {

try {

const response = await fetch(OPENAI_API_URL, {

method: "POST",

headers: {

"Content-Type": "application/json",

Authorization: `Bearer ${OPENAI_API_KEY}`

},

body: JSON.stringify({

model: "gpt-4o-mini",

messages: [

{
role: "system",
content: "You summarize issue descriptions."
},

{
role: "user",
content: buildPrompt(description)
}

],

temperature: 0.3,
max_tokens: 60

})

});

if (!response.ok) {

throw new Error("AI summary request failed");

}

const data = await response.json();

return data.choices[0].message.content;

}

catch (error) {

console.error("Issue Summary Error:", error);

/* fallback summary */

return description.slice(0, 80);

}

}
