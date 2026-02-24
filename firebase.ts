import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "biblioteca-jimui.firebaseapp.com",
  projectId: "biblioteca-jimui",
  storageBucket: "biblioteca-jimui.appspot.com",
  messagingSenderId: "150578605856",
  appId: "1:150578605856:web:xxxxx",
};

const app = initializeApp(firebaseConfig);

export const firestore = getFirestore(app);

enableIndexedDbPersistence(firestore).catch((err) => {
  console.error("Erro offline:", err.code);
});
