// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "mern-estate-662e1.firebaseapp.com",
  projectId: "mern-estate-662e1",
  storageBucket: "mern-estate-662e1.firebasestorage.app",
  messagingSenderId: "648776767056",
  appId: "1:648776767056:web:6a0e9980e3ab6768212355"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);