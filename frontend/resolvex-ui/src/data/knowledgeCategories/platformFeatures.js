/* ===================================================== */
/* RESOLVEX KNOWLEDGE MODULE — PLATFORM FEATURES */
/* ===================================================== */

/*
This module contains knowledge about the main features
of the ResolveX platform.

It helps the AI assistant answer questions related to:

• Issue Feed
• Upvoting System
• Leaderboard
• Notifications
• Priority Calculation
• AI Classification
• Duplicate Detection
• Issue Tracking

These entries help users understand how the platform works.
*/

/* ===================================================== */
/* KNOWLEDGE DATASET */
/* ===================================================== */

const platformFeatures = [

{
keywords: ["issue feed"],
question: "What is the Issue Feed in ResolveX?",
answer:
"The Issue Feed is a central page where all reported campus issues are displayed. Students can browse issues, view details, and upvote problems they are also experiencing."
},

{
keywords: ["public issues"],
question: "Why are issues visible to everyone?",
answer:
"ResolveX keeps issues public to improve transparency. When students can see reported problems, it helps identify widespread issues and ensures committees remain accountable."
},

{
keywords: ["upvote"],
question: "What does upvoting an issue mean?",
answer:
"Upvoting allows students to support an issue reported by someone else. When many students upvote a problem, it signals that the issue affects multiple people and should be prioritized."
},

{
keywords: ["multiple votes"],
question: "Can a student upvote the same issue multiple times?",
answer:
"No. Each student can upvote an issue only once. This prevents manipulation of issue priority."
},

{
keywords: ["issue priority"],
question: "How does ResolveX prioritize issues?",
answer:
"Issues are prioritized using a score calculated from several factors including student upvotes, issue severity, and the age of the issue."
},

{
keywords: ["priority formula"],
question: "What factors influence issue priority?",
answer:
"Issue priority is influenced by three main factors: the number of upvotes an issue receives, the severity level of the issue, and how long the issue has remained unresolved."
},

{
keywords: ["leaderboard"],
question: "What is the Leaderboard in ResolveX?",
answer:
"The Leaderboard highlights the most important or most supported issues on campus. It helps students and administrators quickly identify major problems."
},

{
keywords: ["notifications"],
question: "What notifications does ResolveX send?",
answer:
"ResolveX sends notifications when important events occur such as issue status updates, committee actions, or announcements from administrators."
},

{
keywords: ["issue update"],
question: "Will I be notified when my issue is resolved?",
answer:
"Yes. ResolveX can notify users when the status of their issue changes from pending to resolved."
},

{
keywords: ["duplicate issues"],
question: "What is duplicate issue detection?",
answer:
"Duplicate issue detection helps prevent the same problem from being reported multiple times. If a similar issue already exists, the system can suggest supporting the existing report."
},

{
keywords: ["ai classification"],
question: "What is AI issue classification?",
answer:
"ResolveX uses artificial intelligence to analyze issue descriptions and automatically determine the appropriate category such as food, hostel, hygiene, infrastructure, or discipline."
},

{
keywords: ["ai severity"],
question: "What is AI severity detection?",
answer:
"AI severity detection analyzes the issue description to estimate how serious the problem is. This helps the platform prioritize more urgent issues."
},

{
keywords: ["ai confidence"],
question: "What is AI confidence scoring?",
answer:
"AI confidence scoring measures how confident the system is about its classification of an issue. A higher confidence score means the AI is more certain about the category."
},

{
keywords: ["issue analytics"],
question: "What analytics does ResolveX provide?",
answer:
"ResolveX can generate analytics such as the number of issues reported, the most common problem categories, committee performance statistics, and resolution trends."
},

{
keywords: ["issue history"],
question: "Can I see past issues reported on campus?",
answer:
"Yes. The Issue Feed allows students to view previously reported issues and their resolution status."
},

{
keywords: ["issue status"],
question: "What does the issue status indicate?",
answer:
"Issue status indicates whether a problem is still pending or has been resolved by the responsible committee."
},

{
keywords: ["report tracking"],
question: "How does ResolveX track campus problems?",
answer:
"ResolveX tracks problems by storing issue reports in a centralized database. Each issue includes details such as description, category, images, upvotes, and status."
},

{
keywords: ["system transparency"],
question: "How does ResolveX improve transparency?",
answer:
"By showing issues publicly and tracking their progress, ResolveX ensures that campus problems cannot be ignored or hidden."
},

{
keywords: ["system efficiency"],
question: "How does ResolveX improve efficiency?",
answer:
"ResolveX improves efficiency by automatically routing issues to the correct committee and prioritizing problems using data-driven methods."
},

{
keywords: ["platform innovation"],
question: "Why is ResolveX different from traditional complaint systems?",
answer:
"Traditional complaint systems are often slow and opaque. ResolveX introduces transparency, community participation through voting, and AI-powered prioritization to improve problem resolution."
},

{
keywords: ["issue ranking"],
question: "How are top issues ranked?",
answer:
"Top issues are ranked based on their priority score, which considers upvotes, severity level, and issue age."
},

{
keywords: ["community involvement"],
question: "How does ResolveX encourage student participation?",
answer:
"Students participate by reporting issues, supporting existing reports through upvotes, and monitoring issue resolution."
},

{
keywords: ["campus insights"],
question: "How can ResolveX help administrators understand campus problems?",
answer:
"Administrators can analyze issue data to identify recurring problems, evaluate committee performance, and improve campus infrastructure."
}

];

/* ===================================================== */
/* EXPORT MODULE */
/* ===================================================== */

export default platformFeatures;
