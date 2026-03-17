// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBpgjuf-PK12m-P3XiVeGO1RdB2T7I-DT4",
  authDomain: "her-rise.firebaseapp.com",
  projectId: "her-rise",
  storageBucket: "her-rise.firebasestorage.app",
  messagingSenderId: "1001640909388",
  appId: "1:1001640909388:web:f6c4628ce9b88eac0572e9",
  measurementId: "G-R43YM7J5V7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);