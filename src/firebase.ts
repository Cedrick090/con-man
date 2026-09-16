// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
