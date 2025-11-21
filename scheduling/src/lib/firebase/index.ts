// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyApmt8BWwyz6ZsMJ7HEesLt8JRAyAVTrsU",
  authDomain: "fithub-classes.firebaseapp.com",
  projectId: "fithub-classes",
  storageBucket: "fithub-classes.firebasestorage.app",
  messagingSenderId: "576973619386",
  appId: "1:576973619386:web:97384c3105fbfe94830283"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);