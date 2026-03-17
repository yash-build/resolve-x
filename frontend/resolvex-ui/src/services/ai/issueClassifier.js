/* ===================================================== */
/* RESOLVEX ISSUE CLASSIFIER ENGINE */
/* ===================================================== */

/*
This module analyzes issue descriptions
and determines the most likely category
and responsible committee.
*/

/* ===================================================== */
/* CATEGORY KEYWORDS */
/* ===================================================== */

const CATEGORY_KEYWORDS = {

Food: [
"food",
"mess",
"canteen",
"meal",
"breakfast",
"lunch",
"dinner",
"taste",
"oily",
"undercooked",
"rotten"
],

Hostel: [
"hostel",
"room",
"fan",
"bed",
"light",
"electricity",
"plug",
"switch",
"window",
"door"
],

Infrastructure: [
"classroom",
"bench",
"table",
"projector",
"board",
"building",
"ceiling",
"floor",
"wall",
"lab"
],

Hygiene: [
"dirty",
"garbage",
"smell",
"toilet",
"washroom",
"clean",
"sanitation",
"dust",
"waste"
],

Discipline: [
"fight",
"noise",
"disturbance",
"harassment",
"bullying",
"rule",
"violation"
]

};

/* ===================================================== */
/* COMMITTEE MAPPING */
/* ===================================================== */

const COMMITTEE_MAP = {

Food: "Mess Committee",

Hostel: "Hostel Committee",

Infrastructure: "Maintenance Committee",

Hygiene: "Sanitation Committee",

Discipline: "Disciplinary Committee"

};

/* ===================================================== */
/* TEXT NORMALIZATION */
/* ===================================================== */

function normalize(text){

return text
.toLowerCase()
.replace(/[^\w\s]/gi,"")
.trim();

}

/* ===================================================== */
/* TOKENIZATION */
/* ===================================================== */

function tokenize(text){

return normalize(text).split(" ");

}

/* ===================================================== */
/* CATEGORY SCORING */
/* ===================================================== */

function scoreCategory(tokens,keywords){

let score = 0;

tokens.forEach(token=>{

if(keywords.includes(token)){
score++;
}

});

return score;

}

/* ===================================================== */
/* CLASSIFICATION */
/* ===================================================== */

export function classifyIssue(description){

const tokens = tokenize(description);

let bestCategory = null;
let highestScore = 0;

Object.entries(CATEGORY_KEYWORDS).forEach(
([category,keywords])=>{

const score = scoreCategory(tokens,keywords);

if(score > highestScore){

highestScore = score;
bestCategory = category;

}

}
);

/* FALLBACK */

if(!bestCategory){
bestCategory = "Infrastructure";
}

/* COMMITTEE */

const committee = COMMITTEE_MAP[bestCategory];

return {

category: bestCategory,

committee: committee

};

}
