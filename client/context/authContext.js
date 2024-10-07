import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../firebaseConfig"; // Import Firebase auth
import { onAuthStateChanged } from "firebase/auth";

// Create AuthContext
const AuthContext = createContext();

// AuthProvider to manage global authentication state
const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    user: null,
    token: null,
  });

  // Listen for Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // If user is logged in, get the token
        const token = await user.getIdToken();

        setState({
          user: user,
          token: token,
        });

        // Optionally save user data in AsyncStorage
        await AsyncStorage.setItem("@auth", JSON.stringify({ user, token }));
      } else {
        // Clear the state if no user is logged in
        setState({ user: null, token: null });
        await AsyncStorage.removeItem("@auth");
      }
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={[state, setState]}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
