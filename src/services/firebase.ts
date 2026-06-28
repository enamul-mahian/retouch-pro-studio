import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// টেস্টিং লগ - কনসোলে চেক করার জন্য
console.log("Firebase initializing with FIXED API Key (O instead of 0)...");

// Your web app's EXACT Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCglt-pJO-ysrgSx643Ivk2KvwaDKzSGUY", // Corrected O instead of 0
  authDomain: "retouch-pro-studio.firebaseapp.com",
  projectId: "retouch-pro-studio",
  storageBucket: "retouch-pro-studio.firebasestorage.app",
  messagingSenderId: "1011613231285",
  appId: "1:1011613231285:web:4a76c0c90e35cc24ddf6fc"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firestore Database
export const db = getFirestore(app);

console.log("Firebase successfully connected!");

export default app;