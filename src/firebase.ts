<<<<<<< HEAD
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
=======
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
>>>>>>> 9a6e6a4 (3)

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDw-0SIDO6F0bz_Y3mhRonwJUaEOZcD2EA",
  authDomain: "ionic-conam.firebaseapp.com",
<<<<<<< HEAD
  databaseURL: "https://ionic-conam-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ionic-conam",
  storageBucket: "ionic-conam.firebasestorage.app",
  messagingSenderId: "68415464644",
  appId: "1:68415464644:web:a6caf2415999a6334e1591",
  measurementId: "G-5RLE0XDEN5"
=======
  projectId: "ionic-conam",
  storageBucket: "ionic-conam.firebasestorage.app",
  messagingSenderId: "68415464644",
  appId: "1:68415464644:web:a6caf2415999a6334e1591"
>>>>>>> 9a6e6a4 (3)
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
<<<<<<< HEAD
const analytics = getAnalytics(app);
=======

console.log('Firebase Project:', app.options.projectId);

// IMPORTANT:
// Your Firestore database ID appears to be "default"
export const db = getFirestore(app, 'default');
>>>>>>> 9a6e6a4 (3)
