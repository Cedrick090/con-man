// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDw-0SIDO6F0bz_Y3mhRonwJUaEOZcD2EA",
  authDomain: "ionic-conam.firebaseapp.com",
  databaseURL: "https://ionic-conam-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ionic-conam",
  storageBucket: "ionic-conam.firebasestorage.app",
  messagingSenderId: "68415464644",
  appId: "1:68415464644:web:a6caf2415999a6334e1591",
  measurementId: "G-5RLE0XDEN5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

console.log('Firebase Project:', app.options.projectId);

// IMPORTANT:
// Your Firestore database ID appears to be "default"
export const db = getFirestore(app, 'default');