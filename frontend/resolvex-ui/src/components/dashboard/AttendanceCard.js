import React, { useEffect, useState } from "react";

/* ===================================================== */
/* FIREBASE */
/* ===================================================== */

import { db } from "../../services/firebase";
import {
collection,
query,
where,
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
FiTrendingUp,
FiCheckCircle
} from "react-icons/fi";

/* ===================================================== */
/* ATTENDANCE CARD */
/* ===================================================== */

function AttendanceCard(){

/* ----------------------------------------------------- */
/* AUTH USER */
/* ----------------------------------------------------- */

const { user } = useAuth();

/* ----------------------------------------------------- */
/* STATE */
/* ----------------------------------------------------- */

const [attendance,setAttendance] = useState([]);
const [percentage,setPercentage] = useState(0);
const [loading,setLoading] = useState(true);

/* ----------------------------------------------------- */
/* FETCH ATTENDANCE */
/* ----------------------------------------------------- */

useEffect(()=>{

async function loadAttendance(){

if(!user) return;

try{

const q = query(
collection(db,"attendance"),
where("studentId","==",user.uid)
);

const snapshot = await getDocs(q);

const records = snapshot.docs.map(doc=>doc.data());

setAttendance(records);

/* CALCULATE ATTENDANCE */

let present = records.filter(r=>r.status==="present").length;

let percent = records.length
? Math.round((present / records.length) * 100)
: 0;

setPercentage(percent);

setLoading(false);

}catch(error){

console.error(error);
setLoading(false);

}

}

loadAttendance();

},[user]);

/* ----------------------------------------------------- */
/* LOADING */
/* ----------------------------------------------------- */

if(loading){

return(

<div className="bg-white shadow rounded-xl p-6">
Loading attendance...
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

Attendance

</h2>

</div>

{/* PROGRESS CIRCLE */}

<div className="flex items-center justify-center mb-6">

<div className="relative w-32 h-32">

<svg
className="w-32 h-32 transform -rotate-90"
viewBox="0 0 120 120"

>

{/* BACKGROUND */}

<circle
cx="60"
cy="60"
r="54"
stroke="#e5e7eb"
strokeWidth="10"
fill="none"
/>

{/* PROGRESS */}

<circle
cx="60"
cy="60"
r="54"
stroke="#3b82f6"
strokeWidth="10"
fill="none"
strokeDasharray={339}
strokeDashoffset={
339 - (339 * percentage) / 100
}
strokeLinecap="round"
/>

</svg>

<div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">

{percentage}%

</div>

</div>

</div>

{/* ATTENDANCE STATUS */}

<div className="text-center mb-6">

{percentage >= 75 ? (

<p className="text-green-600 flex justify-center items-center gap-1">

<FiCheckCircle/>

Good Attendance

</p>

) : (

<p className="text-red-500">
Low Attendance
</p>

)}

</div>

{/* SUBJECT BREAKDOWN */}

<div className="space-y-3 text-sm">

{attendance.slice(0,4).map((record,index)=>(

<div
key={index}
className="flex justify-between border-b pb-2"
>

<span>{record.course || "Course"}</span>

<span className={
record.status === "present"
? "text-green-600"
: "text-red-500"
}>

{record.status}

</span>

</div>

))}

{attendance.length === 0 && (

<p className="text-gray-400 text-center">
No attendance data
</p>

)}

</div>

</div>

);

}

export default AttendanceCard;
