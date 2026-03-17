
import React,
{
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import
{
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithRedirect,
  getRedirectResult,
  signOut
} from "firebase/auth";

import { auth } from "../services/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const initAuth = async () => {

      try {

        await getRedirectResult(auth);

      } catch (error) {

        console.warn("Redirect result error:", error);

      }

      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {

        console.log("AUTH STATE:", firebaseUser);

        setUser(firebaseUser);
        setLoading(false);

      });

      return unsubscribe;

    };

    initAuth();

  }, []);

  const loginWithGoogle = async () => {

    const provider = new GoogleAuthProvider();

    await signInWithRedirect(auth, provider);

  };

  const logout = async () => {

    await signOut(auth);

  };

  const value =
  {
    user,
    loading,
    loginWithGoogle,
    logout
  };

  return (

    <AuthContext.Provider value={value}>

      {children}

    </AuthContext.Provider>

  );

}

export function useAuth() {

  return useContext(AuthContext);

}

