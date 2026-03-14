import React, { useState, useEffect, useRef } from "react";

/*
============================================================
ResolveX Advanced Campus Assistant
Version: 4.0
============================================================

Architecture

User Message
      ↓
Input Sanitization
      ↓
Intent Detection
      ↓
Keyword Scoring Engine
      ↓
Synonym Matching
      ↓
Knowledge Base Search
      ↓
Context Memory Check
      ↓
Response Generator
      ↓
UI Rendering

============================================================
*/


function Chatbot() {

  /* =====================================================
     STATE MANAGEMENT
  ===================================================== */

  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text:
        "Hello! 👋 I'm the ResolveX Campus Assistant.\n\nYou can ask me about:\n• WiFi problems\n• Mess timings\n• Hostel maintenance\n• Exams\n• Reporting campus issues\n\nHow can I help you today?",
      time: new Date()
    }
  ]);

  const [input, setInput] = useState("");

  const [isTyping, setIsTyping] = useState(false);

  const [conversationContext, setConversationContext] = useState(null);

  const chatEndRef = useRef(null);



  /* =====================================================
     AUTO SCROLL TO LATEST MESSAGE
  ===================================================== */

  useEffect(() => {

    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }

  }, [messages]);



  /* =====================================================
     TEXT NORMALIZER
  ===================================================== */

  const normalizeText = (text) => {

    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .trim();

  };



  /* =====================================================
     SYNONYM ENGINE
  ===================================================== */

  const synonymMap = {

    wifi: ["wifi","internet","network","lan","router","campus internet"],

    mess: ["mess","canteen","food","meal","dining"],

    hostel: ["hostel","room","dorm","accommodation"],

    exam: ["exam","test","semester","midterm","final"],

    library: ["library","books","study room"],

    leave: ["leave","absence","permission"],

    fees: ["fees","payment","tuition","semester fees"],

    discipline: ["ragging","harassment","fight","complaint"]

  };



  /* =====================================================
     CAMPUS KNOWLEDGE BASE
     (Expandable to 500+ questions)
  ===================================================== */

  const knowledgeBase = [

    {
      intent: "greeting",
      keywords: ["hi","hello","hey","good morning","good evening"],
      response:
`Hello! 👋

I'm the ResolveX Campus Assistant.

I can help you with:

• WiFi and technical issues
• Hostel and infrastructure problems
• Mess timings and food complaints
• Academic information
• Reporting campus issues

How can I assist you today?`
    },



    {
      intent: "wifi_issue",
      keywords: synonymMap.wifi,
      response:
`If the campus WiFi is not working:

1️⃣ Reconnect to the network  
2️⃣ Restart your device  
3️⃣ Check if others are facing the issue  

If the problem continues, contact **IT Support** or report the issue in ResolveX under **Infrastructure category**.`
    },



    {
      intent: "mess_timing",
      keywords: ["mess timing","food timing","breakfast","lunch","dinner"],
      response:
`🍽 Campus Mess Timings

Breakfast → 7:00 AM – 9:00 AM  
Lunch → 12:00 PM – 2:00 PM  
Dinner → 7:00 PM – 9:00 PM

If food quality is poor, report it through ResolveX under **Food category**.`
    },



    {
      intent: "food_issue",
      keywords: ["bad food","spoiled food","mess complaint","food quality"],
      response:
`To report a mess food issue:

1️⃣ Open ResolveX  
2️⃣ Click **Report Issue**  
3️⃣ Choose **Food category**  
4️⃣ Describe the problem

The issue will be sent to the **Mess Committee**.`
    },



    {
      intent: "hostel_issue",
      keywords: synonymMap.hostel,
      response:
`Hostel issues such as:

• Fan not working
• Water leakage
• Electricity problems

can be reported in ResolveX under **Hostel category**.`
    },



    {
      intent: "library_info",
      keywords: synonymMap.library,
      response:
`📚 Library Information

Opening Hours:
8:00 AM – 8:00 PM

Facilities include:

• Study areas
• Book borrowing
• Digital resources

Contact the **Library Office** for additional help.`
    },



    {
      intent: "leave_application",
      keywords: synonymMap.leave,
      response:
`To apply for leave:

1️⃣ Write an application  
2️⃣ Submit to your **department office**  
3️⃣ Inform your **class coordinator**

Hostel leave requires **warden approval**.`
    },



    {
      intent: "fees_payment",
      keywords: synonymMap.fees,
      response:
`For fee payments:

Visit the **Accounts Office** or use the **college payment portal**.

Keep your **Student ID** ready while making payments.`
    },



    {
      intent: "exam_schedule",
      keywords: synonymMap.exam,
      response:
`Exam schedules are released by the **Academic Office**.

Check:

• College website
• Department notice board
• Academic announcements`
    }

  ];



  /* =====================================================
     KEYWORD SCORING ENGINE
  ===================================================== */

  const calculateScore = (input, keywords) => {

    let score = 0;

    keywords.forEach(keyword => {

      if (input.includes(keyword)) {
        score += 1;
      }

    });

    return score;
  };



  /* =====================================================
     RESPONSE GENERATION ENGINE
  ===================================================== */

  const generateResponse = (message) => {

    const cleanedInput = normalizeText(message);

    let bestMatch = null;
    let highestScore = 0;

    knowledgeBase.forEach(item => {

      const score = calculateScore(cleanedInput, item.keywords);

      if (score > highestScore) {

        highestScore = score;
        bestMatch = item;

      }

    });



    if (bestMatch) {

      setConversationContext(bestMatch.intent);

      return bestMatch.response;

    }



    /* CONTEXTUAL FOLLOW UPS */

    if (conversationContext === "food_issue" && cleanedInput.includes("how")) {

      return `To report a food complaint:

Open ResolveX → Report Issue → Food category → describe the issue.`;

    }



    return `I'm not completely sure about that.

You can try asking about:

• WiFi problems
• Mess timings
• Hostel issues
• Leave applications
• Library information
• Reporting campus complaints`;
  };



  /* =====================================================
     MESSAGE SEND SYSTEM
  ===================================================== */

  const sendMessage = () => {

    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      text: input,
      time: new Date()
    };



    setMessages(prev => [...prev, userMessage]);

    setInput("");



    setIsTyping(true);



    setTimeout(() => {

      const botReply = {

        sender: "bot",

        text: generateResponse(userMessage.text),

        time: new Date()

      };



      setMessages(prev => [...prev, botReply]);

      setIsTyping(false);

    }, 700);

  };



  /* =====================================================
     UI RENDER
  ===================================================== */

  return (

    <>

      {/* Floating Button */}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg"
      >
        💬
      </button>



      {isOpen && (

        <div className="fixed bottom-20 right-6 w-80 h-[500px] bg-white shadow-xl rounded-lg flex flex-col">

          {/* Header */}

          <div className="bg-indigo-600 text-white p-3 rounded-t-lg font-semibold">

            ResolveX Assistant

          </div>



          {/* Chat Messages */}

          <div className="flex-1 overflow-y-auto p-3 space-y-2">

            {messages.map((msg, index) => (

              <div
                key={index}
                className={`p-2 rounded max-w-xs whitespace-pre-line ${
                  msg.sender === "user"
                    ? "bg-indigo-500 text-white ml-auto"
                    : "bg-gray-200 text-black"
                }`}
              >

                {msg.text}

                <div className="text-[10px] opacity-60 mt-1">

                  {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}

                </div>

              </div>

            ))}



            {isTyping && (

              <div className="bg-gray-200 text-black p-2 rounded max-w-xs">

                typing...

              </div>

            )}



            <div ref={chatEndRef}></div>

          </div>



          {/* Input Area */}

          <div className="flex border-t">

            <input
              className="flex-1 p-2 outline-none"
              placeholder="Ask something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {

                if (e.key === "Enter") {

                  sendMessage();

                }

              }}
            />



            <button
              onClick={sendMessage}
              className="bg-indigo-600 text-white px-4"
            >
              Send
            </button>

          </div>

        </div>

      )}

    </>

  );

}



export default Chatbot;