/* ===================================================== */
/* RESOLVEX KNOWLEDGE MODULE — BASICS */
/* ===================================================== */

/*
This module contains foundational knowledge about ResolveX.

Purpose:
Provide the AI assistant with structured information about:

• What ResolveX is
• Why it exists
• How the platform works
• Platform goals
• Campus governance improvements

These entries help the chatbot answer general questions
about the platform.

Each entry includes:

keywords → used for context matching
question → example user query
answer → authoritative system explanation

This module should eventually contain ~80 questions.
*/

/* ===================================================== */
/* KNOWLEDGE DATASET */
/* ===================================================== */

const resolvexBasics = [

{
keywords: ["resolvex", "what is resolvex", "platform"],
question: "What is ResolveX?",
answer:
"ResolveX is a campus governance platform designed to help students report issues, track campus problems, and ensure that committees resolve them efficiently. It creates a transparent workflow where problems are reported, prioritized by student votes, assigned to responsible committees, and monitored by administrators."
},

{
keywords: ["purpose", "why resolvex"],
question: "Why was ResolveX created?",
answer:
"ResolveX was created to solve the common problem of unreported or ignored campus issues. Many colleges experience maintenance, hygiene, food, and infrastructure problems that remain unresolved due to lack of proper reporting systems. ResolveX provides a structured platform that ensures every issue is tracked and addressed."
},

{
keywords: ["how resolvex works", "workflow"],
question: "How does ResolveX work?",
answer:
"ResolveX follows a transparent workflow. Students report issues on the platform, other students can upvote them, the system calculates issue priority, and the issue is routed to the responsible committee. Committees then resolve the issue while administrators monitor the progress through analytics."
},

{
keywords: ["students role"],
question: "What role do students play in ResolveX?",
answer:
"Students are the primary reporters of campus issues in ResolveX. They can submit problems, attach images, describe the situation, and upvote issues reported by others. Their participation helps prioritize the most important campus problems."
},

{
keywords: ["committee role"],
question: "What do committees do in ResolveX?",
answer:
"Committees are responsible for resolving issues reported by students. Each committee handles a specific category such as food, hostel, hygiene, infrastructure, or discipline. The system routes issues to the appropriate committee automatically."
},

{
keywords: ["admin role"],
question: "What do administrators do in ResolveX?",
answer:
"Administrators monitor the entire platform. They can track issue statistics, evaluate committee performance, analyze campus problems, and ensure that the platform operates smoothly."
},

{
keywords: ["authority role"],
question: "What is the authority role in ResolveX?",
answer:
"Authorities represent higher-level institutional oversight such as college management or governing bodies. They can review platform analytics, track major campus problems, and ensure accountability across committees."
},

{
keywords: ["campus governance"],
question: "What is campus governance in ResolveX?",
answer:
"Campus governance refers to the system of managing and resolving operational problems within a college campus. ResolveX improves campus governance by making issue reporting transparent, organized, and data-driven."
},

{
keywords: ["issue system"],
question: "What is the issue reporting system in ResolveX?",
answer:
"The issue reporting system allows students to submit problems they encounter on campus. These issues include details such as title, description, category, and optional images. The system then processes and prioritizes them."
},

{
keywords: ["transparency"],
question: "How does ResolveX improve transparency?",
answer:
"ResolveX improves transparency by making campus issues visible in a public issue feed. Students can see reported problems, track their progress, and verify whether committees resolve them."
},

{
keywords: ["priority system"],
question: "How are issues prioritized in ResolveX?",
answer:
"ResolveX calculates issue priority using a combination of factors such as student upvotes, severity level, and how long the issue has been unresolved. This ensures that the most critical problems receive attention first."
},

{
keywords: ["upvotes"],
question: "Why can students upvote issues?",
answer:
"Upvoting allows students to collectively signal which problems affect the largest number of people. Issues with higher upvotes gain higher priority and are addressed faster."
},

{
keywords: ["campus os"],
question: "What is the long-term vision of ResolveX?",
answer:
"The long-term vision of ResolveX is to evolve into a Campus Operating System. This means it will manage campus governance, issue tracking, analytics, communication, and administrative decision-making in a single integrated platform."
},

{
keywords: ["platform benefits"],
question: "What benefits does ResolveX provide to colleges?",
answer:
"ResolveX helps colleges maintain better campus operations by identifying recurring problems, improving response time for issues, increasing accountability among committees, and providing valuable analytics for administrators."
},

{
keywords: ["campus problems"],
question: "What types of problems can ResolveX handle?",
answer:
"ResolveX can handle many types of campus issues including hostel maintenance problems, poor mess food quality, sanitation concerns, broken infrastructure, and disciplinary issues."
},

{
keywords: ["public feed"],
question: "What is the public issue feed?",
answer:
"The public issue feed displays all reported campus problems in a central list. Students can view the feed to understand what problems exist and which issues are receiving the most attention."
},

{
keywords: ["issue lifecycle"],
question: "What is the lifecycle of an issue in ResolveX?",
answer:
"An issue begins when a student reports it. Other students may upvote the issue. The system prioritizes it and assigns it to the responsible committee. The committee resolves the issue, after which the issue status is updated to resolved."
},

{
keywords: ["campus improvement"],
question: "How does ResolveX improve campus life?",
answer:
"ResolveX improves campus life by ensuring that student concerns are heard and addressed. By tracking problems and enforcing accountability, it helps create a cleaner, safer, and more responsive campus environment."
}

];

/* ===================================================== */
/* EXPORT MODULE */
/* ===================================================== */

export default resolvexBasics;
