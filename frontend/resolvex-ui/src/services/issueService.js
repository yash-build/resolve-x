/*
======================================================================
ResolveX Issue Service
======================================================================

Responsibilities:

1. Create issue
2. Detect priority automatically
3. Route issue to committee
4. Upvote issue
5. Resolve issue
6. Track resolution time
7. Escalate critical issues to administrators
8. Send notifications

======================================================================
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
======================================================================
Committee Routing
======================================================================
*/

function determineCommittee(category) {

  if (category === "Food") {
    return "Mess Committee";
  }

  if (category === "Hostel") {
    return "Hostel Committee";
  }

  if (category === "Infrastructure") {
    return "Maintenance Committee";
  }

  if (category === "Hygiene") {
    return "Sanitation Committee";
  }

  if (category === "Discipline") {
    return "Disciplinary Committee";
  }

  return "General Committee";

}

/*
======================================================================
Escalation Logic
======================================================================

If an issue is critical, notify all admins.

======================================================================
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

      message: `🚨 CRITICAL ISSUE REPORTED: ${issueData.title}`

    });

  }

}

/*
======================================================================
Create Issue
======================================================================
*/

export async function createIssue(issueData) {

  const committee = determineCommittee(issueData.category);

  const priority = detectPriority(
    issueData.title,
    issueData.description
  );

  const issueDocument = {

    ...issueData,

    assignedCommittee: committee,

    priority: priority,

    upvotes: 0,

    status: "pending",

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
======================================================================
Upvote Issue
======================================================================
*/

export async function upvoteIssue(issueId) {

  const issueRef = doc(db, "issues", issueId);

  await updateDoc(issueRef, {

    upvotes: increment(1)

  });

}

/*
======================================================================
Resolve Issue
======================================================================
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