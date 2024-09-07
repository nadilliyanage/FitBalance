import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Create AuthContext
const AuthContext = createContext();

// AuthProvider to manage global authentication state
const AuthProvider = ({ children }) => {
  // Global state for authentication
  const [state, setState] = useState({
    user: null,
    token: null,
  });

  // Set default base URL for axios
  axios.defaults.baseURL = "http://192.168.1.106:8000/api/v1";

  // Load authentication data from local storage on component mount
  useEffect(() => {
    const loadLocalStorageData = async () => {
      try {
        const data = await AsyncStorage.getItem("@auth");
        if (data) {
          const parsedData = JSON.parse(data);
          if (parsedData) {
            setState({
              user: parsedData.user || null,
              token: parsedData.token || null,
            });
          }
        }
      } catch (error) {
        console.error("Error loading data from local storage:", error);
      }
    };

    loadLocalStorageData();
  }, []);

  // Automatically set authorization token in axios headers if it exists
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${state.token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [state.token]);

  return (
    <AuthContext.Provider value={[state, setState]}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
