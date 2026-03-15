import { db } from "./firebase";

import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp
} from "firebase/firestore";

/*
====================================================
RESOLVEX ANNOUNCEMENT SERVICE
====================================================

Handles:

• posting announcements
• fetching announcements
*/

export const createAnnouncement = async (
  title,
  message,
  targetAudience
) => {

  try {

    await addDoc(
      collection(db, "announcements"),
      {
        title,
        message,
        targetAudience,
        createdBy: "Admin",
        createdAt: serverTimestamp()
      }
    );

  } catch (error) {

    console.error("Announcement creation failed", error);

    throw error;

  }

};



export const fetchAnnouncements = async () => {

  try {

    const snapshot = await getDocs(
      collection(db, "announcements")
    );

    const announcements = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    return announcements;

  } catch (error) {

    console.error("Failed to load announcements", error);

    return [];

  }

};