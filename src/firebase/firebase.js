import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Vos clés de configuration récupérées sur la console Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAQEwLegQyXxmCx2qD8qX7UcAv7SdyTWeM",
    authDomain: "dev-gate-f1549.firebaseapp.com",
    projectId: "dev-gate-f1549",
    storageBucket: "dev-gate-f1549.firebasestorage.app",
    messagingSenderId: "807306867408",
    appId: "1:807306867408:web:f00b7619b9d99541fd64d5"
  };
  

// Initialiser l'application Firebase
const app = initializeApp(firebaseConfig);

// Initialiser les services que vous souhaitez utiliser
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };