// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

// Initialize Firebase Storage
const storage = getStorage(app);

export { storage };
