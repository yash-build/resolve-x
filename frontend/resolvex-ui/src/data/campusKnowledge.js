const campusKnowledge = [

/* =============================
   GREETING
============================= */

{
intent: "greeting",
keywords: ["hi","hello","hey","good morning","good evening"],
response:
`Hello! 👋 I'm the ResolveX Campus Assistant.

You can ask me about:

• WiFi issues
• Mess timings
• Hostel maintenance
• Leave applications
• Library info
• Reporting campus problems

How can I help you today?`
},

/* =============================
   WIFI
============================= */

{
intent: "wifi_issue",
category: "Infrastructure",
keywords: [
"wifi",
"internet",
"network",
"wifi not working",
"internet slow",
"lan problem"
],
response:
`It looks like you're facing a **WiFi problem**.

Try these steps:

1️⃣ Reconnect to the network  
2️⃣ Restart your device  
3️⃣ Contact IT support if needed

Would you like to report this issue?`
},

/* =============================
   MESS TIMINGS
============================= */

{
intent: "mess_timing",
keywords: ["mess timing","breakfast","lunch","dinner","food timing"],
response:
`🍽 Mess Timings

Breakfast → 7–9 AM  
Lunch → 12–2 PM  
Dinner → 7–9 PM`
},

/* =============================
   FOOD COMPLAINT
============================= */

{
intent: "food_issue",
category: "Food",
keywords: [
"bad food",
"spoiled food",
"mess complaint",
"food quality"
],
response:
`It seems like you're reporting a **mess food issue**.

Would you like to submit a complaint to the Mess Committee?`
},

/* =============================
   HOSTEL ISSUE
============================= */

{
intent: "hostel_issue",
category: "Hostel",
keywords: [
"hostel problem",
"fan not working",
"water leakage",
"electricity hostel"
],
response:
`It looks like a **hostel maintenance issue**.

You can report this to the Hostel Committee through ResolveX.`
},

/* =============================
   LIBRARY
============================= */

{
intent: "library",
keywords: ["library timing","library open","study room"],
response:
`📚 Library Hours

8:00 AM – 8:00 PM

Facilities include:

• Study rooms
• Book borrowing
• Digital resources`
},

/* =============================
   LEAVE APPLICATION
============================= */

{
intent: "leave",
keywords: ["leave application","apply leave","absence"],
response:
`To apply for leave:

1️⃣ Write an application  
2️⃣ Submit to your department office  
3️⃣ Inform your class coordinator`
},

/* =============================
   FEES
============================= */

{
intent: "fees",
keywords: ["fees payment","tuition fees","pay fees"],
response:
`For fee payments please visit the **Accounts Office** or use the college fee portal.`
},

/* =============================
   EXAMS
============================= */

{
intent: "exam",
keywords: ["exam schedule","semester exam","exam date"],
response:
`Exam schedules are announced by the Academic Office.

Check:

• Department notice board  
• Official announcements`
}

]

export default campusKnowledge