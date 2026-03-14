/*
=====================================================
ResolveX AI Keyword Database
=====================================================
Defines category keywords and committee routing
=====================================================
*/

export const CATEGORY_DATABASE = {

  Hostel: {
    keywords: [
      "hostel",
      "room",
      "fan",
      "bathroom",
      "bed",
      "repair",
      "water"
    ],
    weight: 3
  },

  Food: {
    keywords: [
      "food",
      "mess",
      "canteen",
      "meal",
      "spoiled",
      "breakfast",
      "lunch",
      "dinner"
    ],
    weight: 3
  },

  Hygiene: {
    keywords: [
      "dirty",
      "garbage",
      "trash",
      "smell",
      "unclean"
    ],
    weight: 2
  },

  Infrastructure: {
    keywords: [
      "wifi",
      "internet",
      "network",
      "router",
      "lab",
      "projector",
      "computer"
    ],
    weight: 2
  },

  Discipline: {
    keywords: [
      "fight",
      "ragging",
      "harassment",
      "abuse",
      "threat"
    ],
    weight: 4
  }

};



export const COMMITTEE_MAP = {

  Hostel: "Hostel Committee",

  Food: "Mess Committee",

  Hygiene: "Sanitation Committee",

  Infrastructure: "Maintenance Committee",

  Discipline: "Disciplinary Committee"

};