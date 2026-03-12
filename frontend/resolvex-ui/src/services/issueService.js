import { db } from "./firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
  increment
} from "firebase/firestore";

const getCommitteeFromCategory = (category) => {

  const mapping = {
    Food: "Mess Committee",
    Hostel: "Hostel Committee",
    Infrastructure: "Maintenance Committee",
    Hygiene: "Sanitation Committee",
    Discipline: "Disciplinary Committee"
  };

  return mapping[category] || "General Committee";
};

export const createIssue = async (issueData, user) => {

  try {

    const committee = getCommitteeFromCategory(issueData.category);

    const issue = {
      title: issueData.title,
      description: issueData.description,
      category: issueData.category,
      createdBy: user.uid,
      createdByName: user.displayName || "Anonymous",
      upvotes: 0,
      status: "pending",
      assignedCommittee: committee,
      createdAt: serverTimestamp()
    };

    await addDoc(collection(db, "issues"), issue);

  } catch (error) {
    console.error("Error creating issue:", error);
  }
};

export const upvoteIssue = async (issueId) => {

  try {

    const issueRef = doc(db, "issues", issueId);

    await updateDoc(issueRef, {
      upvotes: increment(1)
    });

  } catch (error) {
    console.error("Error upvoting issue:", error);
  }

};