import React, { useEffect, useState } from "react";

/* ===================================================== */
/* FIREBASE */
/* ===================================================== */

import { db } from "../../services/firebase";
import {
doc,
getDoc
} from "firebase/firestore";

/* ===================================================== */
/* AUTH */
/* ===================================================== */

import { useAuth } from "../../context/AuthContext";

/* ===================================================== */
/* ICONS */
/* ===================================================== */

import {
FiCreditCard,
FiCheckCircle,
FiAlertCircle
} from "react-icons/fi";

/* ===================================================== */
/* FEE STATUS CARD */
/* ===================================================== */

function FeeStatusCard(){

/* ----------------------------------------------------- */
/* AUTH USER */
/* ----------------------------------------------------- */

const { user } = useAuth();

/* ----------------------------------------------------- */
/* STATE */
/* ----------------------------------------------------- */

const [fee,setFee] = useState(null);
const [loading,setLoading] = useState(true);

/* ----------------------------------------------------- */
/* LOAD FEE DATA */
/* ----------------------------------------------------- */

useEffect(()=>{

async function loadFees(){

if(!user) return;

try{

const ref = doc(db,"fees",user.uid);

const snap = await getDoc(ref);

if(snap.exists()){
setFee(snap.data());
}

setLoading(false);

}catch(error){

console.error(error);
setLoading(false);

}

}

loadFees();

},[user]);

/* ----------------------------------------------------- */
/* LOADING */
/* ----------------------------------------------------- */

if(loading){

return(

<div className="bg-white shadow rounded-xl p-6">
Loading fee data...
</div>

);

}

/* ----------------------------------------------------- */
/* NO DATA */
/* ----------------------------------------------------- */

if(!fee){

return(

<div className="bg-white shadow rounded-xl p-6">
No fee record found
</div>

);

}

/* ----------------------------------------------------- */
/* CALCULATIONS */
/* ----------------------------------------------------- */

const progress = fee.status === "paid" ? 100 : 50;

/* ----------------------------------------------------- */
/* UI */
/* ----------------------------------------------------- */

return(

<div className="bg-white rounded-2xl shadow-lg p-6">

{/* HEADER */}

<div className="flex items-center justify-between mb-4">

<h2 className="flex items-center gap-2 font-semibold text-lg">

<FiCreditCard/>

Fee Status

</h2>

{fee.status === "paid" ? (

<span className="text-green-600 flex items-center gap-1 text-sm">

<FiCheckCircle/>

Paid

</span>

) : (

<span className="text-red-500 flex items-center gap-1 text-sm">

<FiAlertCircle/>

Pending

</span>

)}

</div>

{/* SEMESTER INFO */}

<div className="mb-4 text-sm">

<p><b>Semester:</b> {fee.semester}</p>

<p><b>Total Fee:</b> ₹{fee.amount}</p>

</div>

{/* PROGRESS BAR */}

<div className="mb-4">

<div className="w-full bg-gray-200 rounded-full h-2">

<div
className="bg-blue-500 h-2 rounded-full"
style={{width: `${progress}%`}}
></div>

</div>

<p className="text-xs text-gray-500 mt-1">

{progress}% Paid

</p>

</div>

{/* PAYMENT INFO */}

<div className="text-sm space-y-1">

<p>

<b>Payment Date:</b>

{" "}
{fee.paymentDate || "Not Paid"}

</p>

<p>

<b>Status:</b>

{" "}

<span className={
fee.status === "paid"
? "text-green-600"
: "text-red-500"
}>

{fee.status}

</span>

</p>

</div>

</div>

);

}

export default FeeStatusCard;
