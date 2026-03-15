/**

* ==========================================================
* ResolveX GPT Service
* ==========================================================
*
* This service acts as the AI request manager for the
* entire ResolveX frontend.
*
* Responsibilities
*
* • Communicate with the AI Gateway
* • Handle retries
* • Manage timeouts
* • Protect UI from crashes
* • Provide reusable AI utilities
*
* Architecture
*
* React Components
*
     ↓
  
* GPT Service (this file)
* 
     ↓
  
* AI Gateway API (/api/gpt)
* 
     ↓
  
* OpenAI API
  */

const API_ENDPOINT = "/api/gpt";

/**

* ==========================================================
* Configuration
* ==========================================================
  */

const AI_TIMEOUT = 15000;
const MAX_RETRIES = 2;

const DEBUG_MODE =
process.env.REACT_APP_DEBUG_MODE === "true";

/**

* ==========================================================
* Utility: Delay
* ==========================================================
  */

function delay(ms) {
return new Promise((resolve) => setTimeout(resolve, ms));
}

/**

* ==========================================================
* Utility: Timeout wrapper
* ==========================================================
  */

function fetchWithTimeout(resource, options = {}) {

const { timeout = AI_TIMEOUT } = options;

return Promise.race([
fetch(resource, options),
new Promise((_, reject) =>
setTimeout(
() => reject(new Error("AI request timeout")),
timeout
)
)
]);

}

/**

* ==========================================================
* AI Request Manager
* ==========================================================
  */

class GPTService {

constructor() {


this.endpoint = API_ENDPOINT;


}

/**

* ---
* Core AI Request
* ---

*/

async sendRequest(prompt, systemRole) {


let attempts = 0;

while (attempts <= MAX_RETRIES) {

  try {

    if (DEBUG_MODE) {
      console.log("AI Request:", prompt);
    }

    const response = await fetchWithTimeout(this.endpoint, {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        prompt,
        systemRole
      })

    });



    if (!response.ok) {

      const errorText = await response.text();

      throw new Error(
        "AI Gateway error: " + errorText
      );

    }



    const data = await response.json();



    if (!data.success) {
      throw new Error(
        data.error || "Unknown AI error"
      );
    }



    return data.response;

  } catch (error) {

    attempts++;

    console.error(
      "ResolveX AI Error:",
      error.message
    );



    if (attempts > MAX_RETRIES) {

      return "AI service is temporarily unavailable. Please try again later.";

    }



    await delay(1000 * attempts);

  }

}


}

/**

* ========================================================
* Campus Chatbot
* ========================================================
  */

async campusAssistant(message) {


const systemPrompt = `


You are the ResolveX Campus Assistant.

You help students with:

• hostel issues
• mess complaints
• infrastructure problems
• hygiene concerns
• campus services
• issue reporting

Your responses must be:

• clear
• short
• helpful
• student friendly
`;


return this.sendRequest(message, systemPrompt);


}

/**

* ========================================================
* Issue Summarization
* ========================================================
  */

async summarizeIssue(description) {


const prompt = `


Summarize the following campus issue in ONE short sentence.

Issue description:

${description}
`;


return this.sendRequest(prompt);


}

/**

* ========================================================
* Issue Report Improver
* ========================================================
  */

async improveIssueReport(description) {


const prompt = `


Rewrite the following campus issue report to make it:

• clearer
• more formal
• easier for administrators to understand

Original report:

${description}
`;


return this.sendRequest(prompt);


}

/**

* ========================================================
* AI Category Suggestion
* (Future feature)
* ========================================================
  */

async suggestIssueCategory(description) {


const prompt = `


Based on the following campus issue description,
suggest the most relevant category.

Categories:

Hostel
Food
Hygiene
Infrastructure
Discipline

Description:

${description}

Return ONLY the category name.
`;


return this.sendRequest(prompt);


}

/**

* ========================================================
* AI Campus Insights
* (Future feature)
* ========================================================
  */

async generateCampusInsight(dataSummary) {


const prompt = `


Analyze the following campus issue statistics and provide
one useful insight for administrators.

Data:

${dataSummary}
`;


return this.sendRequest(prompt);


}

}

/**

* ==========================================================
* Singleton Export
* ==========================================================
  */

const gptService = new GPTService();

export default gptService;
