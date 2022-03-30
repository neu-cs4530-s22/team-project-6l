// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCY6FF-e9h48NmhLu3WrHdWOzn7bjN_i1g",
  authDomain: "coveytown-ac1e3.firebaseapp.com",
  projectId: "coveytown-ac1e3",
  storageBucket: "coveytown-ac1e3.appspot.com",
  messagingSenderId: "987672035225",
  appId: "1:987672035225:web:094db237029f4c824fdd08",
  measurementId: "G-6E85LP2QW8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export default auth;