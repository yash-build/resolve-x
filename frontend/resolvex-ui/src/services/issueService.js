/*
==============================================================
ResolveX Issue Service
==============================================================

This service manages all issue related operations.

Responsibilities:

1. Create new issue
2. Upvote issue
3. Resolve issue
4. Attach committee automatically
5. Track resolution time
6. Notify issue creator

==============================================================
*/

import {
  collection,
  addDoc,
  updateDoc,
  doc,
  increment,
  serverTimestamp
} from "firebase/firestore";

import { db } from "./firebase";

import { createNotification } from "./notificationService";

/*
==============================================================
Committee Routing Logic
==============================================================
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
==============================================================
Create Issue
==============================================================
*/

export async function createIssue(issueData) {

  const committee = determineCommittee(issueData.category);

  const issueDocument = {

    ...issueData,

    assignedCommittee: committee,

    priority: "medium",

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

  return docRef.id;
}

/*
==============================================================
Upvote Issue
==============================================================
*/

export async function upvoteIssue(issueId) {

  const issueRef = doc(db, "issues", issueId);

  await updateDoc(issueRef, {

    upvotes: increment(1)

  });

}

/*
==============================================================
Resolve Issue
==============================================================
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

  /*
  ------------------------------------------------------------
  Send notification to issue creator
  ------------------------------------------------------------
  */

  await createNotification({

    userId: issueData.createdBy,

    issueId: issueId,

    message: `Your issue "${issueData.title}" has been resolved.`

  });

}