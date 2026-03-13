/*
========================================================
ResolveX Notification Service
========================================================

Handles all notification related operations.

This system allows:

• Creating notifications
• Fetching notifications
• Marking notifications as read
• Real-time notification updates

========================================================
*/

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

import { db } from "./firebase";

/*
========================================================
Create Notification
========================================================
*/

export async function createNotification(notificationData) {

  try {

    const notification = {

      ...notificationData,

      read: false,

      createdAt: serverTimestamp()

    };

    await addDoc(
      collection(db, "notifications"),
      notification
    );

  } catch (error) {

    console.error("Notification creation error:", error);

  }

}

/*
========================================================
Subscribe to User Notifications
========================================================
*/

export function subscribeToNotifications(userId, callback) {

  const notificationQuery = query(

    collection(db, "notifications"),

    where("userId", "==", userId),

    orderBy("createdAt", "desc")

  );

  const unsubscribe = onSnapshot(

    notificationQuery,

    (snapshot) => {

      const notifications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      callback(notifications);

    },

    (error) => {

      console.error("Notification listener error:", error);

    }

  );

  return unsubscribe;

}

/*
========================================================
Mark Notification As Read
========================================================
*/

export async function markNotificationAsRead(notificationId) {

  try {

    const notificationRef = doc(db, "notifications", notificationId);

    await updateDoc(notificationRef, {

      read: true

    });

  } catch (error) {

    console.error("Notification update error:", error);

  }

}