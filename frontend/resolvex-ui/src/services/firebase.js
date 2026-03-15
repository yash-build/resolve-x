/*
==================================================
RESOLVEX FIREBASE SERVICE
==================================================

Handles:

• Firebase initialization
• Authentication
• Firestore database
• Google login
• Firebase storage

Analytics removed to prevent local runtime errors.
*/

import { initializeApp } from "firebase/app";

import { getAuth, GoogleAuthProvider } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

import { getStorage } from "firebase/storage";

/*
==================================================
FIREBASE CONFIG
==================================================
*/

const firebaseConfig = {
  apiKey: "AIzaSyCjE55naQqS_RYXNVaBoFYI4jiERy5kxTg",

  authDomain: "resolvex-60dc7.firebaseapp.com",

  projectId: "resolvex-60dc7",

  storageBucket: "resolvex-60dc7.appspot.com",

  messagingSenderId: "990924004969",

  appId: "1:990924004969:web:b3d8889767d6f415effc6c"
};

/*
==================================================
INITIALIZE FIREBASE
==================================================
*/

const app = initializeApp(firebaseConfig);

/*
==================================================
AUTHENTICATION
==================================================
*/

export const auth = getAuth(app);

/*
==================================================
GOOGLE LOGIN PROVIDER
==================================================
*/

export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account"
});

/*
==================================================
FIRESTORE DATABASE
==================================================
*/

export const db = getFirestore(app);

/*
==================================================
FIREBASE STORAGE
==================================================
*/

export const storage = getStorage(app);

/*
==================================================
EXPORT APP
==================================================
*/

export default app;