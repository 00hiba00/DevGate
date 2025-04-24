// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; // 👈 Manquait

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQEwLegQyXxmCx2qD8qX7UcAv7SdyTWeM",
  authDomain: "dev-gate-f1549.firebaseapp.com",
  projectId: "dev-gate-f1549",
  storageBucket: "dev-gate-f1549.firebasestorage.app",
  messagingSenderId: "807306867408",
  appId: "1:807306867408:web:f00b7619b9d99541fd64d5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app); // 👈 Ajout

export { db, auth, storage };