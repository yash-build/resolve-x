/* ===================================================== */
/* RESOLVEX KNOWLEDGE ENGINE */
/* ===================================================== */

/*
This file aggregates all campus knowledge modules
for the ResolveX AI assistant.

Each module contains structured Q&A entries.

Total expected scale:
500+ questions
*/

/* ===================================================== */
/* IMPORT KNOWLEDGE MODULES */
/* ===================================================== */

import resolvexBasics from "./knowledgeCategories/resolvexBasics";
import issueReporting from "./knowledgeCategories/issueReporting";
import committees from "./knowledgeCategories/committees";
import platformFeatures from "./knowledgeCategories/platformFeatures";
import studentHelp from "./knowledgeCategories/studentHelp";
import adminHelp from "./knowledgeCategories/adminHelp";
import campusProblems from "./knowledgeCategories/campusProblems";

/* ===================================================== */
/* MERGE ALL KNOWLEDGE */
/* ===================================================== */

const campusKnowledge = [

...resolvexBasics,

...issueReporting,

...committees,

...platformFeatures,

...studentHelp,

...adminHelp,

...campusProblems

];

/* ===================================================== */
/* EXPORT KNOWLEDGE BASE */
/* ===================================================== */

export default campusKnowledge;
