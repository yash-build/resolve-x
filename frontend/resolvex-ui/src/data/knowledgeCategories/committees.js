/* ===================================================== */
/* RESOLVEX KNOWLEDGE MODULE — COMMITTEES */
/* ===================================================== */

/*
This module defines the responsibilities of campus committees
that resolve issues reported in ResolveX.

Students often ask questions like:

• Which committee handles food issues?
• Who fixes hostel problems?
• How are issues assigned?

This module helps the chatbot explain how committees work.
*/

/* ===================================================== */
/* KNOWLEDGE DATASET */
/* ===================================================== */

const committees = [

{
keywords: ["committee", "what are committees"],
question: "What are committees in ResolveX?",
answer:
"In ResolveX, committees are responsible groups that handle and resolve campus issues. Each committee focuses on a specific category of problems such as food quality, hostel maintenance, sanitation, infrastructure, or discipline."
},

{
keywords: ["issue assignment"],
question: "How are issues assigned to committees?",
answer:
"When a student reports an issue, the system assigns it to a committee based on the selected category. For example, food issues are routed to the Mess Committee while hostel issues are routed to the Hostel Committee."
},

{
keywords: ["food committee"],
question: "What is the Mess Committee?",
answer:
"The Mess Committee is responsible for food-related issues on campus. This includes food quality, hygiene in the mess, meal availability, kitchen cleanliness, and student food complaints."
},

{
keywords: ["mess problems"],
question: "What problems does the Mess Committee handle?",
answer:
"The Mess Committee handles problems such as poor food quality, insufficient food portions, unhygienic cooking conditions, irregular meal timings, and complaints related to dining facilities."
},

{
keywords: ["hostel committee"],
question: "What is the Hostel Committee?",
answer:
"The Hostel Committee is responsible for resolving issues related to hostel living conditions including electricity problems, plumbing failures, broken furniture, damaged rooms, or poor hostel maintenance."
},

{
keywords: ["hostel maintenance"],
question: "What types of hostel issues can be reported?",
answer:
"Hostel issues include broken fans, faulty lights, water leakage, plumbing problems, damaged beds or cupboards, and other maintenance concerns inside hostel buildings."
},

{
keywords: ["sanitation committee"],
question: "What is the Sanitation Committee?",
answer:
"The Sanitation Committee handles campus cleanliness and hygiene problems. They ensure that washrooms, corridors, hostels, and public spaces remain clean and hygienic."
},

{
keywords: ["cleanliness issues"],
question: "What issues does the Sanitation Committee resolve?",
answer:
"The Sanitation Committee addresses problems such as dirty washrooms, garbage accumulation, poor waste disposal systems, and unclean campus areas."
},

{
keywords: ["maintenance committee"],
question: "What is the Maintenance Committee?",
answer:
"The Maintenance Committee handles infrastructure problems on campus including broken furniture, damaged classrooms, electrical failures, lighting issues, and structural repairs."
},

{
keywords: ["infrastructure problems"],
question: "What infrastructure issues can be reported?",
answer:
"Infrastructure issues include broken desks, malfunctioning projectors, damaged classroom equipment, unsafe buildings, faulty lighting, and other facility problems."
},

{
keywords: ["disciplinary committee"],
question: "What is the Disciplinary Committee?",
answer:
"The Disciplinary Committee is responsible for handling rule violations, misconduct, harassment complaints, and maintaining discipline within the campus."
},

{
keywords: ["discipline problems"],
question: "What problems are handled by the Disciplinary Committee?",
answer:
"The Disciplinary Committee addresses misconduct, rule violations, harassment complaints, bullying incidents, and other behavioral issues affecting campus safety."
},

{
keywords: ["committee responsibility"],
question: "Why are committees important in ResolveX?",
answer:
"Committees ensure that each category of campus problem is handled by the appropriate group. This specialization allows faster and more efficient issue resolution."
},

{
keywords: ["committee efficiency"],
question: "How does ResolveX track committee performance?",
answer:
"ResolveX can analyze metrics such as the number of issues resolved, average resolution time, and unresolved issue backlog to evaluate committee performance."
},

{
keywords: ["committee accountability"],
question: "How does ResolveX improve committee accountability?",
answer:
"Because all issues are tracked publicly in the issue feed, committees are accountable for resolving assigned problems. Administrators can monitor their performance through analytics."
},

{
keywords: ["committee delays"],
question: "What happens if a committee delays resolving an issue?",
answer:
"If issues remain unresolved for a long time, administrators can identify the delay through the platform's analytics and take corrective actions."
},

{
keywords: ["committee collaboration"],
question: "Can multiple committees work on one issue?",
answer:
"In some cases an issue may require coordination between committees. For example, a hostel sanitation problem may involve both the Hostel Committee and the Sanitation Committee."
},

{
keywords: ["committee workflow"],
question: "What is the committee workflow in ResolveX?",
answer:
"The committee workflow begins when an issue is assigned to the relevant committee. The committee reviews the problem, takes corrective action, and updates the issue status once the problem is resolved."
},

{
keywords: ["committee communication"],
question: "How do committees know about new issues?",
answer:
"When a new issue is assigned to a committee, the platform can notify committee members so they can review and address the problem quickly."
},

{
keywords: ["committee resolution"],
question: "How do committees mark issues as resolved?",
answer:
"Once a committee fixes the reported problem, they update the issue status in the platform to 'resolved'. This signals that the problem has been addressed."
},

{
keywords: ["committee analytics"],
question: "What analytics are available for committees?",
answer:
"Administrators can view statistics such as total issues handled by each committee, resolution time, pending issues, and overall efficiency."
},

{
keywords: ["committee improvement"],
question: "How does ResolveX help committees improve their work?",
answer:
"By tracking issues and resolution times, ResolveX helps committees identify recurring problems and improve maintenance strategies."
},

{
keywords: ["committee transparency"],
question: "How does ResolveX make committees more transparent?",
answer:
"ResolveX provides a public issue feed where students can see reported problems and their status. This transparency ensures committees remain accountable."
}

];

/* ===================================================== */
/* EXPORT MODULE */
/* ===================================================== */

export default committees;
