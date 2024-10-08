import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDPCaMe7X93-ucB1e0QACC5N9tttegLu-k",
  authDomain: "fitbalace360.firebaseapp.com",
  projectId: "fitbalace360",
  storageBucket: "fitbalace360.appspot.com",
  messagingSenderId: "809252005093",
  appId: "1:809252005093:web:f3fc268f279462ec51200c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firebase Storage
const storage = getStorage(app);

// Initialize Firestore Database
const db = getFirestore(app);

// Export auth, storage, and database for use in your application
export { auth, storage, db };
