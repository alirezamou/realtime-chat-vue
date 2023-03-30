import { initializeApp } from "firebase/app";
import "firebase/auth";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: "AIzaSyD_NmalsA5nkj3xI86AIWv5ibEHFKF9dsk",
  authDomain: "realtime-chat-app-53d22.firebaseapp.com",
  projectId: "realtime-chat-app-53d22",
  storageBucket: "realtime-chat-app-53d22.appspot.com",
  messagingSenderId: "765806176442",
  appId: "1:765806176442:web:9e5738010a39f945233a83",
};

export const FirebaseApp = initializeApp(firebaseConfig);
export const FirebaseDb = getFirestore(FirebaseApp);
export const FirebaseAuth = getAuth(FirebaseApp);
