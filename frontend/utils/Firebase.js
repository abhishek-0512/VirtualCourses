import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeApp, getApps, getApp } from "firebase/app";

// Use environment variables for all Firebase settings so configs can be swapped per-environment
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_FIREBASE_APPID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENTID,
};

// Initialize Firebase (avoid duplicate app error during HMR)
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  try {
    app = getApp();
  } catch (e) {
    app = initializeApp(firebaseConfig);
  }
}
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };