/* ===================================================== */
/* RESOLVEX KNOWLEDGE MODULE — ADMIN HELP */
/* ===================================================== */

/*
This module provides knowledge for administrators and
campus authorities who manage the ResolveX platform.

The AI assistant uses this dataset to answer questions about:

• platform monitoring
• issue analytics
• committee performance
• campus governance insights
• administrative actions
*/

/* ===================================================== */
/* KNOWLEDGE DATASET */
/* ===================================================== */

const adminHelp = [

{
keywords: ["admin role", "administrator role"],
question: "What is the role of administrators in ResolveX?",
answer:
"Administrators oversee the ResolveX platform and monitor campus issues. They review analytics, evaluate committee performance, manage platform settings, and ensure that reported problems are resolved efficiently."
},

{
keywords: ["admin dashboard"],
question: "What is the Admin Dashboard?",
answer:
"The Admin Dashboard is a central control panel that allows administrators to monitor the entire platform. It displays statistics about reported issues, resolution rates, committee performance, and campus problem trends."
},

{
keywords: ["platform monitoring"],
question: "How do administrators monitor the platform?",
answer:
"Administrators monitor the platform through analytics dashboards that show issue counts, resolution times, committee efficiency, and recurring campus problems."
},

{
keywords: ["committee monitoring"],
question: "How can administrators track committee performance?",
answer:
"ResolveX provides performance metrics for committees including the number of issues assigned, resolved issues, average resolution time, and pending issues."
},

{
keywords: ["issue analytics"],
question: "What analytics does ResolveX provide to administrators?",
answer:
"ResolveX analytics can show total issues reported, category distribution, resolution rates, committee efficiency, and recurring campus problems."
},

{
keywords: ["issue trends"],
question: "How can administrators identify recurring campus problems?",
answer:
"Administrators can analyze issue data across categories to detect recurring problems such as repeated hostel maintenance issues or consistent food complaints."
},

{
keywords: ["decision making"],
question: "How does ResolveX help administrators make decisions?",
answer:
"ResolveX provides data-driven insights about campus operations. By analyzing issue patterns and committee performance, administrators can prioritize improvements and allocate resources effectively."
},

{
keywords: ["campus insights"],
question: "What insights can administrators gain from ResolveX?",
answer:
"Administrators can understand which campus areas experience the most problems, which committees perform well, and which issues remain unresolved for long periods."
},

{
keywords: ["committee accountability"],
question: "How does ResolveX improve accountability?",
answer:
"ResolveX improves accountability by publicly tracking issues and their resolution status. Administrators can easily identify delays or inefficiencies in issue resolution."
},

{
keywords: ["issue escalation"],
question: "What happens if an issue is not resolved for a long time?",
answer:
"If an issue remains unresolved, administrators can review the situation, contact the responsible committee, and escalate the problem for faster resolution."
},

{
keywords: ["admin actions"],
question: "What actions can administrators take on the platform?",
answer:
"Administrators can monitor issues, analyze data, review reports, remove invalid issues, publish announcements, and evaluate committee performance."
},

{
keywords: ["issue verification"],
question: "Can administrators verify reported issues?",
answer:
"Yes. Administrators can review issue reports to verify authenticity and remove spam or misleading reports."
},

{
keywords: ["policy updates"],
question: "Can administrators post announcements?",
answer:
"Yes. Administrators can publish announcements related to maintenance, campus policies, or important updates."
},

{
keywords: ["platform management"],
question: "How do administrators manage the ResolveX system?",
answer:
"Administrators manage the platform by monitoring analytics, reviewing reported issues, managing committees, and ensuring that the system operates smoothly."
},

{
keywords: ["data insights"],
question: "Why is data important for campus governance?",
answer:
"Data allows administrators to identify patterns, detect major campus problems, and make informed decisions to improve campus infrastructure and student life."
},

{
keywords: ["administrative benefits"],
question: "How does ResolveX benefit administrators?",
answer:
"ResolveX provides administrators with real-time visibility into campus issues, enabling faster decision-making and more efficient management of campus operations."
},

{
keywords: ["committee efficiency"],
question: "How can administrators improve committee efficiency?",
answer:
"Administrators can analyze resolution times, review pending issues, and provide additional resources or guidance to committees that are underperforming."
},

{
keywords: ["platform transparency"],
question: "How does ResolveX improve transparency for administrators?",
answer:
"ResolveX allows administrators to see all issues and their progress in one place, ensuring that campus operations remain transparent and accountable."
},

{
keywords: ["governance improvement"],
question: "How does ResolveX improve campus governance?",
answer:
"ResolveX transforms campus governance from a reactive system into a proactive one by providing structured issue tracking, analytics, and accountability."
}

];

/* ===================================================== */
/* EXPORT MODULE */
/* ===================================================== */

export default adminHelp;
