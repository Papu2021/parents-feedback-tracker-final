// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCeqhbpVx19EhwvaOLAGE2KaL6Xbpb45gg",
  authDomain: "parent-tracker-250dc.firebaseapp.com",
  projectId: "parent-tracker-250dc",
  storageBucket: "parent-tracker-250dc.firebasestorage.app",
  messagingSenderId: "671052401832",
  appId: "1:671052401832:web:80a2a4169f3129e173469d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;