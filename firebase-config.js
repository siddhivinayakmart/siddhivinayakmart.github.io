// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD5BXtGVmpV38HpBKGWY4VBa_biwfkRqBc",
  authDomain: "siddhivinayakmart-login-signup.firebaseapp.com",
  projectId: "siddhivinayakmart-login-signup",
  storageBucket: "siddhivinayakmart-login-signup.firebasestorage.app",
  messagingSenderId: "173213379434",
  appId: "1:173213379434:web:fa314ea655888eeb7ed313",
  measurementId: "G-82T71HQNJZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);