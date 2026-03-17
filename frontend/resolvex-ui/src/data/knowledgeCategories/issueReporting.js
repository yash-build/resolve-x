/* ===================================================== */
/* RESOLVEX KNOWLEDGE MODULE — ISSUE REPORTING */
/* ===================================================== */

/*
This module contains knowledge related to reporting issues
in the ResolveX platform.

It helps the AI assistant answer questions like:

• How do I report an issue?
• Can I upload images?
• What categories exist?
• What happens after submitting an issue?

This module is one of the most important datasets for
the chatbot because many students will ask about
reporting and tracking issues.
*/

/* ===================================================== */
/* KNOWLEDGE DATASET */
/* ===================================================== */

const issueReporting = [

{
keywords: ["report issue", "submit issue", "create issue"],
question: "How do I report an issue in ResolveX?",
answer:
"To report an issue, navigate to the Report Issue page in the ResolveX platform. Enter a title describing the problem, provide a detailed description, select the appropriate category, optionally upload images, and submit the issue."
},

{
keywords: ["where report issue"],
question: "Where can I report a campus problem?",
answer:
"You can report campus problems using the Report Issue page in ResolveX. This page allows students to submit complaints related to hostel, food, hygiene, infrastructure, or discipline."
},

{
keywords: ["issue title"],
question: "What should I write in the issue title?",
answer:
"The issue title should be short and clearly describe the problem. For example, 'Broken fan in hostel room' or 'Poor food quality in mess'."
},

{
keywords: ["issue description"],
question: "How detailed should the issue description be?",
answer:
"The issue description should explain the problem clearly. Include details such as location, how long the issue has existed, and how it affects students."
},

{
keywords: ["image upload"],
question: "Can I upload images with an issue?",
answer:
"Yes. ResolveX allows students to upload up to two images when reporting an issue. Images help committees understand the problem better and verify the situation."
},

{
keywords: ["image limit"],
question: "How many images can I upload with an issue?",
answer:
"You can upload a maximum of two images per issue in ResolveX."
},

{
keywords: ["issue categories"],
question: "What categories can I choose when reporting an issue?",
answer:
"ResolveX supports multiple categories including Hostel, Food, Hygiene, Infrastructure, and Discipline."
},

{
keywords: ["hostel issues"],
question: "What problems fall under hostel issues?",
answer:
"Hostel issues include broken fans, plumbing problems, electricity failures, damaged furniture, or poor hostel maintenance."
},

{
keywords: ["food issues"],
question: "What problems fall under food issues?",
answer:
"Food issues include poor food quality, unhygienic cooking conditions, insufficient food portions, or irregular mess timings."
},

{
keywords: ["hygiene issues"],
question: "What problems fall under hygiene issues?",
answer:
"Hygiene issues include dirty washrooms, garbage accumulation, poor sanitation, or unclean campus areas."
},

{
keywords: ["infrastructure issues"],
question: "What problems fall under infrastructure issues?",
answer:
"Infrastructure issues include broken classroom equipment, damaged buildings, faulty lighting, or unsafe campus structures."
},

{
keywords: ["discipline issues"],
question: "What problems fall under discipline issues?",
answer:
"Discipline issues include rule violations, misconduct, harassment complaints, or behavior problems within the campus."
},

{
keywords: ["issue submission"],
question: "What happens after I submit an issue?",
answer:
"After submission, the issue appears in the public issue feed where other students can view and upvote it. The system then prioritizes the issue and assigns it to the responsible committee."
},

{
keywords: ["issue routing"],
question: "How does ResolveX assign issues to committees?",
answer:
"ResolveX automatically assigns issues to committees based on the selected category. For example, food issues go to the Mess Committee and hostel issues go to the Hostel Committee."
},

{
keywords: ["issue status"],
question: "What statuses can an issue have?",
answer:
"Issues in ResolveX usually have two statuses: pending and resolved. Pending means the issue is still being addressed, while resolved means the problem has been fixed."
},

{
keywords: ["track issue"],
question: "How can I track my issue?",
answer:
"You can track your submitted issues in the My Issues page where the platform shows their status and progress."
},

{
keywords: ["issue visibility"],
question: "Can other students see my issue?",
answer:
"Yes. Issues are displayed in the public issue feed so that students can see reported problems and upvote them if they face the same issue."
},

{
keywords: ["duplicate issue"],
question: "What happens if the same issue is reported multiple times?",
answer:
"ResolveX includes a duplicate issue detection system that warns users if a similar issue already exists. Students can choose to support the existing issue instead of creating a duplicate."
},

{
keywords: ["edit issue"],
question: "Can I edit my issue after submitting it?",
answer:
"Depending on platform rules, users may be able to edit the issue description or add additional information if the issue has not yet been resolved."
},

{
keywords: ["issue removal"],
question: "Can I delete my issue?",
answer:
"In most cases issues cannot be deleted to maintain transparency. However administrators may remove invalid or spam issues."
},

{
keywords: ["anonymous report"],
question: "Can issues be reported anonymously?",
answer:
"ResolveX typically associates issues with the reporting user account to maintain accountability and prevent misuse."
},

{
keywords: ["severity"],
question: "What does issue severity mean?",
answer:
"Issue severity represents how serious a problem is. High severity issues may affect safety or many students and therefore receive higher priority."
},

{
keywords: ["issue priority"],
question: "How does the system prioritize issues?",
answer:
"Issue priority is calculated using factors such as student upvotes, severity level, and how long the issue has been unresolved."
},

{
keywords: ["issue resolution"],
question: "Who resolves reported issues?",
answer:
"Issues are resolved by the committee responsible for the category of the problem."
},

{
keywords: ["issue feed"],
question: "Where can I see all reported issues?",
answer:
"All reported issues appear in the Issue Feed page, which lists problems reported by students across the campus."
},

{
keywords: ["issue proof"],
question: "Why should I upload images when reporting an issue?",
answer:
"Images provide visual proof of the problem and help committees understand the situation quickly."
},

{
keywords: ["issue time"],
question: "How long does it take for an issue to be resolved?",
answer:
"Resolution time depends on the severity and complexity of the problem. However ResolveX helps reduce delays by prioritizing important issues."
},

{
keywords: ["issue accuracy"],
question: "Why should issue descriptions be accurate?",
answer:
"Accurate descriptions help committees diagnose problems faster and reduce misunderstandings during the resolution process."
},

{
keywords: ["issue misuse"],
question: "What happens if someone reports a fake issue?",
answer:
"Administrators can review and remove fake or misleading reports. Users who repeatedly misuse the system may face restrictions."
},

{
keywords: ["issue voting"],
question: "Why should students support issues reported by others?",
answer:
"When students upvote issues, the platform identifies which problems affect the most people and prioritizes them accordingly."
}

];

/* ===================================================== */
/* EXPORT MODULE */
/* ===================================================== */

export default issueReporting;
