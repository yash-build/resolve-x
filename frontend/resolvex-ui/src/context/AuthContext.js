import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {

  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (user) => {

      if (user) {

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {

          await setDoc(userRef, {
            name: user.displayName,
            email: user.email,
            role: "student",
            createdAt: new Date()
          });

          setRole("student");

        } else {

          setRole(userSnap.data().role);

        }

        setCurrentUser(user);

      } else {

        setCurrentUser(null);
        setRole(null);

      }

      setLoading(false);

    });

    return unsubscribe;

  }, []);

  const value = {
    currentUser,
    role
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );

};