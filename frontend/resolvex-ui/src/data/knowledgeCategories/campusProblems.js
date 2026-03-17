/* ===================================================== */
/* RESOLVEX KNOWLEDGE MODULE — CAMPUS PROBLEMS */
/* ===================================================== */

/*
This module contains common real-world campus problems.

The chatbot uses this knowledge to understand and respond
to practical issues students may report.

Topics include:

• hostel maintenance
• mess food complaints
• hygiene issues
• infrastructure damage
• discipline concerns
*/

/* ===================================================== */
/* KNOWLEDGE DATASET */
/* ===================================================== */

const campusProblems = [

{
keywords: ["broken fan", "fan not working"],
question: "What should I do if a hostel fan is not working?",
answer:
"If a hostel fan is not working, report the issue through the Report Issue page and select the Hostel category. The Hostel Committee will review the problem and arrange maintenance."
},

{
keywords: ["water leakage"],
question: "What should I do if there is water leakage in the hostel?",
answer:
"Water leakage should be reported as a hostel maintenance issue. Provide the location and description so the Hostel Committee can fix the plumbing problem."
},

{
keywords: ["electricity problem"],
question: "What should I do if electricity is not working in my room?",
answer:
"Electricity problems should be reported under the Hostel or Infrastructure category depending on the location. Maintenance staff will be assigned to resolve the issue."
},

{
keywords: ["dirty washroom"],
question: "What should I do if the washroom is dirty?",
answer:
"Dirty washrooms should be reported under the Hygiene category. The Sanitation Committee will take action to clean and maintain the facility."
},

{
keywords: ["garbage"],
question: "What should I do if garbage is not collected on campus?",
answer:
"Garbage accumulation should be reported as a Hygiene issue so the sanitation team can arrange proper waste disposal."
},

{
keywords: ["bad food"],
question: "What should I do if the mess food quality is poor?",
answer:
"Food quality complaints should be reported under the Food category. The Mess Committee will review the issue and investigate the complaint."
},

{
keywords: ["mess hygiene"],
question: "What should I do if the mess kitchen is unhygienic?",
answer:
"Unhygienic kitchen conditions should be reported as a Food or Hygiene issue so the Mess Committee can inspect the situation."
},

{
keywords: ["insufficient food"],
question: "What should I do if food portions are insufficient in the mess?",
answer:
"Students can report insufficient food portions as a Food issue. If multiple students support the report, the issue will receive higher priority."
},

{
keywords: ["broken desk"],
question: "What should I do if a classroom desk is broken?",
answer:
"Broken classroom furniture should be reported as an Infrastructure issue so the Maintenance Committee can repair or replace it."
},

{
keywords: ["projector not working"],
question: "What should I do if the classroom projector is not working?",
answer:
"Classroom equipment problems such as projectors should be reported under the Infrastructure category."
},

{
keywords: ["classroom lighting"],
question: "What should I do if classroom lights are not working?",
answer:
"Lighting problems should be reported under the Infrastructure category so the Maintenance Committee can fix the issue."
},

{
keywords: ["unsafe building"],
question: "What should I do if a building structure looks unsafe?",
answer:
"Unsafe structures should be reported immediately under the Infrastructure category so administrators can take urgent action."
},

{
keywords: ["discipline complaint"],
question: "What should I do if I want to report a discipline problem?",
answer:
"Discipline-related complaints should be reported under the Discipline category so the Disciplinary Committee can review the situation."
},

{
keywords: ["harassment complaint"],
question: "What should I do if I experience harassment on campus?",
answer:
"Harassment complaints should be reported under the Discipline category. The Disciplinary Committee will review the report confidentially."
},

{
keywords: ["campus safety"],
question: "What should I do if I notice a safety risk on campus?",
answer:
"Safety risks should be reported immediately through the platform so the responsible authorities can investigate and address the danger."
},

{
keywords: ["hostel cleanliness"],
question: "What should I do if hostel corridors are dirty?",
answer:
"Dirty hostel corridors should be reported as a Hygiene issue so the sanitation team can clean the area."
},

{
keywords: ["water supply"],
question: "What should I do if water supply is interrupted?",
answer:
"Water supply problems should be reported under the Hostel or Infrastructure category so maintenance staff can investigate."
},

{
keywords: ["campus lighting"],
question: "What should I do if campus street lights are not working?",
answer:
"Street lighting problems should be reported under the Infrastructure category for maintenance repair."
},

{
keywords: ["broken door"],
question: "What should I do if a hostel door lock is broken?",
answer:
"A broken door lock should be reported as a Hostel maintenance issue so it can be repaired quickly."
},

{
keywords: ["internet problem"],
question: "What should I do if campus internet is not working?",
answer:
"Internet connectivity problems can be reported under the Infrastructure category so the technical team can investigate."
}

];

/* ===================================================== */
/* EXPORT MODULE */
/* ===================================================== */

export default campusProblems;
