import React,
{
createContext,
useContext,
useEffect,
useState
} from "react";

import {
auth,
db,
googleProvider
} from "../services/firebase";

import {
onAuthStateChanged,
signInWithPopup,
signOut
} from "firebase/auth";

import {
doc,
getDoc,
setDoc,
serverTimestamp
} from "firebase/firestore";

/*
==============================================================
RESOLVEX AUTHENTICATION CONTEXT
==============================================================

This module manages all authentication logic
for the ResolveX platform.

Features

• Firebase Authentication
• Google Login
• User profile loading
• Firestore user document creation
• Role management
• Logout system
• Session persistence
• Loading states
• Role helpers

User Roles

student
committee
admin
authority

Firestore Structure

users/{uid}

{
name
email
role
createdAt
}

==============================================================
*/

const AuthContext = createContext();

/*
==============================================================
HOOK FOR USING AUTH CONTEXT
==============================================================
*/

export const useAuth = () => {

return useContext(AuthContext);

};

/*
==============================================================
AUTH PROVIDER COMPONENT
==============================================================
*/

export const AuthProvider = ({ children }) => {

/*
--------------------------------------------------------------
STATE MANAGEMENT
--------------------------------------------------------------
*/

const [currentUser, setCurrentUser] = useState(null);

const [userProfile, setUserProfile] = useState(null);

const [loading, setLoading] = useState(true);

const [authError, setAuthError] = useState(null);



/*
==============================================================
GOOGLE LOGIN FUNCTION
==============================================================
*/

const loginWithGoogle = async () => {

try {

setAuthError(null);

const result = await signInWithPopup(
auth,
googleProvider
);

const user = result.user;

if (!user) return;

/*
--------------------------------------------------------------
CHECK FIRESTORE USER DOCUMENT
--------------------------------------------------------------
*/

const userRef = doc(db, "users", user.uid);

const userSnap = await getDoc(userRef);

/*
--------------------------------------------------------------
CREATE USER DOCUMENT IF NOT EXISTS
--------------------------------------------------------------
*/

if (!userSnap.exists()) {

const newUser = {

name: user.displayName || "Unknown User",

email: user.email,

role: "student",

createdAt: serverTimestamp()

};

await setDoc(userRef, newUser);

setUserProfile(newUser);

} else {

setUserProfile(userSnap.data());

}

} catch (error) {

console.error("Google login failed:", error);

setAuthError(error.message);

}

};



/*
==============================================================
LOGOUT FUNCTION
==============================================================
*/

const logout = async () => {

try {

await signOut(auth);

setCurrentUser(null);

setUserProfile(null);

} catch (error) {

console.error("Logout failed:", error);

}

};



/*
==============================================================
AUTH STATE LISTENER
==============================================================
*/

useEffect(() => {

const unsubscribe = onAuthStateChanged(

auth,

async (user) => {

if (user) {

setCurrentUser(user);

try {

/*
----------------------------------------------------------
FETCH USER PROFILE FROM FIRESTORE
----------------------------------------------------------
*/

const userRef = doc(db, "users", user.uid);

const userSnap = await getDoc(userRef);

if (userSnap.exists()) {

setUserProfile(userSnap.data());

} else {

/*
----------------------------------------------------------
CREATE USER PROFILE IF MISSING
----------------------------------------------------------
*/

const newUser = {

name: user.displayName || "Unknown",

email: user.email,

role: "student",

createdAt: serverTimestamp()

};

await setDoc(userRef, newUser);

setUserProfile(newUser);

}

} catch (error) {

console.error(
"Failed loading user profile",
error
);

}

} else {

/*
----------------------------------------------------------
USER LOGGED OUT
----------------------------------------------------------
*/

setCurrentUser(null);

setUserProfile(null);

}

setLoading(false);

}

);

return unsubscribe;

}, []);



/*
==============================================================
ROLE CHECK HELPERS
==============================================================
*/

const isStudent = () => {

return userProfile?.role === "student";

};

const isCommittee = () => {

return userProfile?.role === "committee";

};

const isAdmin = () => {

return userProfile?.role === "admin";

};

const isAuthority = () => {

return userProfile?.role === "authority";

};



/*
==============================================================
AUTH CONTEXT VALUE
==============================================================
*/

const value = {

currentUser,

userProfile,

loginWithGoogle,

logout,

loading,

authError,

isStudent,

isCommittee,

isAdmin,

isAuthority

};



/*
==============================================================
RENDER PROVIDER
==============================================================
*/

return (

<AuthContext.Provider value={value}>

{!loading && children}

</AuthContext.Provider>

);

};