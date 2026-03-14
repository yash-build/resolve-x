// src/services/chatbotService.js

import campusKnowledge from "../data/campusKnowledge"

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
}

function scoreMatch(userInput, keywords) {
  let score = 0

  keywords.forEach((keyword) => {
    if (userInput.includes(keyword)) {
      score += 1
    }
  })

  return score
}

export function getBotResponse(message) {

  const cleaned = normalize(message)

  let bestMatch = null
  let highestScore = 0

  campusKnowledge.forEach((item) => {

    const score = scoreMatch(cleaned, item.keywords)

    if (score > highestScore) {
      highestScore = score
      bestMatch = item
    }

  })

  if (bestMatch && highestScore > 0) {
    return bestMatch.response
  }

  return `I'm not completely sure about that.

You can try one of these options:

• Contact the **Student Help Desk**
• Visit the **Academic Office**
• Submit a request through **ResolveX Issue Reporting**

If you'd like, I can guide you to the issue reporting page.`
}