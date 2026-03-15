/**

* ==========================================================
* ResolveX AI Gateway Server
* ==========================================================
*
* This serverless function acts as the central gateway
* between the ResolveX frontend and the OpenAI API.
*
* Architecture
*
* React Frontend
* ```
     ↓
  ```
* GPT Service (frontend)
* ```
     ↓
  ```
* /api/gpt (THIS FILE)
* ```
     ↓
  ```
* OpenAI API
*
* Responsibilities
*
* • Secure API key handling
* • Request validation
* • Rate limiting
* • Prompt filtering
* • Error handling
* • Model configuration
* • Logging
*
* This architecture allows ResolveX to later support:
*
* • OpenAI
* • Claude
* • Gemini
* • Local AI models
*
* without modifying the frontend.
  */

import OpenAI from "openai";

/**

* ==========================================================
* Environment Configuration
* ==========================================================
  */

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.RESOLVEX_AI_MODEL || "gpt-4o-mini";
const TEMPERATURE = parseFloat(process.env.RESOLVEX_AI_TEMPERATURE || "0.5");
const MAX_TOKENS = parseInt(process.env.RESOLVEX_AI_MAX_TOKENS || "500");

/**

* ==========================================================
* Security Configuration
* ==========================================================
  */

const RATE_LIMIT_PER_MINUTE =
parseInt(process.env.AI_RATE_LIMIT_PER_MINUTE || "20");

const ENABLE_PROMPT_FILTER =
process.env.AI_ENABLE_PROMPT_FILTER === "true";

/**

* ==========================================================
* In-memory rate limiter
* (simple but effective for serverless environments)
* ==========================================================
  */

const requestLog = new Map();

function checkRateLimit(ip) {

const now = Date.now();
const windowStart = now - 60000;

if (!requestLog.has(ip)) {
requestLog.set(ip, []);
}

const requests = requestLog.get(ip).filter(
(timestamp) => timestamp > windowStart
);

requests.push(now);
requestLog.set(ip, requests);

return requests.length <= RATE_LIMIT_PER_MINUTE;
}

/**

* ==========================================================
* Prompt Safety Filter
* ==========================================================
  */

function isPromptSafe(prompt) {

if (!ENABLE_PROMPT_FILTER) return true;

const blockedKeywords = [
"hack",
"exploit",
"malware",
"bypass",
"illegal",
"attack",
"phishing"
];

const lowerPrompt = prompt.toLowerCase();

for (const word of blockedKeywords) {

```
if (lowerPrompt.includes(word)) {
  return false;
}
```

}

return true;
}

/**

* ==========================================================
* OpenAI Client
* ==========================================================
  */

const openai = new OpenAI({
apiKey: OPENAI_API_KEY
});

/**

* ==========================================================
* Main API Handler
* ==========================================================
  */

export default async function handler(req, res) {

try {

```
/**
 * ------------------------------------------
 * Method Validation
 * ------------------------------------------
 */

if (req.method !== "POST") {
  return res.status(405).json({
    error: "Method not allowed"
  });
}



/**
 * ------------------------------------------
 * IP Detection
 * ------------------------------------------
 */

const ip =
  req.headers["x-forwarded-for"] ||
  req.socket.remoteAddress ||
  "unknown";



/**
 * ------------------------------------------
 * Rate Limiting
 * ------------------------------------------
 */

const allowed = checkRateLimit(ip);

if (!allowed) {
  return res.status(429).json({
    error: "Too many AI requests. Please slow down."
  });
}



/**
 * ------------------------------------------
 * Request Parsing
 * ------------------------------------------
 */

const { prompt, systemRole } = req.body;



if (!prompt || typeof prompt !== "string") {
  return res.status(400).json({
    error: "Invalid prompt"
  });
}



/**
 * ------------------------------------------
 * Prompt Safety Check
 * ------------------------------------------
 */

if (!isPromptSafe(prompt)) {

  return res.status(403).json({
    error: "Prompt blocked by safety filter"
  });

}



/**
 * ------------------------------------------
 * Construct AI Messages
 * ------------------------------------------
 */

const messages = [

  {
    role: "system",
    content:
      systemRole ||
      "You are the ResolveX AI campus assistant."
  },

  {
    role: "user",
    content: prompt
  }

];



/**
 * ------------------------------------------
 * OpenAI Request
 * ------------------------------------------
 */

const completion = await openai.chat.completions.create({

  model: MODEL,

  messages: messages,

  temperature: TEMPERATURE,

  max_tokens: MAX_TOKENS

});



const aiResponse =
  completion.choices[0]?.message?.content || "";



/**
 * ------------------------------------------
 * Success Response
 * ------------------------------------------
 */

return res.status(200).json({

  success: true,

  response: aiResponse,

  model: MODEL,

  usage: completion.usage || null

});
```

} catch (error) {

```
/**
 * ------------------------------------------
 * Error Logging
 * ------------------------------------------
 */

console.error("ResolveX AI Gateway Error:", error);



/**
 * ------------------------------------------
 * Failure Response
 * ------------------------------------------
 */

return res.status(500).json({

  success: false,

  error: "AI processing failed",

  message: error.message

});
```

}

}
