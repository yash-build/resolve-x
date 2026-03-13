/*
========================================================
ResolveX Issue Service
========================================================

Handles all issue related operations.

========================================================
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
  orderBy,
  onSnapshot
} from "firebase/firestore";

import { db } from "./firebase";

import { createNotification } from "./notificationService";

/*
========================================================
Create Issue
========================================================
*/

export async function createIssue(issueData) {

  const issue = {

    ...issueData,

    upvotes: 0,

    status: "pending",

    createdAt: serverTimestamp(),

    resolvedAt: null

  };

  const docRef = await addDoc(
    collection(db, "issues"),
    issue
  );

  return docRef.id;
}

/*
========================================================
Fetch All Issues
========================================================
*/

export async function fetchAllIssues() {

  const snapshot = await getDocs(
    collection(db, "issues")
  );

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

}

/*
========================================================
Realtime Issue Feed
========================================================
*/

export function subscribeToIssues(sortOption, callback) {

  let issueQuery;

  if (sortOption === "newest") {

    issueQuery = query(
      collection(db, "issues"),
      orderBy("createdAt", "desc")
    );

  }

  else if (sortOption === "oldest") {

    issueQuery = query(
      collection(db, "issues"),
      orderBy("createdAt", "asc")
    );

  }

  else {

    issueQuery = query(
      collection(db, "issues"),
      orderBy("upvotes", "desc")
    );

  }

  const unsubscribe = onSnapshot(issueQuery, (snapshot) => {

    const issues = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    callback(issues);

  });

  return unsubscribe;
}

/*
========================================================
Upvote Issue
========================================================
*/

export async function upvoteIssue(issueId) {

  const issueRef = doc(db, "issues", issueId);

  await updateDoc(issueRef, {

    upvotes: increment(1)

  });

}

/*
========================================================
Resolve Issue
========================================================
*/

export async function resolveIssue(issueId, issueData) {

  const issueRef = doc(db, "issues", issueId);

  await updateDoc(issueRef, {

    status: "resolved",

    resolvedAt: serverTimestamp()

  });

  /*
  ----------------------------------------------
  Send notification to student
  ----------------------------------------------
  */

  await createNotification({

    userId: issueData.createdBy,

    issueId: issueId,

    message: `Your issue "${issueData.title}" has been resolved.`

  });

}