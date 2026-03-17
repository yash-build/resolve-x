
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

/*
============================================================
FIREBASE CONFIG
============================================================
*/

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

/*
============================================================
INITIALIZE APP
============================================================
*/

const app = initializeApp(firebaseConfig);

/*
============================================================
AUTH
============================================================
*/

const auth = getAuth(app);

/*
Ensure login session persists across refresh
*/

setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Auth persistence enabled");
  })
  .catch((error) => {
    console.error("Persistence error:", error);
  });

/*
============================================================
DATABASE
============================================================
*/

const db = getFirestore(app);

/*
============================================================
STORAGE
============================================================
*/

const storage = getStorage(app);

export { auth, db, storage };

