// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDf9qggd8j9bX-tqzo3ZLfiFQbXA7wmFr8",
  authDomain: "first-c93cc.firebaseapp.com",
  projectId: "first-c93cc",
  storageBucket: "first-c93cc.firebasestorage.app",
  messagingSenderId: "1010599250174",
  appId: "1:1010599250174:web:f5e9ad77b846d07a163daf",
  measurementId: "G-1B12MK5TSP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
