import React, { useEffect, useState } from "react";

/* ===================================================== */
/* FIREBASE */
/* ===================================================== */

import { db } from "../../services/firebase";

import {
collection,
query,
orderBy,
limit,
getDocs
} from "firebase/firestore";

/* ===================================================== */
/* ICONS */
/* ===================================================== */

import {
FiTrendingUp,
FiAlertCircle,
FiUsers
} from "react-icons/fi";

/* ===================================================== */
/* CAMPUS ISSUES CARD */
/* ===================================================== */

function CampusIssuesCard(){

/* ----------------------------------------------------- */
/* STATE */
/* ----------------------------------------------------- */

const [issues,setIssues] = useState([]);
const [loading,setLoading] = useState(true);

/* ----------------------------------------------------- */
/* LOAD CAMPUS ISSUES */
/* ----------------------------------------------------- */

useEffect(()=>{

async function loadIssues(){

try{

const q = query(
collection(db,"issues"),
orderBy("upvotes","desc"),
limit(5)
);

const snapshot = await getDocs(q);

const list = snapshot.docs.map(doc=>({
id:doc.id,
...doc.data()
}));

setIssues(list);

setLoading(false);

}catch(error){

console.error(error);
setLoading(false);

}

}

loadIssues();

},[]);

/* ----------------------------------------------------- */
/* LOADING */
/* ----------------------------------------------------- */

if(loading){

return(

<div className="bg-white shadow rounded-xl p-6">
Loading campus issues...
</div>

);

}

/* ----------------------------------------------------- */
/* UI */
/* ----------------------------------------------------- */

return(

<div className="bg-white rounded-2xl shadow-lg p-6">

{/* HEADER */}

<div className="flex items-center justify-between mb-4">

<h2 className="flex items-center gap-2 font-semibold text-lg">

<FiTrendingUp/>

Top Campus Issues

</h2>

</div>

{/* ISSUE LIST */}

<div className="space-y-4">

{issues.map(issue=>(

<IssueItem
key={issue.id}
issue={issue}
/>

))}

{issues.length === 0 && (

<p className="text-gray-400 text-center text-sm">
No campus issues found
</p>

)}

</div>

</div>

);

}

/* ===================================================== */
/* ISSUE ITEM */
/* ===================================================== */

function IssueItem({issue}){

return(

<div className="border rounded-lg p-4 hover:bg-gray-50 transition">

{/* TITLE */}

<h3 className="text-sm font-medium mb-2">

{issue.title}

</h3>

{/* CATEGORY */}

<p className="text-xs text-gray-500 mb-2">

Category: {issue.category}

</p>

{/* FOOTER */}

<div className="flex justify-between items-center text-xs">

{/* SEVERITY */}

<span className="flex items-center gap-1 text-red-500">

<FiAlertCircle/>

Severity {issue.severity || 0}

</span>

{/* UPVOTES */}

<span className="flex items-center gap-1 text-blue-600">

<FiUsers/>

{issue.upvotes || 0} supporters

</span>

</div>

</div>

);

}

export default CampusIssuesCard;
