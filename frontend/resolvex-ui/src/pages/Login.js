import React from "react";
import { auth, db } from "../services/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

function Login() {

  const loginWithGoogle = async () => {

    const provider = new GoogleAuthProvider();

    try {

      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      const userRef = doc(db, "users", user.uid);

      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {

        await setDoc(userRef, {
          name: user.displayName,
          email: user.email,
          role: "student",
          createdAt: serverTimestamp()
        });

        console.log("User created in database");

      } else {

        console.log("User already exists");

      }

      alert("Login successful!");

    } catch (error) {

      console.error("Login error:", error);

    }

  };

  return (

    <div style={{ padding: "20px" }}>

      <h2>Login to ResolveX</h2>

      <button onClick={loginWithGoogle}>
        Sign in with Google
      </button>

    </div>

  );

}

export default Login;