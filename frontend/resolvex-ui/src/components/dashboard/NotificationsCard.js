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
FiBell,
FiCheckCircle,
FiAlertCircle,
FiBookOpen
} from "react-icons/fi";

/* ===================================================== */
/* NOTIFICATIONS CARD */
/* ===================================================== */

function NotificationsCard(){

/* ----------------------------------------------------- */
/* AUTH USER */
/* ----------------------------------------------------- */

const { user } = useAuth();

/* ----------------------------------------------------- */
/* STATE */
/* ----------------------------------------------------- */

const [notifications,setNotifications] = useState([]);
const [loading,setLoading] = useState(true);

/* ----------------------------------------------------- */
/* LOAD NOTIFICATIONS */
/* ----------------------------------------------------- */

useEffect(()=>{

async function loadNotifications(){

if(!user) return;

try{

const q = query(
collection(db,"notifications"),
where("userId","==",user.uid),
orderBy("createdAt","desc"),
limit(6)
);

const snapshot = await getDocs(q);

const list = snapshot.docs.map(doc=>({
id:doc.id,
...doc.data()
}));

setNotifications(list);

setLoading(false);

}catch(error){

console.error(error);
setLoading(false);

}

}

loadNotifications();

},[user]);

/* ----------------------------------------------------- */
/* LOADING */
/* ----------------------------------------------------- */

if(loading){

return(

<div className="bg-white shadow rounded-xl p-6">
Loading notifications...
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

<FiBell/>

Notifications

</h2>

</div>

{/* NOTIFICATION LIST */}

<div className="space-y-3">

{notifications.map(notification=>(

<NotificationItem
key={notification.id}
notification={notification}
/>

))}

{notifications.length === 0 && (

<p className="text-gray-400 text-sm text-center">
No notifications yet
</p>

)}

</div>

</div>

);

}

/* ===================================================== */
/* NOTIFICATION ITEM */
/* ===================================================== */

function NotificationItem({notification}){

/* ICON BASED ON TYPE */

function getIcon(){

switch(notification.type){

case "issue_update":
return <FiAlertCircle className="text-orange-500"/>;

case "assignment":
return <FiBookOpen className="text-blue-500"/>;

case "announcement":
return <FiCheckCircle className="text-green-500"/>;

default:
return <FiBell className="text-gray-500"/>;

}

}

return(

<div className="flex items-start gap-3 border rounded-lg p-3 hover:bg-gray-50 transition">

{/* ICON */}

<div className="text-lg">

{getIcon()}

</div>

{/* MESSAGE */}

<div className="flex-1">

<p className="text-sm">

{notification.message}

</p>

{/* TIME */}

<p className="text-xs text-gray-400 mt-1">

{formatTime(notification.createdAt)}

</p>

</div>

</div>

);

}

/* ===================================================== */
/* TIME FORMATTER */
/* ===================================================== */

function formatTime(timestamp){

if(!timestamp) return "";

const date = timestamp.toDate
? timestamp.toDate()
: new Date(timestamp);

return date.toLocaleDateString();

}

export default NotificationsCard;
