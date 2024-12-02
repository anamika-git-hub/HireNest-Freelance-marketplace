// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBkCbcH73hM6gKw-I6KsnLgrhF7mpVUffA",
  authDomain: "hirenest-freelance-marketplace.firebaseapp.com",
  projectId: "hirenest-freelance-marketplace",
  storageBucket: "hirenest-freelance-marketplace.firebasestorage.app",
  messagingSenderId: "123364275956",
  appId: "1:123364275956:web:d7a2135da0e3e0ff3010a1",
  measurementId: "G-7WZJDRTFE8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);