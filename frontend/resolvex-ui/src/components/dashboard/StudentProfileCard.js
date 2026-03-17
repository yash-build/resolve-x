import React, { useEffect, useState } from "react";

/* ===================================================== */
/* FIREBASE */
/* ===================================================== */

import { db } from "../../services/firebase";
import { doc, getDoc } from "firebase/firestore";

/* ===================================================== */
/* AUTH */
/* ===================================================== */

import { useAuth } from "../../context/AuthContext";

/* ===================================================== */
/* ICONS */
/* ===================================================== */

import {
FiUser,
FiBook,
FiHome,
FiAward,
FiMail,
FiHash
} from "react-icons/fi";

/* ===================================================== */
/* STUDENT PROFILE CARD */
/* ===================================================== */

function StudentProfileCard() {

/* ----------------------------------------------------- */
/* AUTH USER */
/* ----------------------------------------------------- */

const { user } = useAuth();

/* ----------------------------------------------------- */
/* STATE */
/* ----------------------------------------------------- */

const [student,setStudent] = useState(null);
const [loading,setLoading] = useState(true);

/* ----------------------------------------------------- */
/* FETCH PROFILE */
/* ----------------------------------------------------- */

useEffect(()=>{

async function loadProfile(){

if(!user) return;

try{

const ref = doc(db,"students",user.uid);
const snap = await getDoc(ref);

if(snap.exists()){
setStudent(snap.data());
}

setLoading(false);

}catch(err){

console.error(err);
setLoading(false);

}

}

loadProfile();

},[user]);

/* ----------------------------------------------------- */
/* LOADING */
/* ----------------------------------------------------- */

if(loading){

return(

<div className="bg-white shadow rounded-xl p-6">
Loading profile...
</div>

);

}

/* ----------------------------------------------------- */
/* NO PROFILE */
/* ----------------------------------------------------- */

if(!student){

return(

<div className="bg-white shadow rounded-xl p-6">
No profile data found
</div>

);

}

/* ----------------------------------------------------- */
/* UI */
/* ----------------------------------------------------- */

return(

<div className="bg-white rounded-2xl shadow-lg overflow-hidden">

{/* HEADER */}

<div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-6 text-white">

<div className="flex items-center gap-4">

{/* AVATAR */}

<div className="w-16 h-16 rounded-full bg-white text-indigo-600 flex items-center justify-center text-2xl font-bold">

{student.name?.charAt(0)}

</div>

{/* BASIC INFO */}

<div>

<h2 className="text-xl font-semibold">
{student.name}
</h2>

<p className="text-indigo-100 text-sm">
{student.department}
</p>

</div>

</div>

</div>

{/* BODY */}

<div className="p-6">

{/* INFO GRID */}

<div className="grid grid-cols-2 gap-4 text-sm mb-6">

<InfoItem
icon={<FiHash/>}
label="Year"
value={student.year}
/>

<InfoItem
icon={<FiHome/>}
label="Hostel"
value={student.hostelBlock}
/>

<InfoItem
icon={<FiHome/>}
label="Room"
value={student.roomNumber}
/>

<InfoItem
icon={<FiMail/>}
label="Email"
value={student.email}
/>

</div>

{/* ACADEMIC STATS */}

<div className="grid grid-cols-2 gap-4">

<StatBox
title="CGPA"
value={student.cgpa}
color="blue"
/>

<StatBox
title="Attendance"
value={`${student.attendancePercentage || 0}%`}
color="green"
/>

</div>

</div>

</div>

);

}

/* ===================================================== */
/* INFO ITEM */
/* ===================================================== */

function InfoItem({icon,label,value}){

return(

<div className="flex items-center gap-2">

<div className="text-gray-500">
{icon}
</div>

<div>

<p className="text-gray-400 text-xs">
{label}
</p>

<p className="font-medium">
{value}
</p>

</div>

</div>

);

}

/* ===================================================== */
/* STAT BOX */
/* ===================================================== */

function StatBox({title,value,color}){

const colors = {
blue:"bg-blue-50 text-blue-600",
green:"bg-green-50 text-green-600"
};

return(

<div className={`rounded-lg p-4 ${colors[color]}`}>

<p className="text-xs text-gray-500">
{title}
</p>

<p className="text-xl font-bold">
{value}
</p>

</div>

);

}

export default StudentProfileCard;
