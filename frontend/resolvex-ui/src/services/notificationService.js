/* ========================================================= */
/* RESOLVEX NOTIFICATION SERVICE */
/* ========================================================= */

import { db } from "./firebase";

import {
collection,
addDoc,
serverTimestamp,
query,
where,
orderBy,
onSnapshot,
updateDoc,
doc
} from "firebase/firestore";

/* ========================================================= */
/* CREATE NOTIFICATION */
/* ========================================================= */

export async function createNotification({
userId,
message,
type
}){

try{

await addDoc(
collection(db,"notifications"),
{
userId:userId,
message:message,
type:type,
read:false,
createdAt:serverTimestamp()
}
);

}catch(error){

console.error("Notification Creation Error:",error);

}

}

/* ========================================================= */
/* ISSUE CREATED */
/* ========================================================= */

export async function notifyIssueCreated({
userId,
title
}){

await createNotification({

userId:userId,

message:`Your issue "${title}" has been submitted.`,

type:"issue_created"

});

}

/* ========================================================= */
/* ISSUE RESOLVED */
/* ========================================================= */

export async function notifyIssueResolved({
userId,
title
}){

await createNotification({

userId:userId,

message:`Your issue "${title}" has been resolved.`,

type:"issue_resolved"

});

}

/* ========================================================= */
/* ASSIGNMENT */
/* ========================================================= */

export async function notifyAssignment({
userId,
title
}){

await createNotification({

userId:userId,

message:`New assignment posted: ${title}`,

type:"assignment"

});

}

/* ========================================================= */
/* ANNOUNCEMENT */
/* ========================================================= */

export async function notifyAnnouncement({
userId,
title
}){

await createNotification({

userId:userId,

message:`Announcement: ${title}`,

type:"announcement"

});

}

/* ========================================================= */
/* REALTIME SUBSCRIPTION */
/* ========================================================= */

export function subscribeToNotifications(userId,callback){

const q = query(
collection(db,"notifications"),
where("userId","==",userId),
orderBy("createdAt","desc")
);

return onSnapshot(q,(snapshot)=>{

const list = snapshot.docs.map(doc=>({
id:doc.id,
...doc.data()
}));

callback(list);

});

}

/* ========================================================= */
/* MARK NOTIFICATION AS READ */
/* ========================================================= */

export async function markNotificationAsRead(notificationId){

try{

await updateDoc(
doc(db,"notifications",notificationId),
{
read:true
}
);

}catch(error){

console.error("Notification Update Error:",error);

}

}
