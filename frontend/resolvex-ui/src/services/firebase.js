// src/services/firebase.js

/*
===========================================================
ResolveX Firebase Configuration
Production Ready Setup
===========================================================

This file initializes and exports all Firebase services used
throughout the ResolveX platform.

Services Included:

• Firebase App Initialization
• Firestore Database
• Firebase Authentication
• Google Authentication Provider
• Firebase Storage (future proofing)
• Centralized Firebase Export Layer

This architecture ensures:

✔ Clean imports across the app
✔ Scalability for new Firebase services
✔ Maintainable project structure
✔ Startup-grade engineering practices

===========================================================
*/

import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider
} from "firebase/auth";

import {
  getFirestore
} from "firebase/firestore";

import {
  getStorage
} from "firebase/storage";

/*
===========================================================
Firebase Configuration
Loaded from environment variables
===========================================================
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
===========================================================
Initialize Firebase App
===========================================================
*/

const app = initializeApp(firebaseConfig);

/*
===========================================================
Initialize Firebase Services
===========================================================
*/

// Authentication
const auth = getAuth(app);

// Firestore Database
const db = getFirestore(app);

// Firebase Storage (for future features like images)
const storage = getStorage(app);

/*
===========================================================
Authentication Providers
===========================================================
*/

// Google Login Provider
const googleProvider = new GoogleAuthProvider();

/*
Optional Google Provider Configurations
These improve the login experience
*/

googleProvider.setCustomParameters({
  prompt: "select_account"
});

/*
===========================================================
Exports
===========================================================
*/

export {
  app,
  auth,
  db,
  storage,
  googleProvider
};