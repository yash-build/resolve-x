/*
========================================================
ResolveX AI - Text Processing Engine
========================================================

Purpose:
Prepare user input for AI analysis.

Stages:
1 Normalize text
2 Tokenize sentence
3 Remove stopwords
4 Expand synonyms
========================================================
*/

const stopwords = [
"the","is","a","an","of","to","in","for","on","at","and"
]

const synonymMap = {

wifi:["wifi","internet","lan","network","router"],
food:["food","mess","meal","canteen","lunch","dinner"],
hostel:["hostel","room","dorm","accommodation"],
water:["water","leak","pipe","tap"],
electric:["electric","electricity","power"],
clean:["clean","dirty","trash","garbage","smell"]

}

export function normalizeText(text){

return text
.toLowerCase()
.replace(/[^\w\s]/g,"")
.trim()

}

export function tokenize(text){

return text.split(/\s+/)

}

export function removeStopwords(tokens){

return tokens.filter(word=>!stopwords.includes(word))

}

export function expandSynonyms(tokens){

let expanded=[...tokens]

tokens.forEach(token=>{

Object.keys(synonymMap).forEach(key=>{

if(synonymMap[key].includes(token)){

expanded.push(key)

}

})

})

return expanded

}

export function processText(text){

const normalized=normalizeText(text)

const tokens=tokenize(normalized)

const filtered=removeStopwords(tokens)

const expanded=expandSynonyms(filtered)

return expanded

}