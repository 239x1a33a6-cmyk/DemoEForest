// Firebase initialization and exports
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

// Default config provided by the user. If you prefer using environment variables,
// set NEXT_PUBLIC_FIREBASE_* vars in your environment and they'll be used instead.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyA0ewW4PhaFWe-feU_XZWd9fsEuXhuiiCI",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "eforest25108.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "eforest25108",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "eforest25108.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "101890590988",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:101890590988:web:a41da5e884bde2b4f82129",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-TLZBTEEMDL",
};

// Initialize app (guard against double initialization)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Expose lazy getters for client-only services. In Next.js server components or
// during SSR these will be null; call these functions from client code.
export function getAuthClient(): Auth | null {
  if (typeof window === "undefined") return null;
  return getAuth(app);
}

export function getFirestoreClient(): Firestore {
  return getFirestore(app);
}

export function getStorageClient(): FirebaseStorage | null {
  if (typeof window === "undefined") return null;
  return getStorage(app);
}

export default app;
