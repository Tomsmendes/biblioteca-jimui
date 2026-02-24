// Import the functions you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "biblioteca-jimui.firebaseapp.com",
  projectId: "biblioteca-jimui",
  storageBucket: "biblioteca-jimui.firebasestorage.app",
  messagingSenderId: "150578605856",
  appId: "1:150578605856:web:3cd4b7ae5ef8b24cdb3145",
  measurementId: "G-HRS7RQWJ8V"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Analytics (opcional)
const analytics = getAnalytics(app);

// Firestore
const db = getFirestore(app);

// 🔥 Ativar modo offline
enableIndexedDbPersistence(db)
  .then(() => {
    console.log("Persistência offline ativada");
  })
  .catch((err) => {
    console.error("Erro ao ativar offline:", err.code);
  });

export { db };
