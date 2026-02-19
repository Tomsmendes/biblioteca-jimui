// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBo06ZawAIBm48baJLIYsQleRQ0hfFs9ZQ",
  authDomain: "biblioteca-jimui.firebaseapp.com",
  projectId: "biblioteca-jimui",
  storageBucket: "biblioteca-jimui.firebasestorage.app",
  messagingSenderId: "150578605856",
  appId: "1:150578605856:web:3cd4b7ae5ef8b24cdb3145",
  measurementId: "G-HRS7RQWJ8V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Inicializa Firestore
const db = getFirestore(app);

// Habilita persistência offline
enableIndexedDbPersistence(db).catch((err) => {
  console.error("Falha ao ativar offline:", err.code);
});

export { db };


