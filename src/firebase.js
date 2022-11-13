// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAiA-JiJmEk_nghK7M1EMpKRsv12arij8w",
  authDomain: "real-estate-react-a3772.firebaseapp.com",
  projectId: "real-estate-react-a3772",
  storageBucket: "real-estate-react-a3772.appspot.com",
  messagingSenderId: "396553959823",
  appId: "1:396553959823:web:5754708cba4241c0f0b3fa"
};

// Initialize Firebase
initializeApp(firebaseConfig);

export const db = getFirestore();