/* ===================================================== */
/* RESOLVEX AI CHATBOT SERVICE */
/* ===================================================== */

/*
ResolveX Chatbot Service

This service is responsible for generating responses
for the AI campus assistant.

System Workflow:

User Message
↓
Knowledge Base Search
↓
If answer exists → return instantly
↓
If not found → call AI API
↓
Return AI generated response

Benefits:

• Faster responses
• Reduced API cost
• Platform-aware chatbot
*/

/* ===================================================== */
/* IMPORT SERVICES */
/* ===================================================== */

import { searchKnowledgeBase } from "./knowledgeSearch";

/* ===================================================== */
/* ENVIRONMENT CONFIGURATION */
/* ===================================================== */

/*
IMPORTANT

Create a .env file in your project root and add:

REACT_APP_OPENAI_API_KEY=your_api_key_here
*/

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

/* ===================================================== */
/* SYSTEM PROMPT BUILDER */
/* ===================================================== */

function buildSystemPrompt() {

return `
You are ResolveX AI, an intelligent campus governance assistant.

About ResolveX:

ResolveX is a campus platform where students report issues,
students upvote issues, committees resolve problems,
and administrators monitor campus operations.

Platform workflow:

Student reports issue
↓
Issue appears in public issue feed
↓
Students upvote issue
↓
System prioritizes issue
↓
Issue assigned to committee
↓
Committee resolves issue
↓
Administrators monitor analytics

Committees:

Food → Mess Committee
Hostel → Hostel Committee
Hygiene → Sanitation Committee
Infrastructure → Maintenance Committee
Discipline → Disciplinary Committee

Your responsibilities:

• Help students understand ResolveX
• Explain how to report issues
• Guide users about campus governance
• Provide helpful responses

Always respond clearly and concisely.
`;

}

/* ===================================================== */
/* OPENAI API CALL */
/* ===================================================== */

async function callOpenAI(question) {

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
content: buildSystemPrompt()
},

{
role: "user",
content: question
}

],

temperature: 0.4,
max_tokens: 400

})

});

if (!response.ok) {

throw new Error("OpenAI API request failed");

}

const data = await response.json();

return data.choices[0].message.content;

}

catch (error) {

console.error("OpenAI Error:", error);

return "The AI assistant is currently unavailable. Please try again later.";

}

}

/* ===================================================== */
/* MAIN CHATBOT FUNCTION */
/* ===================================================== */

export async function askResolveXAI(userQuestion) {

try {

/* ------------------------------------ */
/* STEP 1: SEARCH KNOWLEDGE BASE */
/* ------------------------------------ */

const knowledgeResult = searchKnowledgeBase(userQuestion);

if (knowledgeResult.found) {

return knowledgeResult.answer;

}

/* ------------------------------------ */
/* STEP 2: CALL AI MODEL */
/* ------------------------------------ */

const aiResponse = await callOpenAI(userQuestion);

return aiResponse;

}

catch (error) {

console.error("Chatbot Service Error:", error);

return "Something went wrong while processing your request.";

}

}

/* ===================================================== */
/* EXPORT FUNCTIONS */
/* ===================================================== */

export default askResolveXAI;
