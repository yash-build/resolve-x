import { db } from "./firebase";
import {
  collection,
  addDoc,
  serverTimestamp
} from "firebase/firestore";

export const createIssue = async (issueData) => {

  try {

    await addDoc(collection(db, "issues"), {

      ...issueData,

      upvotes: 0,

      status: "pending",

      priority: "normal",

      aiCategory: null,
      aiPriority: null,
      duplicateGroup: null,

      createdAt: serverTimestamp()

    });

  } catch (error) {

    console.error("Error creating issue:", error);
    throw error;

  }

};