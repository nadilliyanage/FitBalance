import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BASE_URL } from "@env";

// Create AuthContext
const AuthContext = createContext();

// AuthProvider to manage global authentication state
const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    user: null,
    token: null,
  });

  axios.defaults.baseURL = API_BASE_URL;

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
