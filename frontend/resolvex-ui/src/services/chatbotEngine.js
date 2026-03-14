import campusKnowledge from "../data/campusKnowledge"



function normalize(text){

return text
.toLowerCase()
.replace(/[^\w\s]/g,"")
.trim()

}



function calculateScore(input,keywords){

let score=0

keywords.forEach(word=>{

if(input.includes(word)){

score++

}

})

return score

}



export function processMessage(message){

const cleaned=normalize(message)

let bestMatch=null
let highestScore=0



campusKnowledge.forEach(item=>{

const score=calculateScore(cleaned,item.keywords)

if(score>highestScore){

highestScore=score
bestMatch=item

}

})



if(bestMatch){

return{

text:bestMatch.response,

intent:bestMatch.intent,

category:bestMatch.category || null

}

}



return{

text:
`I'm not completely sure about that.

You can ask about:

• WiFi issues
• Mess timings
• Hostel repairs
• Library info
• Reporting complaints`,

intent:"unknown"

}

}