/*
=====================================================================
ResolveX Issue Service
=====================================================================

This service controls ALL issue lifecycle operations.

System Responsibilities:

1. Create issues
2. Route issues to committees
3. Detect issue priority
4. Handle sensitive issues
5. Track resolution time
6. Manage upvotes
7. Trigger notifications
8. Escalate critical issues

=====================================================================
*/

import {

  collection,
  addDoc,
  updateDoc,
  doc,
  increment,
  serverTimestamp,
  getDocs,
  query,
  where

} from "firebase/firestore";

import { db } from "./firebase";

import { detectPriority } from "../utils/priorityDetector";

import { createNotification } from "./notificationService";

/*
=====================================================================
Committee Routing Logic
=====================================================================
*/

function determineCommittee(category) {

  if (category === "Food") return "Mess Committee";

  if (category === "Hostel") return "Hostel Committee";

  if (category === "Infrastructure") return "Maintenance Committee";

  if (category === "Hygiene") return "Sanitation Committee";

  if (category === "Discipline") return "Disciplinary Committee";

  return "General Committee";

}

/*
=====================================================================
Critical Issue Escalation
=====================================================================

If issue priority is CRITICAL, notify all admins.

=====================================================================
*/

async function escalateCriticalIssue(issueData) {

  const adminQuery = query(
    collection(db, "users"),
    where("role", "==", "admin")
  );

  const snapshot = await getDocs(adminQuery);

  const admins = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  for (let admin of admins) {

    await createNotification({

      userId: admin.id,

      message: `🚨 CRITICAL ISSUE: ${issueData.title}`

    });

  }

}

/*
=====================================================================
Create Issue
=====================================================================

Every issue now contains:

• sensitive flag
• routing data
• timestamps
• priority level

=====================================================================
*/

export async function createIssue(issueData) {

  const committee = determineCommittee(issueData.category);

  const priority = detectPriority(
    issueData.title,
    issueData.description
  );

  const issueDocument = {

    /*
    ---------------------------------------------------------------
    Core Issue Fields
    ---------------------------------------------------------------
    */

    title: issueData.title,

    description: issueData.description,

    category: issueData.category,

    location: issueData.location,

    /*
    ---------------------------------------------------------------
    Sensitive Issue Flag
    ---------------------------------------------------------------
    */

    sensitive: issueData.sensitive ? true : false,

    /*
    ---------------------------------------------------------------
    Routing + Priority
    ---------------------------------------------------------------
    */

    assignedCommittee: committee,

    priority: priority,

    /*
    ---------------------------------------------------------------
    Status Fields
    ---------------------------------------------------------------
    */

    status: "pending",

    upvotes: 0,

    /*
    ---------------------------------------------------------------
    User Metadata
    ---------------------------------------------------------------
    */

    createdBy: issueData.createdBy,

    createdByName: issueData.createdByName,

    /*
    ---------------------------------------------------------------
    Time Tracking
    ---------------------------------------------------------------
    */

    createdAt: serverTimestamp(),

    resolvedAt: null,

    resolutionTimeHours: null

  };

  const docRef = await addDoc(

    collection(db, "issues"),

    issueDocument

  );

  /*
  ---------------------------------------------------------------
  Escalate Critical Issues
  ---------------------------------------------------------------
  */

  if (priority === "critical") {

    await escalateCriticalIssue(issueData);

  }

  return docRef.id;

}

/*
=====================================================================
Upvote Issue
=====================================================================
*/

export async function upvoteIssue(issueId) {

  const issueRef = doc(db, "issues", issueId);

  await updateDoc(issueRef, {

    upvotes: increment(1)

  });

}

/*
=====================================================================
Resolve Issue
=====================================================================
*/

export async function resolveIssue(issueId, issueData) {

  const issueRef = doc(db, "issues", issueId);

  const now = new Date();

  let resolutionHours = null;

  if (issueData.createdAt) {

    const created = issueData.createdAt.toDate();

    const diffMs = now - created;

    resolutionHours = diffMs / (1000 * 60 * 60);

  }

  await updateDoc(issueRef, {

    status: "resolved",

    resolvedAt: serverTimestamp(),

    resolutionTimeHours: resolutionHours

  });

  await createNotification({

    userId: issueData.createdBy,

    message: `Your issue "${issueData.title}" has been resolved.`

  });

}