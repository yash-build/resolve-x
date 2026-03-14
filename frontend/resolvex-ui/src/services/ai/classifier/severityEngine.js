/*
==================================================
ResolveX Severity Detection Engine
==================================================
*/

const severityKeywords={

High:[
"fire",
"electric shock",
"danger",
"leak",
"broken"
],

Medium:[
"not working",
"issue",
"problem",
"slow"
],

Low:[
"suggestion",
"request",
"improvement"
]

}

export function detectSeverity(tokens){

let severity="Low"

tokens.forEach(token=>{

Object.keys(severityKeywords).forEach(level=>{

if(severityKeywords[level].includes(token)){

severity=level

}

})

})

return severity

}