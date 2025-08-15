// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getDatabase } from "firebase/database"
import { getAuth } from "firebase/auth"
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGfRa_Ynua8gtYC-hGPdGC5zqKqO3nods",
  authDomain: "houselook-fd529.firebaseapp.com",
  databaseURL: "https://houselook-fd529-default-rtdb.firebaseio.com",
  projectId: "houselook-fd529",
  storageBucket: "houselook-fd529.appspot.com",
  messagingSenderId: "115183142097",
  appId: "1:115183142097:web:86421e125e5ae230cbf1f0",
  measurementId: "G-KQ00M1SZZM"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);

