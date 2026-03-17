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
/* AUTH */
/* ===================================================== */

import { useAuth } from "../../context/AuthContext";

/* ===================================================== */
/* ICONS */
/* ===================================================== */

import {
FiBookOpen,
FiClock,
FiCheckCircle
} from "react-icons/fi";

/* ===================================================== */
/* ASSIGNMENT CARD */
/* ===================================================== */

function AssignmentCard(){

/* ----------------------------------------------------- */
/* AUTH USER */
/* ----------------------------------------------------- */

const { user } = useAuth();

/* ----------------------------------------------------- */
/* STATE */
/* ----------------------------------------------------- */

const [assignments,setAssignments] = useState([]);
const [loading,setLoading] = useState(true);

/* ----------------------------------------------------- */
/* LOAD ASSIGNMENTS */
/* ----------------------------------------------------- */

useEffect(()=>{

async function loadAssignments(){

try{

const q = query(
collection(db,"assignments"),
orderBy("dueDate","asc"),
limit(5)
);

const snapshot = await getDocs(q);

const list = snapshot.docs.map(doc=>({
id:doc.id,
...doc.data()
}));

setAssignments(list);

setLoading(false);

}catch(error){

console.error(error);
setLoading(false);

}

}

loadAssignments();

},[user]);

/* ----------------------------------------------------- */
/* LOADING */
/* ----------------------------------------------------- */

if(loading){

return(

<div className="bg-white shadow rounded-xl p-6">
Loading assignments...
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

<FiBookOpen/>

Assignments

</h2>

</div>

{/* ASSIGNMENT LIST */}

<div className="space-y-4">

{assignments.map(assignment=>(

<AssignmentItem
key={assignment.id}
assignment={assignment}
studentId={user?.uid}
/>

))}

{assignments.length === 0 && (

<p className="text-gray-400 text-center text-sm">
No assignments available
</p>

)}

</div>

</div>

);

}

/* ===================================================== */
/* ASSIGNMENT ITEM */
/* ===================================================== */

function AssignmentItem({assignment,studentId}){

const submitted =
assignment.submittedStudents?.includes(studentId);

const dueDate = new Date(assignment.dueDate);
const today = new Date();

const daysLeft = Math.ceil(
(dueDate - today) / (1000 * 60 * 60 * 24)
);

return(

<div className="border rounded-lg p-4 hover:bg-gray-50 transition">

<div className="flex justify-between items-center mb-2">

{/* TITLE */}

<h3 className="font-medium text-sm">

{assignment.title}

</h3>

{/* STATUS */}

{submitted ? (

<span className="text-green-600 flex items-center gap-1 text-xs">

<FiCheckCircle/>

Submitted

</span>

) : (

<span className="text-orange-500 flex items-center gap-1 text-xs">

<FiClock/>

Pending

</span>

)}

</div>

{/* COURSE */}

<p className="text-xs text-gray-500 mb-2">

{assignment.course || "Course"}

</p>

{/* DEADLINE */}

<p className="text-xs">

{daysLeft > 0 ? (

<span className="text-orange-500">

Due in {daysLeft} days

</span>

) : (

<span className="text-red-500">

Deadline Passed

</span>

)}

</p>

</div>

);

}

export default AssignmentCard;
