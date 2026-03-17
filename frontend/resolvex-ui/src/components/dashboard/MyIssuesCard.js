import React, { useEffect, useState } from "react";

/* ===================================================== */
/* FIREBASE */
/* ===================================================== */

import { db } from "../../services/firebase";

import {
collection,
query,
where,
orderBy,
limit,
getDocs
} from "firebase/firestore";

/* ===================================================== */
/* AUTH */
/* ===================================================== */

import { useAuth } from "../../context/AuthContext";

/* ===================================================== */
/* ICONS */
/* ===================================================== */

import {
FiAlertCircle,
FiCheckCircle,
FiClock,
FiTrendingUp
} from "react-icons/fi";

/* ===================================================== */
/* MY ISSUES CARD */
/* ===================================================== */

function MyIssuesCard(){

/* ----------------------------------------------------- */
/* AUTH USER */
/* ----------------------------------------------------- */

const { user } = useAuth();

/* ----------------------------------------------------- */
/* STATE */
/* ----------------------------------------------------- */

const [issues,setIssues] = useState([]);
const [loading,setLoading] = useState(true);

/* ----------------------------------------------------- */
/* LOAD ISSUES */
/* ----------------------------------------------------- */

useEffect(()=>{

async function loadIssues(){

if(!user) return;

try{

const q = query(
collection(db,"issues"),
where("createdBy","==",user.uid),
orderBy("createdAt","desc"),
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

},[user]);

/* ----------------------------------------------------- */
/* LOADING */
/* ----------------------------------------------------- */

if(loading){

return(

<div className="bg-white shadow rounded-xl p-6">
Loading issues...
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

<FiAlertCircle/>

My Issues

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
You haven't reported any issues yet
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

<div className="flex justify-between items-center mb-2">

<h3 className="text-sm font-medium">

{issue.title}

</h3>

{/* STATUS */}

{issue.status === "resolved" ? (

<span className="text-green-600 text-xs flex items-center gap-1">

<FiCheckCircle/>

Resolved

</span>

) : (

<span className="text-orange-500 text-xs flex items-center gap-1">

<FiClock/>

Pending

</span>

)}

</div>

{/* COMMITTEE */}

<p className="text-xs text-gray-500 mb-2">

Assigned: {issue.assignedCommittee || "Not Assigned"}

</p>

{/* FOOTER */}

<div className="flex justify-between items-center text-xs">

{/* PRIORITY */}

<span className="flex items-center gap-1 text-blue-600">

<FiTrendingUp/>

Severity {issue.severity || 0}

</span>

{/* UPVOTES */}

<span className="text-gray-500">

{issue.upvotes || 0} upvotes

</span>

</div>

</div>

);

}

export default MyIssuesCard;
